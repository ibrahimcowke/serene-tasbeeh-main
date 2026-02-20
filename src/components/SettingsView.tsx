import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Download, Upload, Trash2, RotateCcw, Layout, Smartphone, Maximize, Cloud, LogIn, LogOut, RefreshCw, Shield, Shapes, Wind, Palette, Waves, Crown, Sunset, Zap, CloudMoon, Infinity, Fan, Diamond, Component, ExternalLink, ChevronRight } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { supabase, signInWithGoogle, signOut, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { StatisticsView } from './StatisticsView';

interface SettingsViewProps {
  children: React.ReactNode;
}

import { themes, counterShapes, APP_VERSION } from '@/lib/constants';



export function SettingsView({ children }: SettingsViewProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
    dhikrTextPosition,
    setDhikrTextPosition,
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
    zenMode,
    setZenMode,
    breathingGuideEnabled,
    setBreathingGuide,
    breathingGuideSpeed,
    setBreathingGuideSpeed,
    autoThemeSwitch,
    setAutoThemeSwitch,
    shakeToReset,
    setShakeToReset,
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appearance" className="flex-1">Settings</TabsTrigger>
                <TabsTrigger value="data" className="flex-1">Data</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-1 py-1 custom-scrollbar">
              <TabsContent value="appearance" className="space-y-6 mt-0 pb-6 px-1">
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

                {/* Counter Design Config */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Counter Design</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {counterShapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          setCounterShape(shape.id as any);
                          setOpen(false);
                        }}
                        className={`
                          p-3 rounded-xl border text-center transition-all relative overflow-hidden flex flex-col items-center gap-2
                          ${counterShape === shape.id
                            ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary'
                            : 'bg-card border-transparent text-muted-foreground hover:bg-secondary'}
                        `}
                      >
                        <span className="text-xl opacity-70">{shape.icon}</span>
                        <p className="text-[10px] font-medium truncate w-full">{shape.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zen Mode Toggle */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Focus</p>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Zen Mode</label>
                      <p className="text-xs text-muted-foreground">Hide minimal UI for complete focus</p>
                    </div>
                    <Switch
                      checked={zenMode}
                      onCheckedChange={(checked) => {
                        setZenMode(checked);
                        if (checked) setOpen(false); // Close settings to show effect immediately
                      }}
                    />
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

                  {/* Advanced Layout Accordion */}
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
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Mindfulness Section */}
                      <AccordionItem value="mindfulness" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-4 px-1 rounded-xl transition-all hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <Wind className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">Mindfulness</p>
                              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Breathing guide & focus aids</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6 px-1">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                              <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Breathing Guide</Label>
                                <p className="text-xs text-zinc-500">Subtle background pulse for rhythm</p>
                              </div>
                              <Switch
                                checked={breathingGuideEnabled}
                                onCheckedChange={setBreathingGuide}
                              />
                            </div>

                            <div className="space-y-4 px-1">
                              <div className="flex justify-between items-center text-sm">
                                <Label className="font-medium text-zinc-700 dark:text-zinc-300">Breath Speed</Label>
                                <span className="text-zinc-500 font-mono text-xs">{breathingGuideSpeed}s</span>
                              </div>
                              <Slider
                                min={2}
                                max={8}
                                step={0.5}
                                value={[breathingGuideSpeed]}
                                onValueChange={([val]) => setBreathingGuideSpeed(val)}
                                className="py-2"
                              />
                              <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-widest font-semibold px-1">
                                <span>Fast</span>
                                <span>Deep</span>
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

                {/* Dhikr Text Settings */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Dhikr Text</p>
                  <div className="p-4 rounded-2xl bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">Position</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { id: 'top', label: '↑ Top' },
                        { id: 'above-counter', label: '⇡ Above Counter' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setDhikrTextPosition(pos.id as any)}
                          className={`
                              py-2 px-2 rounded-lg text-xs font-medium border transition-colors
                              ${dhikrTextPosition === pos.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { id: 'below-counter', label: '⇣ Below Counter' },
                        { id: 'bottom', label: '↓ Bottom' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setDhikrTextPosition(pos.id as any)}
                          className={`
                              py-2 px-2 rounded-lg text-xs font-medium border transition-colors
                              ${dhikrTextPosition === pos.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setDhikrTextPosition('hidden')}
                      className={`
                          w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium border transition-colors
                          ${dhikrTextPosition === 'hidden'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'}
                        `}
                    >
                      ✕ Hidden
                    </button>
                  </div>
                </div>

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

                {/* Display settings (Transliteration) */}
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

                {/* Smart Features */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Smart Features</p>

                  <div className="p-4 rounded-2xl bg-card space-y-4">
                    {/* Shake to Reset */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Shake to Reset</p>
                        <p className="text-xs text-muted-foreground">Shake device to reset counter</p>
                      </div>
                      <Switch
                        checked={shakeToReset}
                        onCheckedChange={setShakeToReset}
                      />
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Auto Theme Switch */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Auto Theme</p>
                        <p className="text-xs text-muted-foreground">Switch light/dark based on time</p>
                      </div>
                      <Switch
                        checked={autoThemeSwitch}
                        onCheckedChange={setAutoThemeSwitch}
                      />
                    </div>

                    <div className="h-px bg-border/50" />


                  </div>
                </div>

                {/* About & Legal */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">About</p>

                  <div className="p-4 rounded-2xl bg-card space-y-4">
                    {/* About Developer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Developed by Ibrahim Cowke</p>
                          <a
                            href="https://ibrahimcowke.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Visit Portfolio
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Privacy Policy Trigger */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-full flex items-center justify-between text-left group">
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Privacy Policy</p>
                            <p className="text-xs text-muted-foreground">Read our terms and data policy</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Privacy Policy</DialogTitle>
                          <DialogDescription>
                            Last updated: February 2026
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm text-foreground/80 mt-4">
                          <section className="space-y-2">
                            <h4 className="font-semibold text-foreground">1. Introduction</h4>
                            <p>Serene Tasbeeh ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is handled when you use our application.</p>
                          </section>

                          <section className="space-y-2">
                            <h4 className="font-semibold text-foreground">2. Data Collection & Storage</h4>
                            <p><strong>Local Storage:</strong> This application primarily stores data locally on your device. This includes your settings, counter progress, and preferences. We do not automatically collect personal data.</p>
                            <p><strong>Cloud Sync (Optional):</strong> If you choose to use the Cloud Sync feature, we store your tasbeeh data securely using Supabase authentication. This requires signing in with a Google account. We only store the data necessary to sync your progress across devices.</p>
                          </section>

                          <section className="space-y-2">
                            <h4 className="font-semibold text-foreground">3. Third-Party Services</h4>
                            <p>We use Supabase for authentication and database services. When you sign in with Google, you are subject to Google's Privacy Policy.</p>
                          </section>

                          <section className="space-y-2">
                            <h4 className="font-semibold text-foreground">4. Contact</h4>
                            <p>If you have any questions about this privacy policy, please contact us via the developer portfolio at: <a href="https://ibrahimcowke.netlify.app/" className="text-primary hover:underline">ibrahimcowke.netlify.app</a></p>
                          </section>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="h-px bg-border/50" />

                    {/* Version Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Version</p>
                        <p className="text-xs text-muted-foreground">v{APP_VERSION} (Latest)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-6 mt-0 pb-6 px-1">
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
                        {!isSupabaseConfigured && (
                          <p className="text-[10px] text-destructive mt-3">Cloud Sync unavailable: Missing Supabase keys in .env</p>
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
                    <div>
                      <p className="text-sm font-medium text-foreground">Import backup</p>
                      <p className="text-xs text-muted-foreground">Restore from a backup file</p>
                    </div>
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-left border border-red-500/20 mt-4"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-red-500">Reset Data</p>
                          <p className="text-xs text-red-500/70">Clear all progress and settings</p>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          current session data and reset all settings to default.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearAllData}
                          className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                          Reset Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset only settings to default? Progress will be kept.')) {
                        resetSettings();
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Settings Only
                  </button>
                </div>
              </TabsContent>
            </div>
          </Tabs >
        </div >
      </SheetContent >
    </Sheet >
  );
}
