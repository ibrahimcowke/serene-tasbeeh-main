import { useEffect } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTasbeehStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical', 'theme-steampunk', 'theme-crystal-depth',
      'theme-mecca-night', 'theme-medina-rose', 'theme-blue-mosque', 'theme-desert-starlight', 'theme-sahara-warmth', 'theme-andalusia-earth', 'theme-istanbul-sunset', 'theme-taj-marble', 'theme-royal-persian', 'theme-ramadan-lantern'
    );

    if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
