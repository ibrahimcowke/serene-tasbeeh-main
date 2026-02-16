
export interface RoutineStep {
    id: string; // Unique ID for the step
    dhikrId: string; // ID of the Dhikr to perform (must match IDs in quotes.ts/store defaultDhikrs)
    target: number; // Target count for this step
    description?: string; // Optional description for this step (e.g. "Say this 3 times")
}

export interface Routine {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or similar identifier
    steps: RoutineStep[];
    color?: string; // Optional color theme for the routine
}

export const defaultRoutines: Routine[] = [
    {
        id: 'morning_adhkar',
        title: 'Morning Adhkar',
        description: 'Start your day with remembrance and protection.',
        icon: 'Sun',
        color: 'from-orange-400 to-amber-200',
        steps: [
            { id: 'step_1', dhikrId: 'subhanallah', target: 33, description: 'SubhanAllah x33' },
            { id: 'step_2', dhikrId: 'alhamdulillah', target: 33, description: 'Alhamdulillah x33' },
            { id: 'step_3', dhikrId: 'allahuakbar', target: 33, description: 'Allahu Akbar x33' },
            { id: 'step_4', dhikrId: 'lailaha', target: 1, description: 'La ilaha illallah x1' },
            { id: 'step_5', dhikrId: 'ayat_alkursi', target: 1, description: 'Ayat al-Kursi x1 (Recite)' }, // Need to ensure this ID exists or handle text-only steps
        ]
    },
    {
        id: 'evening_adhkar',
        title: 'Evening Adhkar',
        description: 'End your day with gratitude and peace.',
        icon: 'Moon',
        color: 'from-indigo-500 to-purple-400',
        steps: [
            { id: 'step_1', dhikrId: 'subhanallah', target: 33, description: 'SubhanAllah x33' },
            { id: 'step_2', dhikrId: 'alhamdulillah', target: 33, description: 'Alhamdulillah x33' },
            { id: 'step_3', dhikrId: 'allahuakbar', target: 34, description: 'Allahu Akbar x34' },
            { id: 'step_4', dhikrId: 'ayat_alkursi', target: 1, description: 'Ayat al-Kursi x1' },
             { id: 'step_5', dhikrId: '3_quls', target: 3, description: 'Recite the 3 Quls x3' },
        ]
    },
    {
        id: 'after_salah',
        title: 'After Salah',
        description: 'Recommended Tasbeeh after fard prayers.',
        icon: 'PrayerRug', // Placeholder
        color: 'from-emerald-500 to-teal-400',
        steps: [
            { id: 'step_1', dhikrId: 'subhanallah', target: 33, description: 'SubhanAllah' },
            { id: 'step_2', dhikrId: 'alhamdulillah', target: 33, description: 'Alhamdulillah' },
            { id: 'step_3', dhikrId: 'allahuakbar', target: 33, description: 'Allahu Akbar' },
            { id: 'step_4', dhikrId: 'lailaha', target: 1, description: 'Final Du\'a' },
        ]
    }
];
