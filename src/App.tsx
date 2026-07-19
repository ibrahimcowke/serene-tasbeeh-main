import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useRef } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const MiniCounter = lazy(() => import("./pages/MiniCounter"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Welcome = lazy(() => import("./pages/Welcome"));

import { ThemeProvider } from "./components/ThemeProvider";
const CongratsPopup = lazy(() => import("./components/CongratsPopup").then(m => ({ default: m.CongratsPopup })));
const PWAInstallPrompt = lazy(() => import("./components/PWAInstallPrompt").then(m => ({ default: m.PWAInstallPrompt })));
const PrayerTimesPermissionModal = lazy(() => import("./components/PrayerTimesPermissionModal").then(m => ({ default: m.PrayerTimesPermissionModal })));
const AmbientSoundPlayer = lazy(() => import("./components/AmbientSoundPlayer").then(m => ({ default: m.AmbientSoundPlayer })));
import { registerPeriodicSync, NotificationManager } from "./lib/notifications";
import { useTasbeehStore } from "./store/tasbeehStore";
import { SoundManager } from "./lib/sound";
import { scheduleLazyDayNotification, cancelLazyDayNotification } from "./lib/lazyDayRecovery";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { startAutoThemeScheduler, stopAutoThemeScheduler } from "./lib/autoThemeScheduler";
const GoogleLoginScreen = lazy(() => import("./components/GoogleLoginScreen").then(m => ({ default: m.GoogleLoginScreen })));
import { toast } from "sonner";


const queryClient = new QueryClient();

import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapApp } from '@capacitor/app';

// Auth states: null = still checking, true = authenticated, false = not authenticated
type AuthState = null | boolean;

const LoadingScreen = () => (
  <div className="h-dvh w-full flex flex-col items-center justify-center bg-[#050210]">
    <div
      className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
      style={{ borderTopColor: '#fbbf24', borderRightColor: 'rgba(251,191,36,0.3)' }}
    />
  </div>
);

const useForegroundReminders = () => {
  const reminders = useTasbeehStore((s) => s.reminders);
  const reminderEnabled = useTasbeehStore((s) => s.reminderEnabled);
  const lastPlayedRef = useRef<string>('');

  useEffect(() => {
    if (!reminderEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, ..., 6 = Saturday
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHour}:${currentMinute}`;
      const playKey = `${currentTimeString}-${now.getDate()}`;

      if (lastPlayedRef.current === playKey) return;

      const activeReminder = reminders.find(
        (r) => r.enabled && r.time === currentTimeString && r.days.includes(currentDay)
      );

      if (activeReminder) {
        lastPlayedRef.current = playKey;
        if (activeReminder.soundType && activeReminder.soundType !== 'default') {
          SoundManager.playVoiceReminder(activeReminder.soundType);
          toast(`Time for Dhikr: ${activeReminder.label}`, {
            description: "A gentle spoken reminder to remember Allah.",
            duration: 5000,
          });
        }
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 15000);
    return () => clearInterval(interval);
  }, [reminders, reminderEnabled]);
};

const App = () => {
  // Call foreground reminder hook
  useForegroundReminders();

  const hasSeenWelcome = useTasbeehStore((s) => s.hasSeenWelcome);
  const lazyDayRecoveryEnabled = useTasbeehStore((s) => s.lazyDayRecoveryEnabled);
  // null = still checking Firebase auth state (avoid flashing login screen)
  const [authState, setAuthState] = useState<AuthState>(null);
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('tasbeehly_guest_mode') === 'true';
  });

  const autoThemeDawnDusk = useTasbeehStore((s) => s.autoThemeDawnDusk);

  // Schedule or cancel Lazy Day Recovery notification
  useEffect(() => {
    if (lazyDayRecoveryEnabled) {
      scheduleLazyDayNotification();
    } else {
      cancelLazyDayNotification();
    }
  }, [lazyDayRecoveryEnabled]);

  // Auto Fajr/Maghrib theme switching
  useEffect(() => {
    if (autoThemeDawnDusk) {
      startAutoThemeScheduler();
    } else {
      stopAutoThemeScheduler();
    }
    return () => stopAutoThemeScheduler();
  }, [autoThemeDawnDusk]);

  // Suggest notifications after 2 minutes of app usage if not enabled yet
  useEffect(() => {
    const suggestNotifications = async () => {
      const store = useTasbeehStore.getState();
      
      // If reminders are already enabled in the store, no need to suggest
      if (store.reminderEnabled) return;

      // If we already suggested in this session/ever, do not suggest again
      const hasSuggested = localStorage.getItem('tasbeehly_notif_suggested');
      if (hasSuggested === 'true') return;

      // Check permission status
      const permission = await NotificationManager.checkPermission();
      if (permission === 'granted') return;

      toast("Don't miss your daily Dhikr!", {
        description: "Enable reminders and daily notifications to keep up with your goals.",
        action: {
          label: "Enable",
          onClick: async () => {
            const granted = await NotificationManager.requestPermission();
            if (granted) {
              store.setReminderEnabled(true);
              toast.success("Notifications and reminders enabled!");
            } else {
              if ('Notification' in window) {
                const webPermission = await Notification.requestPermission();
                if (webPermission === 'granted') {
                  store.setReminderEnabled(true);
                  toast.success("Notifications and reminders enabled!");
                  return;
                }
              }
              toast.error("Permission denied. You can enable them later in Settings.");
            }
          }
        },
        duration: 8000,
      });

      // Mark as suggested so we don't prompt again
      localStorage.setItem('tasbeehly_notif_suggested', 'true');
    };

    const timer = setTimeout(suggestNotifications, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleGuestChange = () => {
      setIsGuest(localStorage.getItem('tasbeehly_guest_mode') === 'true');
    };
    window.addEventListener('guest-mode-change', handleGuestChange);
    return () => window.removeEventListener('guest-mode-change', handleGuestChange);
  }, []);

  useEffect(() => {
    registerPeriodicSync();
    
    // Background Geolocation & Prayer Times Sync
    import("./lib/prayerTimes").then(({ initPrayerTimeReminders }) => {
      initPrayerTimeReminders().catch(() => {});
    });

    // Resume AudioContext on first user interaction
    const handleGesture = () => {
      import("./lib/sound").then(({ SoundManager }) => {
        SoundManager.resume();
      });
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
    
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });

    // Native Mobile Adjustments
    const configureNative = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
        await Keyboard.setAccessoryBarVisible({ isVisible: false });
      } catch (e) {
        // Ignore on web
      }
    };
    
    configureNative();

    // Handle hardware back button for Capacitor
    const handleBackButton = async () => {
      // 1. Check if there are any open overlays, sheets, drawers, or dialogs
      const openOverlay = document.querySelector('[role="dialog"], [data-state="open"], .custom-overlay-open');
      
      if (openOverlay) {
        // Dispatch an Escape key event to close it
        const escEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          code: 'Escape',
          keyCode: 27,
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(escEvent);
        return;
      }

      // 2. If no overlay is open, handle navigation back
      if (window.location.pathname !== '/') {
        window.history.back();
      } else {
        // If we are at the home path, minimize the app
        CapApp.minimizeApp().catch(() => {});
      }
    };

    const backButtonListener = CapApp.addListener('backButton', () => {
      handleBackButton();
    });
    
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      backButtonListener.then(l => l.remove()).catch(() => {});
    };
  }, []);

  // Single source of truth: Firebase auth state listener lives ONLY here in App.tsx
  useEffect(() => {
    // 1. Stop auto count when app is backgrounded / hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const store = useTasbeehStore.getState();
        if (store.autoCountActive) {
          store.stopAutoCount();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. Firebase auth session sync
    let unsubscribeAuth: (() => void) | null = null;
    
    const initAuth = async () => {
      const { auth } = await import("./lib/firebase");
      unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
        const store = useTasbeehStore.getState();
        if (user) {
          // Block unverified email/password accounts
          const isEmailAuth = user.providerData.some(p => p.providerId === 'password');
          if (isEmailAuth && !user.emailVerified) {
            await auth.signOut();
            setAuthState(false);
            return;
          }
          setAuthState(true);
          localStorage.removeItem('tasbeehly_guest_mode');
          setIsGuest(false);

          const cloudUuid = `auth_user_${user.uid}`;
          if (store.deviceUuid !== cloudUuid) {
            store.setDeviceUuid(cloudUuid);
          }
          import("./lib/cloudSync").then(({ syncFromCloud, startCloudSync }) => {
            syncFromCloud(user.uid).then(() => {
              startCloudSync(user.uid);
            });
          });
        } else {
          setAuthState(false);
          import("./lib/cloudSync").then(({ stopCloudSync }) => {
            stopCloudSync();
          });
        }
      });
    };

    initAuth();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (unsubscribeAuth) {
        (unsubscribeAuth as () => void)();
      }
      import("./lib/cloudSync").then(({ stopCloudSync }) => {
        stopCloudSync();
      });
    };
  }, []);

  const showMainApp = authState === true || isGuest;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={null}>
            <CongratsPopup />
            <PWAInstallPrompt />
            <AmbientSoundPlayer />
          </Suspense>
          {authState === null ? (
            // Firebase is still determining auth state — show spinner instead of flashing login screen
            <LoadingScreen />
          ) : (
            // Render the App routes wrapped in BrowserRouter
            <ErrorBoundary>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={null}>
                  <PrayerTimesPermissionModal />
                </Suspense>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    {/* Privacy Policy is always publicly accessible */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    
                    {showMainApp ? (
                      <>
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/" element={hasSeenWelcome ? <Index /> : <Navigate to="/welcome" replace />} />
                        <Route path="/mini" element={<MiniCounter />} />
                        <Route path="/challenges" element={<Challenges />} />
                        <Route path="*" element={<NotFound />} />
                      </>
                    ) : (
                      <>
                        <Route path="*" element={
                          <GoogleLoginScreen onLoginSuccess={() => setAuthState(true)} />
                        } />
                      </>
                    )}
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

