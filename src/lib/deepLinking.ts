import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';

export interface DeepLinkPayload {
  action?: 'dhikr' | 'target' | 'routine' | 'theme' | 'screen';
  dhikrId?: string;
  targetCount?: number;
  routineId?: string;
  themeName?: string;
  screen?: string;
  rawUrl?: string;
}

/**
 * Parses any incoming deep link URL (Custom Scheme or HTTPS App Link)
 * Examples:
 * - tasbeehly://dhikr?id=subhanallah
 * - tasbeehly://target?count=100
 * - https://serene-tasbeeh-main.vercel.app/open?dhikr=subhanallah&target=100
 */
export function parseDeepLinkUrl(urlStr: string): DeepLinkPayload | null {
  try {
    const url = new URL(urlStr);
    const params = new URLSearchParams(url.search);

    const payload: DeepLinkPayload = { rawUrl: urlStr };

    // Scheme or host route checking
    const path = url.pathname.replace(/^\//, '').toLowerCase();
    const host = url.host.toLowerCase();

    // Check action type from hostname or pathname
    if (host === 'dhikr' || path === 'dhikr' || params.has('dhikr')) {
      payload.action = 'dhikr';
      payload.dhikrId = params.get('id') || params.get('dhikr') || undefined;
    } else if (host === 'target' || path === 'target' || params.has('target')) {
      payload.action = 'target';
      const cnt = parseInt(params.get('count') || params.get('target') || '0', 10);
      if (cnt > 0) payload.targetCount = cnt;
    } else if (host === 'routine' || path === 'routine' || params.has('routine')) {
      payload.action = 'routine';
      payload.routineId = params.get('id') || params.get('routine') || undefined;
    } else if (host === 'theme' || path === 'theme' || params.has('theme')) {
      payload.action = 'theme';
      payload.themeName = params.get('name') || params.get('theme') || undefined;
    }

    // Check global params regardless of path
    if (!payload.dhikrId && params.has('dhikr')) payload.dhikrId = params.get('dhikr') || undefined;
    if (!payload.targetCount && params.has('target')) {
      const cnt = parseInt(params.get('target') || '0', 10);
      if (cnt > 0) payload.targetCount = cnt;
    }

    return payload;
  } catch (err) {
    console.error('Failed to parse deep link URL:', urlStr, err);
    return null;
  }
}

/**
 * Executes deep link payload action in the app store
 */
export function executeDeepLink(payload: DeepLinkPayload): boolean {
  if (!payload) return false;
  const store = useTasbeehStore.getState();
  let executed = false;

  // 1. Set Dhikr if provided
  if (payload.dhikrId) {
    const dhikrList = store.dhikrs || [];
    const found = dhikrList.find(d => 
      d.id === payload.dhikrId || 
      d.transliteration?.toLowerCase() === payload.dhikrId?.toLowerCase() ||
      d.translation?.toLowerCase() === payload.dhikrId?.toLowerCase()
    );

    if (found) {
      store.setDhikr(found);
      toast.success(`📿 Opened Dhikr: ${found.transliteration || found.translation}`);
      executed = true;
    }
  }

  // 2. Set Target Count if provided
  if (payload.targetCount && payload.targetCount > 0) {
    store.setTarget(payload.targetCount);
    toast.success(`🎯 Target count set to ${payload.targetCount}!`);
    executed = true;
  }

  // 3. Set Theme if provided
  if (payload.themeName) {
    store.setTheme(payload.themeName as any);
    toast.success(`🎨 Theme updated: ${payload.themeName}`);
    executed = true;
  }

  return executed;
}

/**
 * Initializes deep link listeners for Capacitor Native and Web PWA
 * Supports Deferred Deep Linking (first launch after install)
 */
export function initDeepLinking() {
  // 1. Check for Deferred Deep Link stored before app install / launch
  const deferredUrl = localStorage.getItem('tasbeehly_deferred_link');
  if (deferredUrl) {
    localStorage.removeItem('tasbeehly_deferred_link');
    const payload = parseDeepLinkUrl(deferredUrl);
    if (payload) {
      setTimeout(() => executeDeepLink(payload), 800);
    }
  }

  // 2. Check initial web URL (for PWA / Web browser startup)
  if (typeof window !== 'undefined' && window.location.search) {
    const currentUrl = window.location.href;
    const payload = parseDeepLinkUrl(currentUrl);
    if (payload && (payload.dhikrId || payload.targetCount || payload.themeName)) {
      setTimeout(() => executeDeepLink(payload), 500);
    }
  }

  // 3. Capacitor Native App URL Open Listener (App Links / Custom Schemes)
  if (Capacitor.isNativePlatform()) {
    CapApp.addListener('appUrlOpen', (data) => {
      console.log('App opened with deep link URL:', data.url);
      const payload = parseDeepLinkUrl(data.url);
      if (payload) {
        executeDeepLink(payload);
      }
    });
  }
}

/**
 * Helper to generate and share a Deferred Deep Link for Dhikr / Target / Routine
 */
export async function shareDeferredDeepLink(options: {
  dhikrId?: string;
  targetCount?: number;
  title?: string;
}) {
  const baseUrl = 'https://serene-tasbeeh-main.vercel.app/open';
  const query = new URLSearchParams();

  if (options.dhikrId) query.set('dhikr', options.dhikrId);
  if (options.targetCount) query.set('target', options.targetCount.toString());

  const deferredLink = `${baseUrl}?${query.toString()}`;
  const customSchemeLink = `tasbeehly://open?${query.toString()}`;

  const shareText = `Join me in Dhikr on Tasbeehly!\n${options.title || 'Open Dhikr'}: ${deferredLink}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Tasbeehly Dhikr Share',
        text: shareText,
        url: deferredLink,
      });
      toast.success('Deep link shared successfully! 🚀');
      return;
    } catch (err) {
      console.log('Share cancelled or unsupported, copying to clipboard instead:', err);
    }
  }

  try {
    await navigator.clipboard.writeText(deferredLink);
    toast.success('Deferred deep link copied to clipboard! 📋');
  } catch {
    toast.error('Failed to copy deep link.');
  }
}
