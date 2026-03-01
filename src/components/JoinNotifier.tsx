import { useEffect, useRef } from 'react';
import { database } from '@/lib/firebase';
import { ref, onChildAdded, serverTimestamp, set, onValue } from 'firebase/database';
import { toast } from 'sonner';
import { Users, Swords } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMuslimAvatarUrl } from '@/lib/avatarUtils';
export function JoinNotifier() {
    const isFirstLoad = useRef(true);
    const myId = useRef<string | null>(localStorage.getItem('visitor_device_id'));
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        const presenceRef = ref(database, 'presence/visitors');

        let initialDataLoaded = false;

        // Listen once to establish the initial state and skip legacy notifications
        onValue(presenceRef, () => {
            initialDataLoaded = true;
        }, { onlyOnce: true });

        const unsubscribe = onChildAdded(presenceRef, (snapshot) => {
            if (!initialDataLoaded) return;

            const user = snapshot.val();
            // Don't notify if it's me
            if (user.user_id === myId.current) return;

            // Trigger join notification logic removed as per user request
            /*
            addNotification({
                type: 'join',
                title: 'New User Joined!',
                message: 'A brother/sister just entered the community. Want to challenge them?',
                data: { user_id: snapshot.key }
            });

            toast.custom((t) => (
                <div className="bg-card/90 backdrop-blur-2xl border border-primary/20 p-4 rounded-3xl shadow-2xl flex flex-col gap-3 min-w-[300px] animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-md">
                            {(user.avatar_url || getMuslimAvatarUrl(user.user_id)) ? (
                                <AvatarImage src={user.avatar_url || getMuslimAvatarUrl(user.user_id)} />
                            ) : (
                                <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                                    {user.email?.charAt(0).toUpperCase() || '?'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">New User Joined!</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">A brother/sister just entered the app</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Start a 100-dhikr community sprint with them to earn bonus rewards.
                    </p>

                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={() => {
                                // Accept Challenge Logic
                                const pulseRef = ref(database, 'events/global/pulse');
                                set(pulseRef, {
                                    type: 'challenge_accepted',
                                    sender_id: myId.current,
                                    target_id: user.user_id,
                                    timestamp: serverTimestamp()
                                });
                                toast.dismiss(t);
                                toast.success("Challenge started! Go for +100 dhikrs.");
                            }}
                            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Swords className="w-3.5 h-3.5" />
                            Accept Challenge
                        </button>
                        <button
                            onClick={() => toast.dismiss(t)}
                            className="px-4 py-2 rounded-xl bg-secondary/50 text-muted-foreground text-[11px] font-bold hover:bg-secondary transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
            ), {
                duration: 8000,
                position: 'bottom-right'
            });
            */

            // Trigger global "Join" pulse
            const pulseRef = ref(database, 'events/global/pulse');
            set(pulseRef, {
                type: 'user_joined',
                timestamp: serverTimestamp()
            });
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null; // This component handles side effects only
}
