import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Plus, Trash2, Clock, Compass, ChevronDown, ChevronUp,
    Check, Sparkles, Moon, Pencil, X, Settings2,
    Play, Volume2, Zap, ShieldCheck, Calendar, ArrowRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore, Reminder } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { NotificationManager } from '@/lib/notifications';
import { initPrayerTimeReminders, getPrayerTimesForToday } from '@/lib/prayerTimes';
import { getSmartSuggestions } from '@/lib/smartReminders';
import { SmartSuggestionCards } from './SmartSuggestionCards';
import { useTranslation } from '@/lib/i18n';

interface RemindersViewProps {
    children: React.ReactNode;
}

const SOUND_OPTIONS = [
    { value: 'default', label: '🔀 Auto Random Voice', desc: 'Random peaceful voice reminder' },
    { value: 'subhanallah', label: '🗣️ SubhanAllah', desc: 'Peaceful recitation' },
    { value: 'alhamdulillah', label: '🗣️ Alhamdulillah', desc: 'Gentle praise' },
    { value: 'astaghfirullah', label: '🗣️ Astaghfirullah', desc: 'Quiet istighfar' },
    { value: 'salawat', label: '🗣️ Salawat', desc: 'Blessings upon the Prophet' },
    { value: 'ayat_kursi', label: '📖 Ayat al-Kursi', desc: 'Protection verse' },
    { value: 'hasbunallah', label: '🤲 Hasbunallah', desc: 'Trust in Allah' },
    { value: 'rabbi_zidni', label: '📚 Rabbi Zidni \'Ilma', desc: 'Seeking knowledge' },
    { value: 'subhanallahi_wabihamdihi', label: '✨ SubhanAllahi Wa Bihamdihi', desc: 'Praise & Glory' },
    { value: 'rabbana_atina', label: '🌟 Rabbana Atina', desc: 'Comprehensive Dua' },
] as const;

export function RemindersView({ children }: RemindersViewProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" className="bg-background/95 backdrop-blur-2xl border-t border-primary/20 rounded-t-[2.5rem] h-[92vh] max-h-[900px] p-0 overflow-hidden flex flex-col shadow-2xl">
                <SheetDescription className="sr-only">
                    Configure and manage your fast dhikr reminders, voice sounds, and prayer time anchors.
                </SheetDescription>
                {open && (
                    <>
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-12 h-1.5 rounded-full bg-primary/25" />
                        </div>
                        <RemindersContent />
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Reminders Panel Content                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
export function RemindersContent() {
    const {
        reminders,
        reminderEnabled: notificationsEnabled,
        addReminder: storeAddReminder,
        removeReminder: storeDeleteReminder,
        toggleReminder: storeToggleReminder,
        setReminderEnabled: setNotificationsEnabled,
        syncPrayerTimes,
        setSyncPrayerTimes,
        autoStartPostPrayerTasbeeh,
        setAutoStartPostPrayerTasbeeh,
        lazyDayRecoveryEnabled,
        setLazyDayRecoveryEnabled,
        sessions,
        sessionMoodRatings,
    } = useTasbeehStore();

    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'reminders' | 'quick' | 'settings'>('reminders');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [localPrayerTimes, setLocalPrayerTimes] = useState<{ label: string; time: string }[]>([]);

    useEffect(() => {
        if (syncPrayerTimes) {
            const cached = localStorage.getItem('tasbeehly_prayer_times_cache');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed && parsed.times) setLocalPrayerTimes(parsed.times);
                } catch (e) {
                    console.error(e);
                }
            }
        } else {
            setLocalPrayerTimes([]);
        }
    }, [syncPrayerTimes, reminders]);

    const suggestions = useMemo(
        () => getSmartSuggestions(sessions, reminders, sessionMoodRatings),
        [sessions, reminders, sessionMoodRatings]
    );

    const activeCount = useMemo(() => reminders.filter(r => r.enabled).length, [reminders]);

    const handleLocationChange = async (checked: boolean) => {
        if (checked) {
            setSyncPrayerTimes(true);
            try {
                const success = await initPrayerTimeReminders(true);
                if (success) {
                    toast.success('Prayer times synced!');
                    const cached = localStorage.getItem('tasbeehly_prayer_times_cache');
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        if (parsed && parsed.times) setLocalPrayerTimes(parsed.times);
                    }
                } else {
                    toast.error('Failed to sync. Check location permission.');
                    setSyncPrayerTimes(false);
                }
            } catch {
                toast.error('Failed to sync prayer times.');
                setSyncPrayerTimes(false);
            }
        } else {
            setSyncPrayerTimes(false);
            setLocalPrayerTimes([]);
            toast.success('Prayer sync disabled');
        }
    };

    const requestNotificationPermission = async () => {
        const nativeGranted = await NotificationManager.requestPermission();
        if (nativeGranted) {
            setNotificationsEnabled(true);
            NotificationManager.syncReminders(reminders, true);
            toast.success('Notifications active!');
            return;
        }
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                toast.success('Notifications active!');
            } else {
                toast.error('Notification permission denied');
            }
        } else {
            toast.error('Notifications not supported');
        }
    };

    const addPresetReminder = (time: string, label: string, relativeToPrayer?: Reminder['relativeToPrayer']) => {
        if (reminders.some(r => r.label.toLowerCase() === label.toLowerCase())) {
            toast.info(`"${label}" reminder is already in your list`);
            return;
        }
        storeAddReminder({
            time,
            label,
            enabled: true,
            days: [0, 1, 2, 3, 4, 5, 6],
            relativeToPrayer
        });
        NotificationManager.syncReminders([...reminders, { id: 'new', time, label, enabled: true, days: [0, 1, 2, 3, 4, 5, 6], relativeToPrayer }], notificationsEnabled);
        toast.success(`Added "${label}" for ${time}! 🔔`);
    };

    const FAST_PRESETS = [
        { label: 'Morning Adhkar', time: '05:30', icon: '🌅', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
        { label: 'Evening Adhkar', time: '18:30', icon: '🌆', color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30' },
        { label: 'Bedtime Dhikr', time: '22:00', icon: '🌙', color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30' },
        { label: 'Daily Devotion', time: '21:00', icon: '🎯', color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30' },
        { label: 'Friday Salawat', time: '14:00', icon: '✨', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-border/40 shrink-0 flex items-center justify-between gap-3 bg-card/60 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-extrabold tracking-tight text-foreground">Reminders & Alarms</h2>
                            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25 text-primary">
                                {activeCount} Active
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Voice alerts & daily prayer notifications</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Add Button */}
                    <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setAddModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-primary to-teal-600 text-primary-foreground shadow-md shadow-primary/25 cursor-pointer active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                    </motion.button>
                </div>
            </div>

            {/* Master Toggle Banner */}
            <div className="px-5 py-2.5 bg-primary/10 border-b border-primary/20 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                        {notificationsEnabled ? 'Notifications are active' : 'Notifications are paused'}
                    </span>
                </div>
                <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                        if (checked) requestNotificationPermission();
                        else {
                            setNotificationsEnabled(false);
                            toast.info('Notifications paused');
                        }
                    }}
                />
            </div>

            {/* Navigation Filter Tabs */}
            <div className="px-5 pt-3 pb-1 shrink-0 flex items-center gap-1.5 border-b border-border/30 bg-background/50">
                <button
                    onClick={() => setActiveTab('reminders')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'reminders'
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'bg-card/60 text-muted-foreground hover:bg-card border border-border/40'
                    }`}
                >
                    <Clock className="w-3.5 h-3.5" />
                    <span>My Reminders ({reminders.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('quick')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'quick'
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'bg-card/60 text-muted-foreground hover:bg-card border border-border/40'
                    }`}
                >
                    <Zap className="w-3.5 h-3.5" />
                    <span>1-Tap Presets</span>
                </button>

                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'settings'
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'bg-card/60 text-muted-foreground hover:bg-card border border-border/40'
                    }`}
                >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Settings & Sync</span>
                </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">

                {/* TAB 1: MY REMINDERS */}
                {activeTab === 'reminders' && (
                    <div className="space-y-4">
                        {/* Smart Suggestions */}
                        {suggestions.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <SmartSuggestionCards
                                    suggestions={suggestions}
                                    onAdd={(s) => addPresetReminder(s.time, s.label)}
                                />
                            </motion.div>
                        )}

                        {/* Reminders List */}
                        {reminders.length === 0 ? (
                            <div className="rounded-3xl py-12 px-4 text-center border border-dashed border-border/60 bg-card/40 flex flex-col items-center justify-center gap-2">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                                    <Bell className="w-7 h-7" />
                                </div>
                                <h3 className="text-sm font-extrabold text-foreground">No Reminders Yet</h3>
                                <p className="text-xs text-muted-foreground max-w-xs">
                                    Tap 1-Tap Presets above or click + Add to create your custom daily Dhikr alarm!
                                </p>
                                <button
                                    onClick={() => setAddModalOpen(true)}
                                    className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" /> Create First Reminder
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {reminders.map((r, i) => (
                                        <ReminderCard
                                            key={r.id}
                                            reminder={r}
                                            index={i}
                                            onToggle={() => {
                                                storeToggleReminder(r.id);
                                                const updated = reminders.map((x) => x.id === r.id ? { ...x, enabled: !x.enabled } : x);
                                                NotificationManager.syncReminders(updated, notificationsEnabled);
                                            }}
                                            onDelete={() => {
                                                storeDeleteReminder(r.id);
                                                NotificationManager.syncReminders(
                                                    reminders.filter((x) => x.id !== r.id),
                                                    notificationsEnabled
                                                );
                                                toast.success('Reminder deleted');
                                            }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: 1-TAP PRESETS */}
                {activeTab === 'quick' && (
                    <div className="space-y-4">
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                            💡 <strong>1-Tap Presets:</strong> Tap any preset card below to instantly add it to your daily reminder schedule.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FAST_PRESETS.map((preset) => {
                                const isAdded = reminders.some(r => r.label.toLowerCase() === preset.label.toLowerCase());
                                return (
                                    <motion.div
                                        key={preset.label}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => !isAdded && addPresetReminder(preset.time, preset.label)}
                                        className={`p-4 rounded-2xl border bg-gradient-to-br transition-all flex items-center justify-between cursor-pointer ${preset.color} ${
                                            isAdded ? 'opacity-60 cursor-default' : 'hover:border-primary'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{preset.icon}</span>
                                            <div>
                                                <h4 className="text-sm font-extrabold text-foreground">{preset.label}</h4>
                                                <p className="text-xs font-mono text-primary font-bold">{preset.time}</p>
                                            </div>
                                        </div>

                                        <button
                                            disabled={isAdded}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                                isAdded
                                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" /> Added
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-3.5 h-3.5" /> Add
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Prayer Anchor Presets */}
                        <div className="pt-3 space-y-2">
                            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Compass className="w-3.5 h-3.5 text-primary" /> Prayer Anchor Presets
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {[
                                    { label: 'Post-Fajr Adhkar', time: '05:45', prayer: 'fajr' as const, offset: 15 },
                                    { label: 'Post-Maghrib Dhikr', time: '18:45', prayer: 'maghrib' as const, offset: 15 },
                                    { label: 'Pre-Fajr Tahajjud', time: '04:30', prayer: 'fajr' as const, offset: -30 },
                                ].map(p => (
                                    <div
                                        key={p.label}
                                        onClick={() => addPresetReminder(p.time, p.label, p.prayer)}
                                        className="p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all flex items-center justify-between cursor-pointer"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-foreground">{p.label}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{p.offset < 0 ? `${Math.abs(p.offset)}m before` : `${p.offset}m after`} {p.prayer}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: SETTINGS & SYNC */}
                {activeTab === 'settings' && (
                    <div className="space-y-3">
                        {/* Notification Permission */}
                        <SettingRow
                            icon={<Bell className="w-4 h-4 text-primary" />}
                            title="System Notifications"
                            description={notificationsEnabled ? 'Active and allowed by OS' : 'Turn on to receive reminders on time'}
                            checked={notificationsEnabled}
                            onCheckedChange={(checked) => {
                                if (checked) requestNotificationPermission();
                                else setNotificationsEnabled(false);
                            }}
                        />

                        {/* Lazy Day Recovery */}
                        <SettingRow
                            icon={<Moon className="w-4 h-4 text-primary" />}
                            title="Evening Recovery Nudge"
                            description="Get a gentle reminder at 8:30 PM if daily Dhikr goal is incomplete"
                            checked={lazyDayRecoveryEnabled}
                            onCheckedChange={setLazyDayRecoveryEnabled}
                        />

                        {/* Prayer Time Sync */}
                        <SettingRow
                            icon={<Compass className="w-4 h-4 text-primary" />}
                            title="Sync Local Prayer Times"
                            description="Automatically update reminder times based on your live GPS location"
                            checked={syncPrayerTimes === true}
                            onCheckedChange={handleLocationChange}
                        />

                        {syncPrayerTimes && localPrayerTimes.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-3.5 bg-primary/5 border border-primary/15 rounded-2xl grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs"
                            >
                                {localPrayerTimes.map(pt => (
                                    <div key={pt.label} className="flex flex-col items-center bg-card/60 p-1.5 rounded-xl border border-border/30">
                                        <span className="font-bold text-[10px] text-muted-foreground uppercase">{pt.label}</span>
                                        <span className="font-black text-primary text-xs">{pt.time}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Auto-Start Tasbeeh */}
                        {notificationsEnabled && (
                            <SettingRow
                                icon={<Sparkles className="w-4 h-4 text-primary" />}
                                title={<span>Auto-Start <strong className="text-primary font-black">Tasbeeh 100</strong></span>}
                                description="Automatically open Tasbeeh counter when tapping a notification"
                                checked={autoStartPostPrayerTasbeeh}
                                onCheckedChange={setAutoStartPostPrayerTasbeeh}
                            />
                        )}
                    </div>
                )}

            </div>

            {/* Modal for Adding Reminder */}
            {addModalOpen && (
                <AddReminderModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                />
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Setting Row Component                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function SettingRow({
    icon, title, description, checked, onCheckedChange,
}: {
    icon: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl p-4 bg-card/80 border border-border/50 shadow-xs">
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">{icon}</div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="shrink-0"
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Add Reminder Modal / Form                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function AddReminderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const addReminder = useTasbeehStore((s) => s.addReminder);
    const reminders = useTasbeehStore((s) => s.reminders);
    const reminderEnabled = useTasbeehStore((s) => s.reminderEnabled);

    const [form, setForm] = useState<{
        time: string;
        label: string;
        days: number[];
        soundType: NonNullable<Reminder['soundType']>;
        relativeToPrayer?: Reminder['relativeToPrayer'];
        offsetMinutes: number;
    }>({
        time: '08:00',
        label: '',
        days: [0, 1, 2, 3, 4, 5, 6],
        soundType: 'default',
        relativeToPrayer: undefined,
        offsetMinutes: 0
    });

    const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const adjustTime = (current: string, minutes: number) => {
        const [h, m] = current.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        date.setMinutes(date.getMinutes() + minutes);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const handleAdd = async () => {
        if (!form.label.trim()) { toast.error('Please enter a reminder label'); return; }
        if (form.days.length === 0) { toast.error('Select at least one day'); return; }

        let initialTime = form.time;
        if (form.relativeToPrayer) {
            try {
                const times = await getPrayerTimesForToday();
                const found = times.find(p => p.name === form.relativeToPrayer);
                if (found) {
                    const [h, m] = found.time.split(':').map(Number);
                    const date = new Date();
                    date.setHours(h, m, 0, 0);
                    date.setMinutes(date.getMinutes() + form.offsetMinutes);
                    initialTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                }
            } catch (e) {
                console.warn(e);
            }
        }

        const newReminderData = {
            time: initialTime,
            label: form.label.trim(),
            enabled: true,
            days: form.days,
            soundType: form.soundType,
            relativeToPrayer: form.relativeToPrayer,
            offsetMinutes: form.offsetMinutes
        };

        addReminder(newReminderData);
        NotificationManager.syncReminders([...reminders, { id: 'new', ...newReminderData }], reminderEnabled);
        onClose();
        toast.success(`Reminder "${form.label}" set for ${initialTime}!`);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed inset-x-3 bottom-6 sm:max-w-lg sm:mx-auto z-50 rounded-3xl p-5 bg-card border border-border shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-border/40">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="text-base font-extrabold text-foreground">New Dhikr Reminder</h3>
                            </div>
                            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Anchor Switch */}
                        <div className="flex items-center justify-between p-3 rounded-2xl border border-primary/20 bg-primary/5">
                            <div className="space-y-0.5 text-left">
                                <p className="text-xs font-bold text-foreground">Anchor to Prayer Time</p>
                                <p className="text-[10px] text-muted-foreground">Updates dynamically as prayer times change</p>
                            </div>
                            <Switch
                                checked={!!form.relativeToPrayer}
                                onCheckedChange={(checked) => setForm(f => ({
                                    ...f,
                                    relativeToPrayer: checked ? 'maghrib' : undefined
                                }))}
                            />
                        </div>

                        {form.relativeToPrayer ? (
                            <div className="space-y-3 p-3 rounded-2xl border border-primary/20 bg-primary/5">
                                <label className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block">Prayer Anchor</label>
                                <div className="grid grid-cols-5 gap-1">
                                    {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, relativeToPrayer: p }))}
                                            className={`py-2 rounded-xl text-xs font-extrabold uppercase border transition-all ${
                                                form.relativeToPrayer === p
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                    : 'border-border/40 bg-card text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs font-bold text-foreground">Offset:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={form.offsetMinutes}
                                            onChange={(e) => setForm(f => ({ ...f, offsetMinutes: Number(e.target.value) }))}
                                            className="w-16 rounded-xl px-2 py-1 text-xs bg-background border border-border text-foreground text-center font-bold"
                                        />
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {form.offsetMinutes < 0 ? `${Math.abs(form.offsetMinutes)}m before` : `${form.offsetMinutes}m after`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Time Picker & Quick Adjust Buttons */
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="time"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        className="flex-1 rounded-2xl px-4 py-2.5 text-3xl font-black tabular-nums bg-card border border-border text-primary text-center focus:outline-none focus:border-primary shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[-60, -15, 15, 60].map(mins => (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, time: adjustTime(f.time, mins) }))}
                                            className="py-1.5 rounded-xl border border-border/50 bg-card text-xs font-bold text-foreground/80 hover:bg-primary/10 hover:border-primary/40 transition-all"
                                        >
                                            {mins > 0 ? `+${mins}m` : `${mins}m`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Label Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">Reminder Label</label>
                            <input
                                type="text"
                                placeholder="e.g. Morning Adhkar or Salawat"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                className="w-full rounded-2xl px-3.5 py-2.5 text-xs bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Repeat Days */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">Repeat Days</label>
                            <div className="flex justify-between gap-1">
                                {DAY_NAMES.map((d, i) => {
                                    const active = form.days.includes(i);
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setForm(f => ({
                                                ...f,
                                                days: active ? f.days.filter(x => x !== i) : [...f.days, i]
                                            }))}
                                            className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center transition-all ${
                                                active
                                                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-105'
                                                    : 'bg-muted/40 border border-border/30 text-muted-foreground'
                                            }`}
                                        >
                                            {d}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Voice Sound Selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground flex items-center gap-1">
                                <Volume2 className="w-3.5 h-3.5 text-primary" /> Spoken Voice Sound
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {SOUND_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => setForm({ ...form, soundType: opt.value })}
                                        className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                            form.soundType === opt.value
                                                ? 'bg-primary/10 border-primary shadow-xs'
                                                : 'bg-background border-border/50 hover:border-primary/40'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-extrabold text-foreground truncate">{opt.label}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{opt.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (opt.value === 'default') {
                                                    SoundManager.playVoiceReminder('subhanallah');
                                                } else {
                                                    SoundManager.playVoiceReminder(opt.value);
                                                }
                                            }}
                                            className="p-1.5 rounded-full hover:bg-primary/20 text-primary transition-colors shrink-0"
                                            title="Preview Sound"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-primary" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleAdd}
                            className="w-full py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-primary to-teal-600 text-primary-foreground shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
                        >
                            Save Dhikr Reminder
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Reminder Card                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */
function ReminderCard({ reminder, index, onToggle, onDelete }: {
    reminder: Reminder;
    index: number;
    onToggle: () => void;
    onDelete: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(reminder.label);
    const [editTime, setEditTime] = useState(reminder.time);
    const [editDays, setEditDays] = useState<number[]>(reminder.days);
    const [editSoundType, setEditSoundType] = useState<NonNullable<Reminder['soundType']>>(reminder.soundType || 'default');

    const storeUpdateReminder = useTasbeehStore((s) => s.updateReminder);
    const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const nextFireTime = useMemo(() => {
        if (!reminder.enabled) return null;
        const now = new Date();
        const [h, m] = reminder.time.split(':').map(Number);
        for (let i = 0; i < 8; i++) {
            const candidate = new Date(now);
            candidate.setDate(now.getDate() + i);
            candidate.setHours(h, m, 0, 0);
            if (candidate > now && reminder.days.includes(candidate.getDay())) {
                const diffMs = candidate.getTime() - now.getTime();
                const diffH = Math.floor(diffMs / (1000 * 60 * 60));
                const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                if (diffH < 24) return `in ${diffH}h ${diffM}m`;
                if (diffH < 48) return 'tomorrow';
                return `in ${Math.ceil(diffH / 24)} days`;
            }
        }
        return null;
    }, [reminder]);

    const saveEdit = () => {
        if (!editLabel.trim()) { toast.error('Label cannot be empty'); return; }
        if (editDays.length === 0) { toast.error('Select at least one day'); return; }
        storeUpdateReminder(reminder.id, {
            time: editTime,
            label: editLabel.trim(),
            days: editDays,
            soundType: editSoundType,
        });
        setEditing(false);
        toast.success('Reminder updated');
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.03 }}
            className={`rounded-2xl border p-4 transition-all ${
                reminder.enabled
                    ? 'bg-card/95 border-primary/25 shadow-md shadow-primary/5'
                    : 'bg-card/40 border-border/40 opacity-60'
            }`}
        >
            {editing ? (
                /* Edit Mode */
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="rounded-xl px-3 py-1.5 text-xl font-bold bg-background border border-border text-primary"
                        />
                        <div className="flex gap-1">
                            <button onClick={saveEdit} className="p-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditing(false)} className="p-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full rounded-xl px-3 py-1.5 text-xs bg-background border border-border text-foreground"
                    />

                    {/* Days */}
                    <div className="flex gap-1">
                        {DAY_NAMES.map((d, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setEditDays(editDays.includes(i) ? editDays.filter(x => x !== i) : [...editDays, i])}
                                className={`w-7 h-7 rounded-full text-[10px] font-bold ${
                                    editDays.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Instant Switch */}
                        <Switch
                            checked={reminder.enabled}
                            onCheckedChange={onToggle}
                            className="shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black tabular-nums text-foreground leading-none">
                                    {reminder.time}
                                </span>
                                {nextFireTime && (
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                        {nextFireTime}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs font-bold text-foreground/90 mt-1 truncate">
                                {reminder.label}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                {reminder.relativeToPrayer && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                                        ⏱️ {reminder.offsetMinutes !== 0 ? (reminder.offsetMinutes! < 0 ? `${Math.abs(reminder.offsetMinutes!)}m before` : `${reminder.offsetMinutes!}m after`) : ''} {reminder.relativeToPrayer}
                                    </span>
                                )}

                                <button
                                    onClick={() => {
                                        const voice = (!reminder.soundType || reminder.soundType === 'default') ? 'subhanallah' : reminder.soundType;
                                        SoundManager.playVoiceReminder(voice);
                                    }}
                                    className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center gap-1 hover:bg-primary/20 transition-colors"
                                >
                                    <Play className="w-2.5 h-2.5 fill-primary" />
                                    {(!reminder.soundType || reminder.soundType === 'default') ? 'Voice Alert' : reminder.soundType}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => setEditing(true)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit Reminder"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete Reminder"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
