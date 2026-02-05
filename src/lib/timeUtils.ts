/**
 * Time-based utilities for auto theme switching and session timing
 */

/**
 * Check if current time is during daytime hours (6 AM - 6 PM)
 */
export const isDaytime = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 6 && hour < 18;
};

/**
 * Get recommended theme based on current time
 * Returns 'light' for daytime, 'theme-midnight' for nighttime
 */
export const getRecommendedTheme = (): 'light' | 'theme-midnight' => {
  return isDaytime() ? 'light' : 'theme-midnight';
};

/**
 * Format session time in seconds to MM:SS or HH:MM:SS
 */
export const formatSessionTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get a deterministic index based on current date
 * Useful for "item of the day" features
 */
export const getDailyIndex = (arrayLength: number): number => {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % arrayLength;
};
