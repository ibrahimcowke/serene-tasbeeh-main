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
