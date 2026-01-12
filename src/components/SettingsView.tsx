import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Upload, Trash2 } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SettingsViewProps {
  children: React.ReactNode;
}

const themes = [
  { id: 'light', label: 'Light', description: 'Warm and calm' },
  { id: 'dark', label: 'Dark', description: 'Night dhikr' },
  { id: 'theme-midnight', label: 'Midnight', description: 'Deep blue serenity' },
  { id: 'theme-neon', label: 'Neon', description: 'Vibrant pink & purple' },
  { id: 'theme-green', label: 'Matrix', description: 'Terminal green code' },
  { id: 'theme-cyberpunk', label: 'Cyberpunk', description: 'High-tech yellow & blue' },
] as const;

export function SettingsView({ children }: SettingsViewProps) {
  const [open, setOpen] = useState(false);

  const {
    showTransliteration,
    theme,
    themeSettings,
    counterShape,
    toggleTransliteration,
    toggleHaptic,
    toggleSound,
    setVibrationIntensity,
    setFontScale,
    setSoundType,
    setTheme,
    setCounterShape,
    exportData,
    importData,
    clearAllData,
  } = useTasbeehStore();

  const currentSettings = themeSettings?.[theme] || {
    hapticEnabled: true,
    soundEnabled: false,
    vibrationIntensity: 'medium',
    fontScale: 1,
    soundType: 'click'
  };

  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasbeeh-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          const success = importData(data);
          setImportStatus(success ? 'success' : 'error');
          setTimeout(() => setImportStatus('idle'), 3000);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="!bg-sheet-bg rounded-t-3xl h-[85vh] flex flex-col gap-0 outline-none border-t-0">
        <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0" />
        <SheetHeader className="text-left px-6 py-4 shrink-0">
          <SheetTitle className="text-lg font-medium">Settings</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto px-6 pb-8 space-y-6 flex-1">
          {/* Display settings */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Display</p>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-card">
              <div>
                <p className="text-sm font-medium text-foreground">Show transliteration</p>
                <p className="text-xs text-muted-foreground">Display Latin text below Arabic</p>
              </div>
              <Switch
                checked={showTransliteration}
                onCheckedChange={toggleTransliteration}
              />
            </div>
          </div>

          {/* Theme Customization */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Theme Customization</p>

            {/* Font Scale */}
            <div className="p-4 rounded-2xl bg-card mb-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">Font Size</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.8, 1, 1.2].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setFontScale(scale as 0.8 | 1 | 1.2)}
                    className={`
                        py-2 px-3 rounded-lg text-xs font-medium border transition-colors
                        ${currentSettings.fontScale === scale
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'}
                      `}
                  >
                    {scale === 0.8 ? 'Small' : scale === 1 ? 'Normal' : 'Large'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Counter Shape Config */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Counter Style</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'minimal', label: 'Minimal', icon: '○' },
                { id: 'classic', label: 'Classic', icon: '□' },
                { id: 'beads', label: 'Beads', icon: 'ooo' },
                { id: 'flower', label: 'Flower', icon: '❀' },
                { id: 'waveform', label: 'Wave', icon: '〰' },
                { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                { id: 'orb', label: 'Orb', icon: '●' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCounterShape(style.id as 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'hexagon' | 'orb');
                    setOpen(false);
                  }}
                  className={`
                    p-3 rounded-xl border text-center transition-all relative overflow-hidden
                    ${counterShape === style.id
                      ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary'
                      : 'bg-card border-transparent text-muted-foreground hover:bg-secondary'}
                  `}
                >
                  <p className="text-lg mb-1 opacity-70 scale-125">{style.icon}</p>
                  <p className="text-xs font-medium">{style.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Theme</p>
            <div className="space-y-2">
              {themes.map((t, index) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full p-4 rounded-2xl text-left
                    transition-colors duration-200
                    ${theme === t.id
                      ? 'bg-accent border border-primary/20'
                      : 'bg-card hover:bg-secondary'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    {theme === t.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>


          {/* Feedback settings */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Feedback</p>

            <div className="p-4 rounded-2xl bg-card mb-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Haptic feedback</p>
                  <p className="text-xs text-muted-foreground">Vibrate on each count</p>
                </div>
                <Switch
                  checked={currentSettings.hapticEnabled}
                  onCheckedChange={toggleHaptic}
                />
              </div>

              {currentSettings.hapticEnabled && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  {['light', 'medium', 'heavy'].map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => setVibrationIntensity(intensity as 'light' | 'medium' | 'heavy')}
                      className={`
                        py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors capitalize
                        ${currentSettings.vibrationIntensity === intensity
                          ? 'bg-primary/20 text-primary border-primary'
                          : 'bg-background border-border hover:bg-muted'}
                      `}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Sound effects</p>
                  <p className="text-xs text-muted-foreground">Play sound on tap</p>
                </div>
                <Switch
                  checked={currentSettings.soundEnabled}
                  onCheckedChange={toggleSound}
                />
              </div>

              {currentSettings.soundEnabled && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  {['click', 'soft', 'water'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSoundType(type as 'click' | 'soft' | 'water')}
                      className={`
                        py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors capitalize
                        ${currentSettings.soundType === type
                          ? 'bg-primary/20 text-primary border-primary'
                          : 'bg-background border-border hover:bg-muted'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Data management */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Data</p>

            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-secondary transition-colors text-left"
            >
              <Download className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Export backup</p>
                <p className="text-xs text-muted-foreground">Save your data to a file</p>
              </div>
            </button>

            <button
              onClick={handleImport}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-secondary transition-colors text-left"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Import backup</p>
                <p className="text-xs text-muted-foreground">
                  {importStatus === 'success'
                    ? 'Data imported successfully!'
                    : importStatus === 'error'
                      ? 'Import failed. Check file format.'
                      : 'Restore from a backup file'}
                </p>
              </div>
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-destructive/10 transition-colors text-left group">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Clear all data</p>
                    <p className="text-xs text-muted-foreground">This cannot be undone</p>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your counts, history, and custom dhikrs.
                    Consider exporting a backup first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllData}
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
