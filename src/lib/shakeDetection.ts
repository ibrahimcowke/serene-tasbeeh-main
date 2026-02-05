/**
 * Shake detection utility using DeviceMotionEvent
 * Detects vigorous device shaking for reset functionality
 */

type ShakeCallback = () => void;

interface ShakeDetectionOptions {
  threshold?: number; // Acceleration threshold (default: 15)
  timeout?: number; // Debounce timeout in ms (default: 1000)
}

/**
 * Initialize shake detection
 * @param callback Function to call when shake is detected
 * @param options Configuration options
 * @returns Cleanup function to remove event listeners
 */
export const initShakeDetection = (
  callback: ShakeCallback,
  options: ShakeDetectionOptions = {}
): (() => void) => {
  const { threshold = 15, timeout = 1000 } = options;
  
  let lastShakeTime = 0;
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;

  const handleMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    
    if (!acceleration) return;

    const { x = 0, y = 0, z = 0 } = acceleration;
    
    // Calculate the change in acceleration
    const deltaX = Math.abs(x - lastX);
    const deltaY = Math.abs(y - lastY);
    const deltaZ = Math.abs(z - lastZ);
    
    // Update last values
    lastX = x;
    lastY = y;
    lastZ = z;
    
    // Check if shake threshold is exceeded
    const now = Date.now();
    if (deltaX + deltaY + deltaZ > threshold) {
      // Debounce: only trigger if enough time has passed since last shake
      if (now - lastShakeTime > timeout) {
        lastShakeTime = now;
        callback();
      }
    }
  };

  // Request permission for iOS 13+ devices
  if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    (DeviceMotionEvent as any).requestPermission()
      .then((permissionState: string) => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      })
      .catch(console.error);
  } else {
    // Non-iOS or older iOS
    window.addEventListener('devicemotion', handleMotion);
  }

  // Return cleanup function
  return () => {
    window.removeEventListener('devicemotion', handleMotion);
  };
};

/**
 * Check if shake detection is supported in current browser
 */
export const isShakeDetectionSupported = (): boolean => {
  return 'DeviceMotionEvent' in window;
};
