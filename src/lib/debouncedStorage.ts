/**
 * A custom storage adapter that wraps standard localStorage but debounces write operations.
 * This is crucial for performance in mobile environments where writing to disk on every
 * count tap (e.g. 5 times per second) causes major rendering lags and blocking of the main thread.
 * 
 * Pending writes are flushed automatically when:
 * - Tapping pauses for 1 second.
 * - The page is hidden or backgrounded (app minimization).
 * - The window is closed or unloaded.
 */

const createDebouncedLocalStorage = (delayMs = 1000) => {
  const pendingWrites = new Map<string, string>();
  const timeouts = new Map<string, any>();

  const flush = (name: string) => {
    if (pendingWrites.has(name)) {
      const val = pendingWrites.get(name)!;
      localStorage.setItem(name, val);
      pendingWrites.delete(name);

      // Trigger cloud sync asynchronously for the main state store
      if (name === 'tasbeeh-storage') {
        try {
          const parsed = JSON.parse(val);
          if (parsed && parsed.state) {
            let deviceUuid = parsed.state.deviceUuid;
            if (!deviceUuid) {
              deviceUuid = 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              parsed.state.deviceUuid = deviceUuid;
              localStorage.setItem(name, JSON.stringify(parsed));
            }
            import('./supabaseSync').then(({ syncStateToCloud }) => {
              syncStateToCloud(deviceUuid, parsed.state);
            });
          }
        } catch (e) {
          // Fail silently in background
        }
      }
    }
    if (timeouts.has(name)) {
      clearTimeout(timeouts.get(name));
      timeouts.delete(name);
    }
  };

  const flushAll = () => {
    for (const name of pendingWrites.keys()) {
      flush(name);
    }
  };

  // Bind to system events to ensure data is never lost when closing the app
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushAll);
    window.addEventListener('pagehide', flushAll);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushAll();
      }
    });
  }

  return {
    getItem: (name: string): string | null => {
      if (pendingWrites.has(name)) {
        return pendingWrites.get(name)!;
      }
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      pendingWrites.set(name, value);
      if (timeouts.has(name)) {
        clearTimeout(timeouts.get(name));
      }
      timeouts.set(name, setTimeout(() => {
        flush(name);
      }, delayMs));
    },
    removeItem: (name: string): void => {
      pendingWrites.delete(name);
      if (timeouts.has(name)) {
        clearTimeout(timeouts.get(name));
        timeouts.delete(name);
      }
      localStorage.removeItem(name);
    }
  };
};

export const debouncedStorage = createDebouncedLocalStorage(1000);
