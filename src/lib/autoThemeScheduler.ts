/**
 * Auto Theme Scheduler — switches between light and dark theme
 * at Fajr (dawn) and Maghrib (dusk) based on prayer times.
 */
import { useTasbeehStore } from '@/store/tasbeehStore';
import { getPrayerTimesForToday } from './prayerTimes';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const SAVED_DARK_THEME_KEY = 'tasbeehly_auto_theme_pre_fajr';

async function checkAndApplyTheme() {
  const store = useTasbeehStore.getState();
  if (!store.autoThemeDawnDusk) return;

  const times = await getPrayerTimesForToday();
  if (!times.length) return;

  const fajr = times.find(t => t.name === 'fajr');
  const maghrib = times.find(t => t.name === 'maghrib');
  if (!fajr || !maghrib) return;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const fajrMins = timeToMinutes(fajr.time);
  const maghribMins = timeToMinutes(maghrib.time);

  // Between Fajr and Maghrib → light theme
  const shouldBeLight = nowMins >= fajrMins && nowMins < maghribMins;
  const currentTheme = store.theme;

  if (shouldBeLight && currentTheme !== 'light') {
    // Save the current dark theme before switching to light
    try { localStorage.setItem(SAVED_DARK_THEME_KEY, currentTheme); } catch {}
    store.setTheme('light');
  } else if (!shouldBeLight && currentTheme === 'light') {
    // Restore the saved dark theme, or fall back to theme-nord-midnight
    let darkTheme = 'theme-nord-midnight';
    try {
      const saved = localStorage.getItem(SAVED_DARK_THEME_KEY);
      if (saved && saved !== 'light') darkTheme = saved;
    } catch {}
    store.setTheme(darkTheme as any);
  }
}

export function startAutoThemeScheduler() {
  if (schedulerInterval) return;
  checkAndApplyTheme(); // immediate check
  schedulerInterval = setInterval(checkAndApplyTheme, 60_000); // check every minute
}

export function stopAutoThemeScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
