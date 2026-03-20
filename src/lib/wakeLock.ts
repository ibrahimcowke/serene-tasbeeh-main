/**
 * Screen Wake Lock API utility
 * Prevents the screen from dimming or turning off
 */

let wakeLock: WakeLockSentinel | null = null;

/**
 * Request a Screen Wake Lock
 * @returns Promise<boolean> Success status
 */
export const requestWakeLock = async (): Promise<boolean> => {
  if (!('wakeLock' in navigator)) {
    console.warn('Wake Lock API not supported in this browser');
    return false;
  }

  if (document.visibilityState !== 'visible') {
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('✅ Screen Wake Lock is active');
    
    wakeLock.addEventListener('release', () => {
      console.log('🔓 Screen Wake Lock was released');
      wakeLock = null;
    });
    
    return true;
  } catch (err: any) {
    console.error(`❌ Failed to request Wake Lock: ${err.name}, ${err.message}`);
    return false;
  }
};

/**
 * Release the current Screen Wake Lock
 */
export const releaseWakeLock = async () => {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
};

/**
 * Check if a Wake Lock is currently active
 */
export const isWakeLockActive = (): boolean => {
  return wakeLock !== null;
};

/**
 * Check if the Wake Lock API is supported
 */
export const isWakeLockSupported = (): boolean => {
  return 'wakeLock' in navigator;
};
