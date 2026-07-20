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
  { title: 'Objects & 3D', list: ['digital', 'bead-ring', 'digital-watch', 'tally-clicker', 'digital-tally', 'diamond-prism'] },
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
    autoThemeSwitch,
    setAutoThemeSwitch,
    autoThemeDawnDusk,
    setAutoThemeDawnDusk,
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
    autoThemeSwitch: state.autoThemeSwitch,
    setAutoThemeSwitch: state.setAutoThemeSwitch,
    autoThemeDawnDusk: state.autoThemeDawnDusk,
    setAutoThemeDawnDusk: state.setAutoThemeDawnDusk,
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
  const [localHadithSlideDuration, setLocalHadithSlideDuration] = useState(hadithSlideDuration);

  // Synchronize local states when store state changes externally
  useEffect(() => { setLocalVerticalOffset(verticalOffset); }, [verticalOffset]);
  useEffect(() => { setLocalDhikrVerticalOffset(dhikrVerticalOffset); }, [dhikrVerticalOffset]);
  useEffect(() => { setLocalCounterVerticalOffset(counterVerticalOffset); }, [counterVerticalOffset]);
  useEffect(() => { setLocalCounterScale(counterScale); }, [counterScale]);
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
        <SheetTitle className="text-lg font-medium">{t('settings.title')}</SheetTitle>
        <SheetDescription className="sr-only">Configure app visuals, counter, and preferences</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue={defaultTab === 'appearance' ? 'themes' : defaultTab} className="flex-1 flex flex-col h-full">
          <div className="px-6 pt-2 pb-4 shrink-0 bg-background/50 backdrop-blur-sm z-10">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="themes" className="text-xs">{t('settings.themes')}</TabsTrigger>
              <TabsTrigger value="counter" className="text-xs">{t('settings.counter')}</TabsTrigger>
              <TabsTrigger value="system" className="text-xs">{t('settings.behavior')}</TabsTrigger>
              <TabsTrigger value="data" className="text-xs">{t('settings.data')}</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-1 py-1 custom-scrollbar">
            {/* THEMES TAB */}
            <TabsContent value="themes" className="space-y-6 mt-0 pb-6 px-4 overflow-x-hidden">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.visual_theme')}</p>
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {themes.map((tItem) => (
                    <button
                      key={tItem.id}
                      onClick={() => setTheme(tItem.id)}
                      className={`
                        p-3 rounded-2xl text-left border transition-all active:scale-[0.98] duration-150
                        ${theme === tItem.id
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-card border-border hover:bg-secondary'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="overflow-hidden">
                          <p className={`text-[13px] font-medium truncate ${theme === tItem.id ? 'text-primary' : 'text-foreground'}`}>
                            {t(`theme.${tItem.id}.label`)}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{t(`theme.${tItem.id}.desc`)}</p>
                        </div>
                        {theme === tItem.id && (
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
                    <p className="text-sm font-medium text-foreground">{t('settings.auto_theme')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.auto_theme_desc')}</p>
                  </div>
                  <Switch
                    checked={autoThemeSwitch}
                    onCheckedChange={setAutoThemeSwitch}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.dawn_dusk_schedule')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.dawn_dusk_desc')}</p>
                  </div>
                  <Switch
                    checked={autoThemeDawnDusk}
                    onCheckedChange={setAutoThemeDawnDusk}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{t('settings.typography')}</p>
                <div className="p-4 rounded-2xl bg-card mb-2 space-y-4">
                  {/* App general size */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{t('settings.app_font_size')}</p>
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
                          {scale === 0.8 ? t('settings.size_small') : scale === 1 ? t('settings.size_normal') : t('settings.size_large')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dhikr text size */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-sm font-medium text-foreground">{t('settings.dhikr_font_size')}</p>
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
                          {scale === 0.85 ? t('settings.size_small') : scale === 1 ? t('settings.size_normal') : scale === 1.2 ? t('settings.size_large') : t('settings.size_xlarge')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Counter count text size */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <p className="text-sm font-medium text-foreground">{t('settings.counter_digit_size')}</p>
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
                          {scale === 0.85 ? t('settings.size_small') : scale === 1 ? t('settings.size_normal') : scale === 1.15 ? t('settings.size_large') : t('settings.size_xlarge')}
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide px-1">{t('settings.counter_shape')}</p>
                
                {/* Categorized Shapes */}
                {SHAPE_CATEGORIES.map((category, catIndex) => (
                  <div key={category.title} className="space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground/70 px-1">{t('settings.shape_category.' + category.title.toLowerCase().replace(/[^a-z0-9]/g, ''))}</p>
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
                        {t('shape.' + shape.id)}
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
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en', label: 'English',    flag: '🇬🇧' },
                      { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
                      { code: 'hi', label: 'हिन्दी',      flag: '🇮🇳' },
                      { code: 'ur', label: 'اردو',       flag: '🇵🇰' },
                      { code: 'tr', label: 'Türkçe',    flag: '🇹🇷' },
                      { code: 'ms', label: 'Melayu',    flag: '🇲🇾' },
                      { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
                      { code: 'fr', label: 'Français',  flag: '🇫🇷' },
                      { code: 'so', label: 'Soomaali',  flag: '🇸🇴' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${
                          language === lang.code
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background border-border hover:border-primary/30'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className={`text-[10px] font-medium leading-tight text-center ${language === lang.code ? 'text-primary' : 'text-foreground'}`}>{lang.label}</span>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.notifications')}</p>
                <RemindersView>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary">{t('settings.reminders_alerts')}</p>
                        <p className="text-xs text-primary/70">{t('settings.reminders_desc')}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                  </button>
                </RemindersView>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.interaction')}</p>
                <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('settings.haptic_feedback')}</p>
                      <p className="text-xs text-muted-foreground">{t('settings.haptic_desc')}</p>
                    </div>
                    <Switch checked={currentSettings.hapticEnabled} onCheckedChange={toggleHaptic} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('settings.sound_effects')}</p>
                      <p className="text-xs text-muted-foreground">{t('settings.sound_desc')}</p>
                    </div>
                    <Switch checked={currentSettings.soundEnabled} onCheckedChange={toggleSound} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.shake_to_reset')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.shake_desc')}</p>
                  </div>
                  <Switch checked={shakeToReset} onCheckedChange={setShakeToReset} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.stay_awake')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.stay_awake_desc')}</p>
                  </div>
                  <Switch checked={wakeLockEnabled} onCheckedChange={setWakeLockEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.pocket_mode')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.pocket_mode_desc')}</p>
                  </div>
                  <Switch checked={screenOffMode} onCheckedChange={(val) => {
                    setScreenOffMode(val);
                    setOpen(false);
                  }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.volume_buttons')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.volume_buttons_desc')}</p>
                  </div>
                  <Switch checked={volumeButtonCounting} onCheckedChange={setVolumeButtonCounting} />
                </div>
              </div>



              <div className="p-4 rounded-2xl bg-card border border-border/50 mt-4 space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide px-1">{t('settings.data_management')}</p>
                <div className="space-y-2">
                  <LoginView>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Cloud className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{t('settings.cloud_sync')}</p>
                          <p className="text-xs text-muted-foreground">{t('settings.cloud_sync_desc')}</p>
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
                            <p className="text-sm font-medium text-red-500">{t('settings.clear_data')}</p>
                            <p className="text-xs text-red-500/70">{t('settings.clear_data_desc')}</p>
                          </div>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90vw] max-w-[400px] rounded-[2rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('settings.clear_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('settings.clear_confirm_desc')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">{t('general.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { clearAllData(); setOpen(false); }} className="bg-red-500 hover:bg-red-600 rounded-xl">
                          {t('settings.clear_confirm_action')}
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
                      <p className="text-sm font-medium text-foreground">{t('settings.developed_by')}</p>
                      <a href="https://ibrahimcowke.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                        {t('settings.visit_portfolio')} <ExternalLink className="w-3 h-3" />
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
                      <p className="text-sm font-medium text-foreground">{t('settings.privacy_policy')}</p>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          navigate('/privacy');
                        }} 
                        className="text-xs text-primary hover:underline text-left flex items-center gap-1"
                      >
                        {t('settings.read_privacy')} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* DATA TAB */}
            <TabsContent value="data" className="space-y-6 mt-0 pb-6 px-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.account')}</p>
                <GoogleLogin />
              </div>

              <div className="space-y-1 mt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">{t('settings.data_management')}</p>
                <button onClick={handleExport} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:bg-secondary transition-colors text-left mb-2">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.export_backup')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.export_desc')}</p>
                  </div>
                </button>
                <button onClick={handleImport} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:bg-secondary transition-colors text-left">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('settings.import_backup')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.import_desc')}</p>
                  </div>
                </button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-left border border-red-500/20 mt-4">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-500">{t('settings.reset_data')}</p>
                      <p className="text-xs text-red-500/70">{t('settings.reset_desc')}</p>
                    </div>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.reset_confirm_title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('settings.reset_confirm_desc')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('general.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData} className="bg-red-500 hover:bg-red-600">{t('settings.reset_confirm_action')}</AlertDialogAction>
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
