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
      'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk',
      'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical',
      'theme-steampunk', 'theme-crystal-depth', 'theme-mecca-night', 'theme-desert-starlight',
      'theme-istanbul-sunset', 'theme-ramadan-lantern', 'theme-rose-bloom',
      'theme-emerald-shine', 'theme-cyberpunk-zen', 'theme-ocean-depth'
    ];
    
    const isDark = darkThemes.includes(theme);
    if (isDark) {
      root.classList.add('dark');
    }

    // Dynamic meta theme-color and native status bar update
    const updateThemeMeta = () => {
      // Wait for DOM styles to update from the new class
      const bgColor = getComputedStyle(root).getPropertyValue('--background');
      if (bgColor) {
        // Convert HSL values (e.g., "30 20% 4%") to a css color
        const cleanHSL = `hsl(${bgColor.trim()})`;
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'theme-color');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', cleanHSL);
      }

      // Sync status bar
      import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
        StatusBar.setStyle({
          style: isDark ? Style.Dark : Style.Light
        }).catch(() => {});
        
        // Also update background color if supported
        const bgColorVal = getComputedStyle(document.body).backgroundColor;
        if (bgColorVal) {
          StatusBar.setBackgroundColor({ color: bgColorVal }).catch(() => {});
        }
      }).catch(() => {});
    };

    const timer = setTimeout(updateThemeMeta, 100);
    return () => clearTimeout(timer);
  }, [theme]);

  return <>{children}</>;
}
