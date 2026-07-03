import type { SessionRecord } from '@/store/tasbeehStore';

export interface SmartSuggestion {
  time: string;      // "HH:MM"
  label: string;     // e.g. "Morning Dhikr"
  reason: string;    // e.g. "You're most active around this time"
  confidence: number; // 0–1
}

interface Reminder {
  time: string;
  enabled: boolean;
}

/** Islamic-default fallback suggestions when not enough session data exists */
const ISLAMIC_DEFAULTS: SmartSuggestion[] = [
  { time: '06:15', label: 'Fajr Adhkar', reason: 'Recommended post-Fajr time', confidence: 0.6 },
  { time: '13:15', label: 'Dhuhr Adhkar', reason: 'Recommended post-Dhuhr time', confidence: 0.6 },
  { time: '18:30', label: 'Evening Adhkar', reason: 'Recommended post-Maghrib time', confidence: 0.6 },
  { time: '21:00', label: 'Night Dhikr', reason: 'Recommended before sleep', confidence: 0.6 },
];

function hourToLabel(hour: number): string {
  if (hour >= 4 && hour <= 8) return 'Morning Dhikr';
  if (hour >= 9 && hour <= 11) return 'Mid-Morning Dhikr';
  if (hour >= 12 && hour <= 14) return 'Dhuhr Dhikr';
  if (hour >= 15 && hour <= 16) return 'Asr Dhikr';
  if (hour >= 17 && hour <= 19) return 'Evening Adhkar';
  if (hour >= 20 && hour <= 23) return 'Night Dhikr';
  return 'Dhikr Reminder';
}

function roundToHalfHour(hour: number, minute: number): string {
  const roundedMinute = minute < 30 ? 0 : 30;
  return `${String(hour).padStart(2, '0')}:${String(roundedMinute).padStart(2, '0')}`;
}

function hasNearbyReminder(time: string, reminders: Reminder[]): boolean {
  const [h, m] = time.split(':').map(Number);
  const totalMin = h * 60 + m;
  return reminders.some((r) => {
    if (!r.enabled) return false;
    const [rh, rm] = r.time.split(':').map(Number);
    const rTotal = rh * 60 + rm;
    return Math.abs(rTotal - totalMin) <= 30;
  });
}

/**
 * Analyses the last 30 days of session history to suggest optimal reminder times.
 * Returns up to 3 personalised suggestions, filtered to avoid existing reminder slots.
 */
export function getSmartSuggestions(
  sessions: SessionRecord[],
  existingReminders: Reminder[]
): SmartSuggestion[] {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = sessions.filter((s) => s.timestamp >= thirtyDaysAgo);

  if (recent.length < 3) {
    // Not enough data — return Islamic defaults filtered against existing reminders
    return ISLAMIC_DEFAULTS.filter((s) => !hasNearbyReminder(s.time, existingReminders)).slice(0, 3);
  }

  // Bucket sessions by hour-of-day
  const hourBuckets: Record<number, number> = {};
  for (const session of recent) {
    const hour = new Date(session.timestamp).getHours();
    hourBuckets[hour] = (hourBuckets[hour] || 0) + 1;
  }

  // Sort hours by frequency (most active first)
  const sortedHours = Object.entries(hourBuckets)
    .map(([h, count]) => ({ hour: parseInt(h), count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = sortedHours[0]?.count || 1;
  const suggestions: SmartSuggestion[] = [];

  for (const { hour, count } of sortedHours) {
    if (suggestions.length >= 3) break;

    const time = roundToHalfHour(hour, 0);
    if (hasNearbyReminder(time, existingReminders)) continue;

    // Avoid duplicating very similar times already in suggestions
    const isDuplicate = suggestions.some((s) => {
      const [sh] = s.time.split(':').map(Number);
      return Math.abs(sh - hour) < 1;
    });
    if (isDuplicate) continue;

    suggestions.push({
      time,
      label: hourToLabel(hour),
      reason: `You usually do dhikr around ${hour > 12 ? hour - 12 : hour || 12}${hour >= 12 ? 'pm' : 'am'}`,
      confidence: Math.min(count / maxCount, 1),
    });
  }

  // If we still don't have 3, fill from defaults
  if (suggestions.length < 3) {
    for (const def of ISLAMIC_DEFAULTS) {
      if (suggestions.length >= 3) break;
      if (!hasNearbyReminder(def.time, existingReminders)) {
        const isDuplicate = suggestions.some((s) => {
          const [sh] = s.time.split(':').map(Number);
          const [dh] = def.time.split(':').map(Number);
          return Math.abs(sh - dh) < 1;
        });
        if (!isDuplicate) suggestions.push(def);
      }
    }
  }

  return suggestions;
}
