import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    Bell, Plus, Trash2, Clock, Compass, ChevronDown, ChevronUp,
    Check, Sparkles, Moon, Pencil, X, Settings2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { NotificationManager } from '@/lib/notifications';
import { initPrayerTimeReminders } from '@/lib/prayerTimes';
import { getSmartSuggestions } from '@/lib/smartReminders';
import { SmartSuggestionCards } from './SmartSuggestionCards';

interface Reminder {
    id: string;
    time: string;
    label: string;
    enabled: boolean;
    days: number[];
}

interface RemindersViewProps {
    children: React.ReactNode;
}

export function RemindersView({ children }: RemindersViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[92vh] p-0 overflow-hidden flex flex-col">
                <SheetDescription className="sr-only">
                    Configure and manage your dhikr reminders with smart suggestions.
                </SheetDescription>
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>
                {/* Sticky header */}
                <SheetHeader className="px-5 pb-3 shrink-0 border-b border-border/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'hsl(var(--primary) / 0.12)',
                                    border: '1px solid hsl(var(--primary) / 0.2)',
                                }}
                            >
                                <Bell size={15} className="text-primary" />
                            </div>
                            <SheetTitle className="text-base font-semibold">Reminders</SheetTitle>
                        </div>
                        <AddReminderButton />
                    </div>
                </SheetHeader>
                <RemindersContent />
            </SheetContent>
        </Sheet>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Add Reminder Button — floated to top-right of header                        */
/* ─────────────────────────────────────────────────────────────────────────── */
function AddReminderButton() {
    const [open, setOpen] = useState(false);
    const addReminder = useTasbeehStore((s) => s.addReminder);
    const reminders = useTasbeehStore((s) => s.reminders);
    const reminderEnabled = useTasbeehStore((s) => s.reminderEnabled);

    const [form, setForm] = useState({ time: '08:00', label: '', days: [0, 1, 2, 3, 4, 5, 6] });
    const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const REPEAT_SHORTCUTS = [
        { label: 'Every day', days: [0, 1, 2, 3, 4, 5, 6] },
        { label: 'Weekdays', days: [1, 2, 3, 4, 5] },
        { label: 'Weekends', days: [0, 6] },
    ];

    const handleAdd = () => {
        if (!form.label.trim()) { toast.error('Please enter a reminder label'); return; }
        if (form.days.length === 0) { toast.error('Select at least one day'); return; }
        addReminder({ time: form.time, label: form.label.trim(), enabled: true, days: form.days });
        // Sync native notifications
        NotificationManager.syncReminders(
            [...reminders, { id: 'new', ...form, enabled: true }],
            reminderEnabled
        );
        setForm({ time: '08:00', label: '', days: [0, 1, 2, 3, 4, 5, 6] });
        setOpen(false);
        toast.success('Reminder added!');
    };

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                }}
            >
                <Plus size={13} />
                Add
            </motion.button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        />
                        {/* Form panel */}
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="fixed inset-x-4 bottom-6 z-50 rounded-3xl p-5 shadow-2xl space-y-4"
                            style={{
                                background: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border) / 0.4)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-foreground">New Reminder</p>
                                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Time picker */}
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-primary shrink-0" />
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="flex-1 rounded-xl px-3 py-2 text-2xl font-bold tabular-nums bg-transparent border border-border/40 text-foreground focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            {/* Label */}
                            <input
                                type="text"
                                placeholder="Label (e.g. Morning Adhkar)"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                className="w-full rounded-xl px-3 py-2.5 text-sm bg-transparent border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                            />

                            {/* Repeat shortcuts */}
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Repeat</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {REPEAT_SHORTCUTS.map((s) => {
                                        const active = JSON.stringify(s.days.sort()) === JSON.stringify([...form.days].sort());
                                        return (
                                            <button
                                                key={s.label}
                                                onClick={() => setForm({ ...form, days: s.days })}
                                                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                                                style={{
                                                    background: active ? 'hsl(var(--primary))' : 'hsl(var(--card) / 0.6)',
                                                    color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground) / 0.7)',
                                                    borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.5)',
                                                }}
                                            >
                                                {s.label}
                                            </button>
                                        );
                                    })}
                                    {/* Custom */}
                                    <button
                                        onClick={() => {}}
                                        className="px-3 py-1 rounded-full text-xs font-medium border border-border/40 text-muted-foreground"
                                    >
                                        Custom
                                    </button>
                                </div>

                                {/* Day pills */}
                                <div className="flex gap-1.5">
                                    {DAY_NAMES.map((d, i) => {
                                        const active = form.days.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        days: active
                                                            ? form.days.filter((x) => x !== i)
                                                            : [...form.days, i],
                                                    })
                                                }
                                                className="w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all"
                                                style={{
                                                    background: active ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.3)',
                                                    color: active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground) / 0.6)',
                                                }}
                                            >
                                                {d}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAdd}
                                className="w-full py-3 rounded-2xl text-sm font-semibold"
                                style={{
                                    background: 'hsl(var(--primary))',
                                    color: 'hsl(var(--primary-foreground))',
                                }}
                            >
                                Add Reminder
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Content                                                                 */
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
    } = useTasbeehStore();

    const [settingsOpen, setSettingsOpen] = useState(false);

    const suggestions = useMemo(
        () => getSmartSuggestions(sessions, reminders),
        [sessions, reminders]
    );

    const handleLocationChange = async (checked: boolean) => {
        if (checked) {
            setSyncPrayerTimes(true);
            try {
                await initPrayerTimeReminders(true);
                toast.success('Prayer times synced!');
            } catch {
                toast.error('Failed to sync prayer times.');
            }
        } else {
            setSyncPrayerTimes(false);
            toast.success('Location sync disabled');
        }
    };

    const requestNotificationPermission = async () => {
        const nativeGranted = await NotificationManager.requestPermission();
        if (nativeGranted) {
            setNotificationsEnabled(true);
            NotificationManager.syncReminders(reminders, true);
            toast.success('Notifications enabled!');
            return;
        }
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                toast.success('Notifications enabled!');
            } else {
                toast.error('Notification permission denied');
            }
        } else {
            toast.error('Notifications not supported on this device');
        }
    };

    const addSuggestion = (s: { time: string; label: string }) => {
        storeAddReminder({ time: s.time, label: s.label, enabled: true, days: [0, 1, 2, 3, 4, 5, 6] });
        toast.success(`${s.label} reminder added!`);
    };

    const QUICK_PRESETS = [
        { label: '🌅 Morning Adhkar', time: '05:30' },
        { label: '🌆 Evening Adhkar', time: '18:30' },
        { label: '🎯 Daily Goal', time: '21:00' },
    ];

    return (
        <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-5 pt-4">

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <SmartSuggestionCards suggestions={suggestions} onAdd={addSuggestion} />
                </motion.div>
            )}

            {/* Quick Presets */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">Quick Presets</p>
                <div className="flex gap-2 flex-wrap">
                    {QUICK_PRESETS.map((preset) => {
                        const exists = reminders.some((r) => r.label === preset.label);
                        return (
                            <motion.button
                                key={preset.label}
                                whileTap={{ scale: 0.95 }}
                                disabled={exists}
                                onClick={() => {
                                    storeAddReminder({ time: preset.time, label: preset.label, enabled: true, days: [0, 1, 2, 3, 4, 5, 6] });
                                    toast.success(`${preset.label} added!`);
                                }}
                                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                style={exists
                                    ? { background: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)', color: 'hsl(var(--primary))' }
                                    : { background: 'hsl(var(--card) / 0.6)', borderColor: 'hsl(var(--border) / 0.5)', color: 'hsl(var(--foreground) / 0.8)' }
                                }
                            >
                                {exists && <Check size={10} />}
                                {preset.label}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Settings Section */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <button
                    onClick={() => setSettingsOpen((o) => !o)}
                    className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2"
                >
                    <div className="flex items-center gap-1.5">
                        <Settings2 size={12} />
                        Settings
                    </div>
                    {settingsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                <AnimatePresence>
                    {settingsOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            {/* Notification Permission */}
                            <SettingRow
                                icon={<Bell size={14} className="text-primary" />}
                                title="Enable Notifications"
                                description={notificationsEnabled ? 'Notifications are active' : 'Turn on to receive reminders'}
                                checked={notificationsEnabled}
                                onCheckedChange={(checked) => {
                                    if (checked) requestNotificationPermission();
                                    else setNotificationsEnabled(false);
                                }}
                            />

                            {/* Lazy Day Recovery */}
                            <SettingRow
                                icon={<Moon size={14} className="text-primary" />}
                                title="Evening Recovery Nudge"
                                description="Get a reminder at 8:30 PM if you haven't done dhikr"
                                checked={lazyDayRecoveryEnabled}
                                onCheckedChange={setLazyDayRecoveryEnabled}
                            />

                            {/* Prayer Time Sync */}
                            <SettingRow
                                icon={<Compass size={14} className="text-primary" />}
                                title="Sync Prayer Times"
                                description="Use location to auto-set prayer time reminders"
                                checked={syncPrayerTimes === true}
                                onCheckedChange={handleLocationChange}
                            />

                            {/* Auto Tasbih */}
                            {notificationsEnabled && (
                                <SettingRow
                                    icon={<Sparkles size={14} className="text-primary" />}
                                    title="Auto-Start Tasbih"
                                    description="Auto-start 100 Tasbeeh when reminder fires"
                                    checked={autoStartPostPrayerTasbeeh}
                                    onCheckedChange={setAutoStartPostPrayerTasbeeh}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Reminders List */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
                    Your Reminders
                    {reminders.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>
                            {reminders.filter((r) => r.enabled).length} active
                        </span>
                    )}
                </p>

                {reminders.length === 0 ? (
                    <div
                        className="rounded-2xl py-10 text-center"
                        style={{ background: 'hsl(var(--card) / 0.4)', border: '1px dashed hsl(var(--border) / 0.5)' }}
                    >
                        <Bell size={28} className="text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No reminders set</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Tap + Add to create one</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        <AnimatePresence>
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
            </motion.div>

            {/* Bottom tip */}
            <p className="text-[11px] text-muted-foreground/60 text-center pb-2">
                💡 For reliable notifications, keep the app open or install it as a PWA
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Setting Row                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function SettingRow({
    icon, title, description, checked, onCheckedChange,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}) {
    return (
        <div
            className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
            style={{
                background: 'hsl(var(--card) / 0.5)',
                border: '1px solid hsl(var(--border) / 0.3)',
            }}
        >
            <div className="flex items-start gap-2.5 flex-1">
                <div className="mt-0.5">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
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
/* Reminder Card — alarm-clock style with inline edit & swipe delete           */
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
    const updateReminder = useTasbeehStore((s) => s.removeReminder);
    const addReminder = useTasbeehStore((s) => s.addReminder);

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
        // Delete old, add updated
        updateReminder(reminder.id);
        addReminder({ time: editTime, label: editLabel.trim(), enabled: reminder.enabled, days: reminder.days });
        setEditing(false);
        toast.success('Reminder updated');
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24, height: 0 }}
            transition={{ delay: index * 0.04 }}
            className="relative overflow-hidden rounded-2xl"
            style={{
                background: reminder.enabled
                    ? 'hsl(var(--card) / 0.7)'
                    : 'hsl(var(--card) / 0.35)',
                border: reminder.enabled
                    ? '1px solid hsl(var(--primary) / 0.2)'
                    : '1px solid hsl(var(--border) / 0.3)',
                backdropFilter: 'blur(12px)',
                opacity: reminder.enabled ? 1 : 0.65,
            }}
        >
            {/* Active indicator bar */}
            {reminder.enabled && (
                <div
                    className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                    style={{ background: 'hsl(var(--primary))' }}
                />
            )}

            <div className="px-4 py-3.5">
                {editing ? (
                    /* ── Edit Mode ── */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 text-2xl font-bold tabular-nums bg-transparent border border-border/40 text-foreground focus:outline-none focus:border-primary/50"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 text-sm bg-transparent border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                            placeholder="Reminder label"
                        />
                        <div className="flex gap-2">
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={saveEdit}
                                className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                            >
                                <Check size={12} /> Save
                            </motion.button>
                            <button
                                onClick={() => { setEditing(false); setEditLabel(reminder.label); setEditTime(reminder.time); }}
                                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* ── View Mode ── */
                    <div className="flex items-start gap-3">
                        <Switch
                            checked={reminder.enabled}
                            onCheckedChange={onToggle}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            {/* Time row */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
                                    {reminder.time}
                                </span>
                                {nextFireTime && (
                                    <span className="text-[10px] text-primary/70 font-medium">
                                        {nextFireTime}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <p className="text-sm font-medium text-foreground/80 mt-0.5 truncate">
                                {reminder.label}
                            </p>

                            {/* Day pills */}
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {DAY_NAMES.map((d, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                        style={{
                                            background: reminder.days.includes(i)
                                                ? 'hsl(var(--primary) / 0.15)'
                                                : 'hsl(var(--border) / 0.2)',
                                            color: reminder.days.includes(i)
                                                ? 'hsl(var(--primary))'
                                                : 'hsl(var(--muted-foreground) / 0.4)',
                                        }}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1 shrink-0">
                            <button
                                onClick={() => setEditing(true)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
