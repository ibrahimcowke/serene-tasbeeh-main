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
    if (theme && theme !== 'light') {
      root.classList.add(theme);
    } else {
      // Default or explicitly 'light'
      root.classList.add('light');
    }

    // Automatically apply Tailwind `.dark` for dark themes so Shadcn UI picks it up properly
    const darkThemes = [
      'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass',
      'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical',
      'theme-steampunk', 'theme-crystal-depth', 'theme-mecca-night', 'theme-desert-starlight',
      'theme-istanbul-sunset', 'theme-ramadan-lantern'
    ];
    if (darkThemes.includes(theme)) {
      root.classList.add('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
