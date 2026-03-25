import { motion } from 'framer-motion';
import { Palette, ChevronRight } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { themes } from '@/lib/constants';
import { SettingsView } from './SettingsView';
import { toast } from 'sonner';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTasbeehStore();

  const handleNextTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = themes.findIndex(t => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme.id);
    toast.success(`Theme: ${nextTheme.label}`, {
      duration: 1500,
      id: 'theme-switch',
      position: 'top-center',
    });
  };

  return (
    <div className="flex items-center gap-2">
      <SettingsView defaultTab="appearance">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 w-10 flex items-center justify-center bg-card/40 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/5 transition-all duration-300 rounded-xl text-foreground/80"
          title="Theme Settings"
        >
          <Palette className="w-5 h-5" />
        </motion.button>
      </SettingsView>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextTheme}
        className="h-10 px-3 flex items-center gap-2 bg-card/40 backdrop-blur-xl border border-white/10 shadow-lg hover:bg-white/5 transition-all duration-300 rounded-xl text-foreground/80 group"
        title="Next Theme"
      >
        <span className="text-xs font-medium hidden sm:block">Next Theme</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </div>
  );
};
