import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Upload, Trash2, RotateCcw, Layout, Smartphone, Maximize, Cloud, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { supabase, signInWithGoogle, signOut, getCurrentUser } from '@/lib/supabase';
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
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  { id: 'theme-glass', label: 'Glass', description: 'Pure & icy morphism' },
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
    layout,
    setLayout,
    hadithSlideDuration,
    hadithSlidePosition,
    setHadithSlideDuration,
    setHadithSlidePosition,
    exportData,
    importData,
    clearAllData,
    resetSettings,
    syncToCloud,
    syncFromCloud,
    verticalOffset,
    setVerticalOffset,
    dhikrVerticalOffset,
    setDhikrVerticalOffset,
    counterVerticalOffset,
    setCounterVerticalOffset,
    counterScale,
    setCounterScale,
    countFontSize,
    setCountFontSize,
  } = useTasbeehStore();

  const [user, setUser] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    getCurrentUser().then(setUser);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSyncToCloud = async () => {
    setSyncing(true);
    const success = await syncToCloud();
    setSyncing(false);
    setSyncStatus(success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleSyncFromCloud = async () => {
    setSyncing(true);
    const success = await syncFromCloud();
    setSyncing(false);
    setSyncStatus(success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

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
      <SheetContent side="bottom" className="bg-background/80 backdrop-blur-md rounded-t-3xl h-[85vh] flex flex-col gap-0 outline-none border-t-0 z-50">
        <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0" />
        <SheetHeader className="text-left px-6 py-4 shrink-0">
          <SheetTitle className="text-lg font-medium">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="appearance" className="flex-1 flex flex-col h-full">
            <div className="px-6 pt-2 pb-4 shrink-0 bg-background/50 backdrop-blur-sm z-10">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appearance">Style</TabsTrigger>
                <TabsTrigger value="general">Logic</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <TabsContent value="appearance" className="space-y-6 mt-0">
                {/* Theme Customization */}
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

                {/* Layout Config */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Layout</p>
                    <button
                      onClick={() => {
                        setVerticalOffset(0);
                        setDhikrVerticalOffset(0);
                        setCounterVerticalOffset(0);
                        setCounterScale(1);
                        setCountFontSize(1);
                      }}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Reset Defaults
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'default', label: 'Classic', icon: Layout },
                      { id: 'focus', label: 'Focus', icon: Maximize },
                      { id: 'ergonomic', label: 'Bottom', icon: Smartphone },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setLayout(l.id as 'default' | 'focus' | 'ergonomic');
                          setOpen(false);
                        }}
                        className={`
                          p-3 rounded-xl border text-center transition-all relative overflow-hidden flex flex-col items-center gap-2
                          ${layout === l.id
                            ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary'
                            : 'bg-card border-transparent text-muted-foreground hover:bg-secondary'}
                        `}
                      >
                        <l.icon className="w-6 h-6 opacity-70" />
                        <p className="text-xs font-medium">{l.label}</p>
                      </button>
                    ))}
                  </div>

                  {/* Advanced Layout Accordion - Moved closer to Layout Type */}
                  <div className="bg-card rounded-2xl p-1 mt-2">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="advanced-layout" className="border-none">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline hover:bg-secondary/50 rounded-xl transition-colors">
                          Advanced Positioning & Scale
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-6 pt-4">
                            {/* Global Vertical Position */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Global Position</p>
                                <p className="text-xs text-muted-foreground">{verticalOffset > 0 ? `+${verticalOffset}px` : `${verticalOffset}px`}</p>
                              </div>
                              <Slider
                                min={-150}
                                max={150}
                                step={10}
                                value={[verticalOffset]}
                                onValueChange={([val]) => setVerticalOffset(val)}
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                                <span>Up</span>
                                <span>Center</span>
                                <span>Down</span>
                              </div>
                            </div>

                            {/* Dhikr Text Position */}
                            <div className="pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Dhikr Text</p>
                                <p className="text-xs text-muted-foreground">{dhikrVerticalOffset > 0 ? `+${dhikrVerticalOffset}px` : `${dhikrVerticalOffset}px`}</p>
                              </div>
                              <Slider
                                min={-100}
                                max={100}
                                step={5}
                                value={[dhikrVerticalOffset]}
                                onValueChange={([val]) => setDhikrVerticalOffset(val)}
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                                <span>Up</span>
                                <span>Auto</span>
                                <span>Down</span>
                              </div>
                            </div>

                            {/* Counter Position */}
                            <div className="pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Counter Position</p>
                                <p className="text-xs text-muted-foreground">{counterVerticalOffset > 0 ? `+${counterVerticalOffset}px` : `${counterVerticalOffset}px`}</p>
                              </div>
                              <Slider
                                min={-100}
                                max={100}
                                step={5}
                                value={[counterVerticalOffset]}
                                onValueChange={([val]) => setCounterVerticalOffset(val)}
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                                <span>Up</span>
                                <span>Auto</span>
                                <span>Down</span>
                              </div>
                            </div>

                            {/* Counter Size */}
                            <div className="pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Counter Size</p>
                                <p className="text-xs text-muted-foreground">{Math.round(counterScale * 100)}%</p>
                              </div>
                              <Slider
                                min={0.5}
                                max={1.7}
                                step={0.05}
                                value={[counterScale]}
                                onValueChange={([val]) => setCounterScale(val)}
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                                <span>50%</span>
                                <span>100%</span>
                                <span>170%</span>
                              </div>
                            </div>

                            {/* Number Size */}
                            <div className="pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Number Size</p>
                                <p className="text-xs text-muted-foreground">{Math.round(countFontSize * 100)}%</p>
                              </div>
                              <Slider
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                value={[countFontSize]}
                                onValueChange={([val]) => setCountFontSize(val)}
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                                <span>Small</span>
                                <span>Normal</span>
                                <span>Big</span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Font Scale */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Typography</p>
                  <div className="p-4 rounded-2xl bg-card mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">App Font Size</p>
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
              </TabsContent>

              <TabsContent value="general" className="space-y-6 mt-0">
                {/* Hadith Slider Settings */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Hadith Slider</p>
                  <div className="p-4 rounded-2xl bg-card mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Slide Duration</p>
                        <p className="text-xs text-muted-foreground">{hadithSlideDuration} seconds per slide</p>
                      </div>
                    </div>
                    <Slider
                      min={5}
                      max={60}
                      step={5}
                      value={[hadithSlideDuration]}
                      onValueChange={([val]) => setHadithSlideDuration(val)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5s</span>
                      <span>60s</span>
                    </div>
                  </div>
                  {/* Slide Position */}
                  <div className="p-4 rounded-2xl bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">Position</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[
                        { id: 'top-left', label: '↖ Top Left' },
                        { id: 'top-right', label: '↗ Top Right' },
                        { id: 'right', label: '→ Right' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setHadithSlidePosition(pos.id as any)}
                          className={`
                              py-2 px-2 rounded-lg text-xs font-medium border transition-colors
                              ${hadithSlidePosition === pos.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'bottom-left', label: '↙ Bottom Left' },
                        { id: 'bottom-right', label: '↘ Bottom Right' },
                        { id: 'bottom', label: '↓ Bottom' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setHadithSlidePosition(pos.id as any)}
                          className={`
                              py-2 px-2 rounded-lg text-xs font-medium border transition-colors
                              ${hadithSlidePosition === pos.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setHadithSlidePosition('hidden')}
                      className={`
                          w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors
                          ${hadithSlidePosition === 'hidden'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'}
                        `}
                    >
                      ✕ Hidden
                    </button>
                  </div>
                </div>

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
              </TabsContent>

              <TabsContent value="data" className="space-y-6 mt-0">
                {/* Cloud Sync Section */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Cloud Sync (Beta)</p>
                  <div className="bg-card rounded-2xl p-4 overflow-hidden relative">
                    {!user ? (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <Cloud className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
                        <h3 className="text-sm font-medium text-foreground mb-1">Backup & Sync</h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">Sign in to save your progress to the cloud and sync across devices.</p>
                        <button
                          onClick={handleLogin}
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign in with Google
                        </button>
                        {!import.meta.env.VITE_SUPABASE_URL && (
                          <p className="text-[10px] text-destructive mt-3">Missing Supabase Params in .env</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{user.email?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Logged in</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                            </div>
                          </div>
                          <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg">
                            <LogOut className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleSyncToCloud}
                            disabled={syncing}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border-2 border-transparent hover:border-primary/10"
                          >
                            <Upload className={`w-5 h-5 text-primary ${syncing ? 'animate-bounce' : ''}`} />
                            <span className="text-xs font-medium">Save to Cloud</span>
                          </button>
                          <button
                            onClick={handleSyncFromCloud}
                            disabled={syncing}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border-2 border-transparent hover:border-primary/10"
                          >
                            <Download className={`w-5 h-5 text-primary ${syncing ? 'animate-bounce' : ''}`} />
                            <span className="text-xs font-medium">Load from Cloud</span>
                          </button>
                        </div>

                        {syncStatus !== 'idle' && (
                          <div className={`text-center text-xs p-2 rounded-lg ${syncStatus === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {syncStatus === 'success' ? 'Sync successful!' : 'Sync failed. Check connection.'}
                          </div>
                        )}
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
                      <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-secondary transition-colors text-left group">
                        <RotateCcw className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Reset Settings</p>
                          <p className="text-xs text-muted-foreground">Restore default appearance & preferences</p>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset settings?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset your theme, counter shape, and preferences to default.
                          Your count history and custom dhikrs will NOT be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={resetSettings}
                          className="rounded-xl bg-primary text-primary-foreground"
                        >
                          Reset Settings
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
