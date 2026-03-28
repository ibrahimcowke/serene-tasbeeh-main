import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Download, Upload, Trash2, RotateCcw, Smartphone, Maximize, Wind, Zap, ExternalLink, ChevronRight, Share2, Bell } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
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
import { toast } from 'sonner';
import { themes, counterShapes, APP_VERSION } from '@/lib/constants';
import { RemindersView } from './RemindersView';

interface SettingsViewProps {
  children: React.ReactNode;
  defaultTab?: string;
}

export function SettingsView({ children, defaultTab = 'themes' }: SettingsViewProps) {
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
    wakeLockEnabled,
    setWakeLockEnabled,
    volumeButtonCounting,
    setVolumeButtonCounting,
    setCounterShape,
  } = useTasbeehStore();

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

  const currentSettings = themeSettings?.[theme] || {
    hapticEnabled: true,
    soundEnabled: false,
    vibrationIntensity: 50,
    fontScale: 1,
    soundType: 'click'
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
          <SheetDescription className="sr-only">Configure app visuals, counter, and preferences</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue={defaultTab === 'appearance' ? 'themes' : defaultTab} className="flex-1 flex flex-col h-full">
            <div className="px-6 pt-2 pb-4 shrink-0 bg-background/50 backdrop-blur-sm z-10">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="themes" className="text-xs">Themes</TabsTrigger>
                <TabsTrigger value="counter" className="text-xs">Counter</TabsTrigger>
                <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
                <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-1 py-1 custom-scrollbar">
              {/* THEMES TAB */}
              <TabsContent value="themes" className="space-y-6 mt-0 pb-6 px-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Visual Theme</p>
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    {themes.map((t, index) => (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => setTheme(t.id)}
                        className={`
                          p-3 rounded-2xl text-left border transition-all
                          ${theme === t.id
                            ? 'bg-primary/10 border-primary shadow-sm'
                            : 'bg-card border-border hover:bg-secondary'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="overflow-hidden">
                            <p className={`text-[13px] font-medium truncate ${theme === t.id ? 'text-primary' : 'text-foreground'}`}>
                              {t.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">{t.description}</p>
                          </div>
                          {theme === t.id && (
                            <Check className="w-3 h-3 text-primary shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card space-y-4">
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
                </div>

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

              {/* COUNTER TAB */}
              <TabsContent value="counter" className="space-y-6 mt-0 pb-6 px-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Counter Shape</p>
                  <div className="grid grid-cols-3 gap-2 pb-2">
                    {counterShapes.map((shape, index) => (
                      <motion.button
                        key={shape.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => setCounterShape(shape.id)}
                        className={`
                          flex flex-col items-center justify-center p-3 rounded-2xl border transition-all
                          ${counterShape === shape.id
                            ? 'bg-primary/10 border-primary shadow-sm'
                            : 'bg-card border-border hover:bg-secondary'
                          }
                        `}
                      >
                        <span className={`text-xl mb-1 ${counterShape === shape.id ? 'text-primary' : 'text-muted-foreground'}`}>
                          {shape.icon}
                        </span>
                        <span className={`text-[10px] font-medium text-center truncate w-full ${counterShape === shape.id ? 'text-primary' : 'text-muted-foreground'}`}>
                          {shape.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Zen Mode focus</label>
                      <p className="text-xs text-muted-foreground">Hide sidebars for complete focus</p>
                    </div>
                    <Switch
                      checked={zenMode}
                      onCheckedChange={(checked) => {
                        setZenMode(checked);
                        if (checked) setOpen(false);
                      }}
                    />
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-1 mt-2 border border-border/50">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-layout" className="border-none">
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline hover:bg-secondary/50 rounded-xl transition-colors">
                        Positioning & Scale
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-6 pt-4">
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
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="mindfulness" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-4 px-4 rounded-xl transition-all hover:bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Wind className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-foreground text-[15px]">Mindfulness</p>
                            <p className="text-[13px] text-muted-foreground">Breathing guide settings</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-6 px-4">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-medium">Breathing Guide</Label>
                              <p className="text-xs text-zinc-500">Subtle pulse for focus</p>
                            </div>
                            <Switch
                              checked={breathingGuideEnabled}
                              onCheckedChange={setBreathingGuide}
                            />
                          </div>
                          <div className="space-y-4 px-1">
                            <div className="flex justify-between items-center text-sm">
                              <Label className="font-medium">Breath Speed</Label>
                              <span className="text-muted-foreground font-mono text-xs">{breathingGuideSpeed}s</span>
                            </div>
                            <Slider min={2} max={8} step={0.5} value={[breathingGuideSpeed]} onValueChange={([val]) => setBreathingGuideSpeed(val)} />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border/50">
                  <p className="text-sm font-medium mb-3">Dhikr Text Position</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'top', label: 'Top' },
                      { id: 'above-counter', label: 'Above Counter' },
                      { id: 'below-counter', label: 'Below Counter' },
                      { id: 'bottom', label: 'Bottom' },
                      { id: 'none', label: 'Hidden' }
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setDhikrTextPosition(pos.id as any)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${dhikrTextPosition === pos.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* SYSTEM TAB */}
              <TabsContent value="system" className="space-y-6 mt-0 pb-6 px-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Notifications</p>
                  <RemindersView>
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-primary">Reminders & Alerts</p>
                          <p className="text-xs text-primary/70">Schedule your dhikr sessions</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                    </button>
                  </RemindersView>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Interaction</p>
                  <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Haptic feedback</p>
                        <p className="text-xs text-muted-foreground">Vibrate on tap</p>
                      </div>
                      <Switch checked={currentSettings.hapticEnabled} onCheckedChange={toggleHaptic} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Sound effects</p>
                        <p className="text-xs text-muted-foreground">Play sound on tap</p>
                      </div>
                      <Switch checked={currentSettings.soundEnabled} onCheckedChange={toggleSound} />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Shake to Reset</p>
                      <p className="text-xs text-muted-foreground">Shake device to reset</p>
                    </div>
                    <Switch checked={shakeToReset} onCheckedChange={setShakeToReset} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Stay Awake</p>
                      <p className="text-xs text-muted-foreground">Keep screen on during sessions</p>
                    </div>
                    <Switch checked={wakeLockEnabled} onCheckedChange={setWakeLockEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Volume Buttons</p>
                      <p className="text-xs text-muted-foreground">Use physical keys to count</p>
                    </div>
                    <Switch checked={volumeButtonCounting} onCheckedChange={setVolumeButtonCounting} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Developed by Ibrahim Cowke</p>
                        <a href="https://ibrahimcowke.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          Visit Portfolio <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DATA TAB */}
              <TabsContent value="data" className="space-y-6 mt-0 pb-6 px-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Data Management</p>
                  <button onClick={handleExport} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:bg-secondary transition-colors text-left mb-2">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Export backup</p>
                      <p className="text-xs text-muted-foreground">Save data to a JSON file</p>
                    </div>
                  </button>
                  <button onClick={handleImport} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:bg-secondary transition-colors text-left">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Import backup</p>
                      <p className="text-xs text-muted-foreground">Restore from a JSON file</p>
                    </div>
                  </button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-left border border-red-500/20 mt-4">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-red-500">Reset All Data</p>
                        <p className="text-xs text-red-500/70">Permanently delete all progress</p>
                      </div>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>This will wipe all counts, streaks, and custom settings.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAllData} className="bg-red-500 hover:bg-red-600">Reset Everything</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
