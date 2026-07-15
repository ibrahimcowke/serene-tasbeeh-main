import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Download, Upload, Trash2, Zap, ExternalLink, ChevronRight, Bell, Wind, Shield, Cloud, Globe, Volume2, Mic } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from '@/lib/i18n';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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
import { Label } from '@/components/ui/label';
import { themes, counterShapes } from '@/lib/constants';
import { RemindersView } from './RemindersView';
import { LoginView } from './LoginView';
import { GoogleLogin } from './GoogleLogin';

const SHAPE_CATEGORIES = [
  { title: 'Essential', list: ['plain', 'minimal', 'classic', 'beads', 'waveform'] },
  { title: 'Luminous', list: ['ring-light', 'halo-ring', 'luminous-beads', 'star-burst', 'crystal-orbit', 'aurora-glow'] },
  { title: 'Modern', list: ['flower', 'modern-ring', 'moon-phase', 'neumorph', 'sunset-horizon'] },
  { title: 'Objects & 3D', list: ['digital', 'bead-ring', 'digital-watch', 'tally-clicker', 'diamond-prism'] },
  { title: 'Tech & Abstract', list: ['vertical-capsules', 'emerald-loop', 'smart-ring', 'crystal-prism', 'golden-spiral'] }
];

interface SettingsViewContentProps {
  defaultTab: string;
  setOpen: (open: boolean) => void;
}

export function SettingsViewContent({ defaultTab, setOpen }: SettingsViewContentProps) {
  const navigate = useNavigate();

  const {
    theme,
    themeSettings,
    counterShape,
    toggleHaptic,
    toggleSound,
    setFontScale,
    setTheme,
    hadithSlideDuration,
    setHadithSlideDuration,
    dhikrTextPosition,
    setDhikrTextPosition,
    exportData,
    importData,
    clearAllData,
    verticalOffset,
    setVerticalOffset,
    dhikrVerticalOffset,
    setDhikrVerticalOffset,
    counterVerticalOffset,
    setCounterVerticalOffset,
    counterScale,
    setCounterScale,
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
    screenOffMode,
    setScreenOffMode,
    setCounterShape,
    language,
    setLanguage,
    ambientSoundType,
    ambientSoundVolume,
    setAmbientSound,
    setAmbientSoundVolume,
    voiceAnnouncementsEnabled,
    setVoiceAnnouncements,
    hapticPattern,
    setHapticPattern,
    countFontSize,
    setCountFontSize,
    dhikrFontSize,
    setDhikrFontSize,
  } = useTasbeehStore(useShallow(state => ({
    theme: state.theme,
    themeSettings: state.themeSettings,
    counterShape: state.counterShape,
    toggleHaptic: state.toggleHaptic,
    toggleSound: state.toggleSound,
    setFontScale: state.setFontScale,
    setTheme: state.setTheme,
    hadithSlideDuration: state.hadithSlideDuration,
    setHadithSlideDuration: state.setHadithSlideDuration,
    dhikrTextPosition: state.dhikrTextPosition,
    setDhikrTextPosition: state.setDhikrTextPosition,
    exportData: state.exportData,
    importData: state.importData,
    clearAllData: state.clearAllData,
    verticalOffset: state.verticalOffset,
    setVerticalOffset: state.setVerticalOffset,
    dhikrVerticalOffset: state.dhikrVerticalOffset,
    setDhikrVerticalOffset: state.setDhikrVerticalOffset,
    counterVerticalOffset: state.counterVerticalOffset,
    setCounterVerticalOffset: state.setCounterVerticalOffset,
    counterScale: state.counterScale,
    setCounterScale: state.setCounterScale,
    countFontSize: state.countFontSize,
    setCountFontSize: state.setCountFontSize,
    dhikrFontSize: state.dhikrFontSize,
    setDhikrFontSize: state.setDhikrFontSize,
    zenMode: state.zenMode,
    setZenMode: state.setZenMode,
    breathingGuideEnabled: state.breathingGuideEnabled,
    setBreathingGuide: state.setBreathingGuide,
    breathingGuideSpeed: state.breathingGuideSpeed,
    setBreathingGuideSpeed: state.setBreathingGuideSpeed,
    autoThemeSwitch: state.autoThemeSwitch,
    setAutoThemeSwitch: state.setAutoThemeSwitch,
    shakeToReset: state.shakeToReset,
    setShakeToReset: state.setShakeToReset,
    wakeLockEnabled: state.wakeLockEnabled,
    setWakeLockEnabled: state.setWakeLockEnabled,
    volumeButtonCounting: state.volumeButtonCounting,
    setVolumeButtonCounting: state.setVolumeButtonCounting,
    screenOffMode: state.screenOffMode,
    setScreenOffMode: state.setScreenOffMode,
    setCounterShape: state.setCounterShape,
    language: state.language,
    setLanguage: state.setLanguage,
    ambientSoundType: state.ambientSoundType,
    ambientSoundVolume: state.ambientSoundVolume,
    setAmbientSound: state.setAmbientSound,
    setAmbientSoundVolume: state.setAmbientSoundVolume,
    voiceAnnouncementsEnabled: state.voiceAnnouncementsEnabled,
    setVoiceAnnouncements: state.setVoiceAnnouncements,
    hapticPattern: state.hapticPattern,
    setHapticPattern: state.setHapticPattern,
  })));
  const { t } = useTranslation();

  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Local states for sliders to make dragging smooth
  const [localVerticalOffset, setLocalVerticalOffset] = useState(verticalOffset);
  const [localDhikrVerticalOffset, setLocalDhikrVerticalOffset] = useState(dhikrVerticalOffset);
  const [localCounterVerticalOffset, setLocalCounterVerticalOffset] = useState(counterVerticalOffset);
  const [localCounterScale, setLocalCounterScale] = useState(counterScale);
  const [localBreathingSpeed, setLocalBreathingSpeed] = useState(breathingGuideSpeed);
  const [localHadithSlideDuration, setLocalHadithSlideDuration] = useState(hadithSlideDuration);

  // Synchronize local states when store state changes externally
  useEffect(() => { setLocalVerticalOffset(verticalOffset); }, [verticalOffset]);
  useEffect(() => { setLocalDhikrVerticalOffset(dhikrVerticalOffset); }, [dhikrVerticalOffset]);
  useEffect(() => { setLocalCounterVerticalOffset(counterVerticalOffset); }, [counterVerticalOffset]);
  useEffect(() => { setLocalCounterScale(counterScale); }, [counterScale]);
  useEffect(() => { setLocalBreathingSpeed(breathingGuideSpeed); }, [breathingGuideSpeed]);
  useEffect(() => { setLocalHadithSlideDuration(hadithSlideDuration); }, [hadithSlideDuration]);

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
    <>
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
              <TabsTrigger value="system" className="text-xs">Behavior</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-1 py-1 custom-scrollbar">
            {/* THEMES TAB */}
            <TabsContent value="themes" className="space-y-6 mt-0 pb-6 px-4 overflow-x-hidden">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Visual Theme</p>
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`
                        p-3 rounded-2xl text-left border transition-all active:scale-[0.98] duration-150
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
                    </button>
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
                <div className="p-4 rounded-2xl bg-card mb-2 space-y-4">
                  {/* App general size */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">App Font Size</p>
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

                  {/* Dhikr text size */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-sm font-medium text-foreground">Dhikr Text Size</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.85, 1, 1.2, 1.4].map((scale) => (
                        <button
                          key={scale}
                          onClick={() => setDhikrFontSize(scale)}
                          className={`
                                py-2 px-1 rounded-lg text-xs font-medium border transition-colors
                                ${dhikrFontSize === scale
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {scale === 0.85 ? 'Small' : scale === 1 ? 'Normal' : scale === 1.2 ? 'Large' : 'X-Large'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Counter count text size */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-sm font-medium text-foreground">Counter Digit Size</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.85, 1, 1.15, 1.3].map((scale) => (
                        <button
                          key={scale}
                          onClick={() => setCountFontSize(scale)}
                          className={`
                                py-2 px-1 rounded-lg text-xs font-medium border transition-colors
                                ${countFontSize === scale
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'}
                            `}
                        >
                          {scale === 0.85 ? 'Small' : scale === 1 ? 'Normal' : scale === 1.15 ? 'Large' : 'X-Large'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* COUNTER TAB */}
            <TabsContent value="counter" className="space-y-6 mt-0 pb-10 px-4 overflow-x-hidden focus-visible:outline-none">
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide px-1">Counter Shape</p>
                
                {/* Categorized Shapes */}
                {SHAPE_CATEGORIES.map((category, catIndex) => (
                  <div key={category.title} className="space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground/70 px-1">{category.title}</p>
                    <div className="grid grid-cols-3 gap-2 pb-2">
                      {counterShapes.filter(s => category.list.includes(s.id)).map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setCounterShape(shape.id)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-[0.96] duration-150
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
                    </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>


            </TabsContent>

            {/* SYSTEM TAB */}
            <TabsContent value="system" className="space-y-6 mt-0 pb-10 px-4 overflow-x-hidden focus-visible:outline-none">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.language')}</p>
                <div className="p-4 rounded-2xl bg-card border border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    {[{ code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'ar', label: 'العربية', flag: '🇸🇦' }].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          language === lang.code
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background border-border'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`text-sm font-medium ${language === lang.code ? 'text-primary' : 'text-foreground'}`}>{lang.label}</span>
                        {language === lang.code && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.ambient_sound')}</p>
                <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {[{key:'none',icon:'🔇',label:t('settings.ambient_none')},{key:'rain',icon:'🌧️',label:t('settings.ambient_rain')},{key:'water',icon:'💧',label:t('settings.ambient_water')},{key:'masjid',icon:'🕌',label:t('settings.ambient_masjid')}].map(({ key, icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setAmbientSound(key as any)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                          ambientSoundType === key ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  {ambientSoundType !== 'none' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t('settings.ambient_volume')}</span>
                        <span className="font-mono text-primary">{Math.round(ambientSoundVolume * 100)}%</span>
                      </div>
                      <input type="range" min="0" max="1" step="0.05" value={ambientSoundVolume}
                        onChange={(e) => setAmbientSoundVolume(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  )}
                </div>
              </div>



              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.haptic_pattern')}</p>
                <div className="p-4 rounded-2xl bg-card border border-border/50">
                  <div className="grid grid-cols-3 gap-2">
                    {[{key:'default',label:t('settings.haptic_default')},{key:'double',label:t('settings.haptic_double')},{key:'triple',label:t('settings.haptic_triple')}].map(({ key, label }) => (
                      <button key={key} onClick={() => setHapticPattern(key as any)}
                        className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                          hapticPattern === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                    <p className="text-sm font-medium text-foreground">Pocket Mode</p>
                    <p className="text-xs text-muted-foreground">Turn screen black to save battery</p>
                  </div>
                  <Switch checked={screenOffMode} onCheckedChange={(val) => {
                    setScreenOffMode(val);
                    setOpen(false);
                  }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Volume Buttons</p>
                    <p className="text-xs text-muted-foreground">Use physical keys to count</p>
                  </div>
                  <Switch checked={volumeButtonCounting} onCheckedChange={setVolumeButtonCounting} />
                </div>
              </div>



              <div className="p-4 rounded-2xl bg-card border border-border/50 mt-4 space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide px-1">Data Management</p>
                <div className="space-y-2">
                  <LoginView>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Cloud className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Cloud Sync & Security</p>
                          <p className="text-xs text-muted-foreground">Sign in to backup your data securely</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary/50 transition-colors" />
                    </button>
                  </LoginView>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-red-500">Clear All Data</p>
                            <p className="text-xs text-red-500/70">Permanently delete all records</p>
                          </div>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90vw] max-w-[400px] rounded-[2rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          entire dhikr history, routines, and reset all settings to default.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { clearAllData(); setOpen(false); }} className="bg-red-500 hover:bg-red-600 rounded-xl">
                          Delete Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

              <div className="p-4 rounded-2xl bg-card border border-border/50 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Privacy Policy</p>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          navigate('/privacy');
                        }} 
                        className="text-xs text-primary hover:underline text-left flex items-center gap-1"
                      >
                        Read Privacy Policy <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* DATA TAB */}
            <TabsContent value="data" className="space-y-6 mt-0 pb-6 px-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">Account</p>
                <GoogleLogin />
              </div>

              <div className="space-y-1 mt-4">
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
    </>
  );
}
