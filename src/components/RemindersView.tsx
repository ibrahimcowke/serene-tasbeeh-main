import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Reminder {
    id: string;
    time: string;
    label: string;
    enabled: boolean;
    days: number[]; // 0-6 for Sunday-Saturday
}

interface RemindersViewProps {
    children: React.ReactNode;
}

export function RemindersView({ children }: RemindersViewProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Reminders</SheetTitle>
                </SheetHeader>
                <RemindersContent />
            </SheetContent>
        </Sheet>
    );
}

function RemindersContent() {
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        const saved = localStorage.getItem('tasbeeh-reminders');
        return saved ? JSON.parse(saved) : [
            { id: '1', time: '06:00', label: 'Fajr Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
            { id: '2', time: '13:00', label: 'Dhuhr Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
            { id: '3', time: '18:00', label: 'Maghrib Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
            { id: '4', time: '21:00', label: 'Evening Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
        ];
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [newReminder, setNewReminder] = useState({
        time: '12:00',
        label: '',
        days: [0, 1, 2, 3, 4, 5, 6],
    });

    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        return localStorage.getItem('notifications-enabled') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('tasbeeh-reminders', JSON.stringify(reminders));
    }, [reminders]);

    useEffect(() => {
        localStorage.setItem('notifications-enabled', String(notificationsEnabled));
    }, [notificationsEnabled]);

    // Request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                toast.success('Notifications enabled!');
            } else {
                toast.error('Notification permission denied');
            }
        } else {
            toast.error('Notifications not supported in this browser');
        }
    };

    // Schedule notifications
    useEffect(() => {
        if (!notificationsEnabled || !('Notification' in window)) return;

        const checkReminders = () => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const currentDay = now.getDay();

            reminders.forEach((reminder) => {
                if (
                    reminder.enabled &&
                    reminder.time === currentTime &&
                    reminder.days.includes(currentDay)
                ) {
                    new Notification('Tasbeeh Reminder', {
                        body: reminder.label || 'Time for dhikr',
                        icon: '/icon-192.png',
                        badge: '/icon-192.png',
                        tag: reminder.id,
                    });
                }
            });
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [reminders, notificationsEnabled]);

    const addReminder = () => {
        if (!newReminder.label.trim()) {
            toast.error('Please enter a label');
            return;
        }

        const reminder: Reminder = {
            id: Date.now().toString(),
            time: newReminder.time,
            label: newReminder.label,
            enabled: true,
            days: newReminder.days,
        };

        setReminders([...reminders, reminder]);
        setNewReminder({ time: '12:00', label: '', days: [0, 1, 2, 3, 4, 5, 6] });
        setShowAddForm(false);
        toast.success('Reminder added!');
    };

    const deleteReminder = (id: string) => {
        setReminders(reminders.filter(r => r.id !== id));
        toast.success('Reminder deleted');
    };

    const toggleReminder = (id: string) => {
        setReminders(reminders.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
    };

    const toggleDay = (day: number) => {
        setNewReminder({
            ...newReminder,
            days: newReminder.days.includes(day)
                ? newReminder.days.filter(d => d !== day)
                : [...newReminder.days, day],
        });
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="overflow-y-auto space-y-6 pb-24 h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <p className="text-muted-foreground">Set up dhikr reminders throughout the day</p>
                </div>

                {/* Notification Permission */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Enable notifications to receive reminders
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications" className="text-base">
                                Enable Notifications
                            </Label>
                            <Switch
                                id="notifications"
                                checked={notificationsEnabled}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        requestNotificationPermission();
                                    } else {
                                        setNotificationsEnabled(false);
                                    }
                                }}
                            />
                        </div>
                        {!notificationsEnabled && (
                            <p className="text-sm text-muted-foreground">
                                Turn on notifications to receive dhikr reminders at scheduled times
                            </p>
                        )}
                        {notificationsEnabled && Notification.permission !== 'granted' && (
                            <p className="text-sm text-amber-600">
                                Please allow notifications in your browser settings
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Add Reminder Button */}
                {!showAddForm && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="w-full"
                        variant="outline"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Reminder
                    </Button>
                )}

                {/* Add Reminder Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card className="border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-lg">New Reminder</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="label">Label</Label>
                                    <Input
                                        id="label"
                                        placeholder="e.g., Morning Dhikr"
                                        value={newReminder.label}
                                        onChange={(e) => setNewReminder({ ...newReminder, label: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newReminder.time}
                                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Repeat on</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {dayNames.map((day, index) => (
                                            <button
                                                key={index}
                                                onClick={() => toggleDay(index)}
                                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${newReminder.days.includes(index)
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-card border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={addReminder} className="flex-1">
                                        Add Reminder
                                    </Button>
                                    <Button
                                        onClick={() => setShowAddForm(false)}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Reminders List */}
                <div className="space-y-3">
                    {reminders.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground">No reminders set</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Add a reminder to get notified for dhikr
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        reminders.map((reminder, index) => (
                            <motion.div
                                key={reminder.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className={reminder.enabled ? 'border-primary/20' : 'opacity-60'}>
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <Switch
                                                    checked={reminder.enabled}
                                                    onCheckedChange={() => toggleReminder(reminder.id)}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="font-semibold text-lg">
                                                            {reminder.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground font-medium">
                                                        {reminder.label}
                                                    </p>
                                                    <div className="flex gap-1 mt-2">
                                                        {reminder.days.map((day) => (
                                                            <span
                                                                key={day}
                                                                className="text-xs px-2 py-1 rounded bg-primary/10 text-primary"
                                                            >
                                                                {dayNames[day]}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteReminder(reminder.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Info Card */}
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                    <CardContent className="py-4">
                        <p className="text-sm text-muted-foreground">
                            💡 <strong>Tip:</strong> Reminders work best when the app is open or running in the background.
                            For reliable notifications, consider keeping the app as a pinned tab.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
