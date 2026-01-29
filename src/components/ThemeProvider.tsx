import { useEffect } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTasbeehStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled');

    if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
