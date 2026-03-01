import { useEffect } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTasbeehStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme-related classes dynamically
    const themeClasses = Array.from(root.classList).filter(
      cls => cls.startsWith('theme-') || cls === 'light' || cls === 'dark'
    );
    themeClasses.forEach(cls => root.classList.remove(cls));

    // Add current theme
    if (theme) {
      root.classList.add(theme);
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return <>{children}</>;
}
