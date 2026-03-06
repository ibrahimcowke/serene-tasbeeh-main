import { Bell, Heart, Users, Swords, Trophy, X, Check, Trash2 } from 'lucide-react';
import { useNotificationStore, AppNotification } from '@/store/notificationStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { database } from '@/lib/firebase';
import { ref, set, serverTimestamp } from 'firebase/database';
import { toast } from 'sonner';

export function NotificationCenter() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    } = useNotificationStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'salam': return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
            case 'join': return <Users className="w-4 h-4 text-emerald-500" />;
            case 'challenge': return <Swords className="w-4 h-4 text-amber-500" />;
            case 'challenge_accepted': return <Check className="w-4 h-4 text-blue-500" />;
            case 'milestone': return <Trophy className="w-4 h-4 text-yellow-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    const handleAcceptChallenge = (notification: AppNotification) => {
        const myId = localStorage.getItem('visitor_device_id');
        if (!myId) return;

        const pulseRef = ref(database, 'events/global/pulse');
        set(pulseRef, {
            type: 'challenge_accepted',
            sender_id: myId,
            target_id: notification.data?.user_id,
            timestamp: serverTimestamp()
        });

        markAsRead(notification.id);
        /*
        toast.success("Challenge accepted! Go for +100 dhikrs.");
        */
    };

    return (
        <Popover onOpenChange={(open) => { if (!open) markAllAsRead(); }}>
            <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors group">
                    <Bell className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                className="w-80 p-0 bg-card/40 backdrop-blur-3xl border-white/10 shadow-2xl rounded-3xl overflow-hidden"
            >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        Notifications
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                            {notifications.length} Total
                        </span>
                    </h3>
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                    <AnimatePresence initial={false}>
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center opacity-40"
                            >
                                <Bell className="w-10 h-10 mb-2 stroke-[1.5]" />
                                <p className="text-xs font-medium">All caught up!</p>
                            </motion.div>
                        ) : (
                            notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={`relative group p-3 rounded-2xl transition-all duration-300 mb-1 ${notification.read ? 'opacity-60 bg-white/0 hover:bg-white/5' : 'bg-primary/5 hover:bg-primary/10'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="p-2 h-fit rounded-xl bg-background/40 border border-white/5">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="text-[11px] font-bold text-foreground truncate">{notification.title}</h4>
                                                <span className="text-[9px] text-muted-foreground whitespace-nowrap pt-0.5">
                                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                                                {notification.message}
                                            </p>

                                            {notification.type === 'join' && !notification.read && (
                                                <button
                                                    onClick={() => handleAcceptChallenge(notification)}
                                                    className="mt-2 w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                                >
                                                    <Swords className="w-3 h-3" />
                                                    Accept Challenge
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeNotification(notification.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {!notification.read && (
                                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full" />
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </PopoverContent>
        </Popover>
    );
}
