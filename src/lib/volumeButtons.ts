/**
 * Volume button listener utility
 * Intercepts volume up/down keys to trigger counter actions
 */

type VolumeCallback = (direction: 'up' | 'down') => void;

let currentCleanup: (() => void) | null = null;

/**
 * Initialize volume button listeners
 * @param callback Function to call when volume button is pressed
 * @returns Cleanup function
 */
export const initVolumeButtonListener = (callback: VolumeCallback): (() => void) => {
  // If there's an existing listener, clean it up first
  if (currentCleanup) {
    currentCleanup();
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Volume Up: AudioVolumeUp (most modern), VolumeUp (older)
    // Volume Down: AudioVolumeDown (most modern), VolumeDown (older)
    if (event.key === 'VolumeUp' || event.key === 'AudioVolumeUp') {
      event.preventDefault();
      callback('up');
    } else if (event.key === 'VolumeDown' || event.key === 'AudioVolumeDown') {
      event.preventDefault();
      callback('down');
    }
  };

  const handleVolumeUp = () => {
    callback('up');
  };

  const handleVolumeDown = () => {
    callback('down');
  };

  // Add standard keyboard listeners (for web and desktop testing)
  window.addEventListener('keydown', handleKeyDown, { capture: true });

  // Add custom listeners for native events dispatched by Android MainActivity
  window.addEventListener('volumeUp', handleVolumeUp);
  window.addEventListener('volumeDown', handleVolumeDown);

  // Enable interception on Android side
  if (typeof (window as any).AndroidVolumeButtons !== 'undefined') {
    (window as any).AndroidVolumeButtons.setVolumeButtonCounting(true);
  }

  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('volumeUp', handleVolumeUp);
    window.removeEventListener('volumeDown', handleVolumeDown);
    
    // Disable interception on Android side
    if (typeof (window as any).AndroidVolumeButtons !== 'undefined') {
      (window as any).AndroidVolumeButtons.setVolumeButtonCounting(false);
    }
    
    currentCleanup = null;
  };

  currentCleanup = cleanup;
  return cleanup;
};
