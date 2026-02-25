import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'join' | 'salam' | 'milestone' | 'challenge' | 'challenge_accepted';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    data?: any;
}

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            addNotification: (noti) => {
                const newNoti: AppNotification = {
                    ...noti,
                    id: Math.random().toString(36).substring(2, 9),
                    timestamp: Date.now(),
                    read: false,
                };
                set((state) => ({
                    notifications: [newNoti, ...state.notifications].slice(0, 50), // Keep last 50
                    unreadCount: state.unreadCount + 1,
                }));
            },
            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1),
                }));
            },
            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },
            removeNotification: (id) => {
                set((state) => {
                    const notiToRemove = state.notifications.find(n => n.id === id);
                    return {
                        notifications: state.notifications.filter((n) => n.id !== id),
                        unreadCount: (!notiToRemove || notiToRemove.read) 
                            ? state.unreadCount 
                            : Math.max(0, state.unreadCount - 1),
                    };
                });
            },
            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },
        }),
        {
            name: 'tasbeeh-notifications',
        }
    )
);
