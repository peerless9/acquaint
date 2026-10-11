import { colors } from '../theme';

export type DatePlan = {
  /** Days from today and local start time; turned into a real Date at runtime. */
  inDays: number;
  hour: number;
  minute: number;
  durationMinutes: number;
  venue: string;
  address: string;
  plan: string;
};

export type Match = {
  id: string;
  photo: string;
  tint: string;
  date: DatePlan;
};

// Photos only: acquaint never shows names, ages or bios before the date.
export const matches: Match[] = [
  {
    id: 'm1',
    photo: 'https://i.pravatar.cc/800?img=47',
    tint: colors.photoTints[0],
    date: {
      inDays: 3,
      hour: 19,
      minute: 30,
      durationMinutes: 120,
      venue: 'Little Fern Wine Bar',
      address: '31 Wren St, San Francisco',
      plan: 'A glass of wine, then dessert next door',
    },
  },
  {
    id: 'm2',
    photo: 'https://i.pravatar.cc/800?img=12',
    tint: colors.photoTints[1],
    date: {
      inDays: 5,
      hour: 10,
      minute: 0,
      durationMinutes: 90,
      venue: 'Juniper Coffee House',
      address: '88 Alder Ave, San Francisco',
      plan: 'Coffee, then a walk through the park',
    },
  },
  {
    id: 'm3',
    photo: 'https://i.pravatar.cc/800?img=32',
    tint: colors.photoTints[2],
    date: {
      inDays: 4,
      hour: 18,
      minute: 0,
      durationMinutes: 120,
      venue: 'The Boulder Room',
      address: '1420 Harbor Way, San Francisco',
      plan: 'Beginner bouldering, then tacos',
    },
  },
];

export function getMatch(id: string | null) {
  return matches.find((m) => m.id === id) ?? null;
}

export function getDateTimes(plan: DatePlan, now = new Date()) {
  const start = new Date(now);
  start.setDate(start.getDate() + plan.inDays);
  start.setHours(plan.hour, plan.minute, 0, 0);
  const end = new Date(start.getTime() + plan.durationMinutes * 60_000);
  return { start, end };
}

export function formatWhen(start: Date) {
  const day = start.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}
