import * as Calendar from 'expo-calendar/legacy';

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  location: string;
  notes: string;
};

/** Opens the system "New Event" sheet. Works in Expo Go and needs no calendar permission. Resolves true if saved. */
export async function addToCalendar(event: CalendarEvent) {
  const result = await Calendar.createEventInCalendarAsync({
    title: event.title,
    startDate: event.start,
    endDate: event.end,
    location: event.location,
    notes: event.notes,
  });
  return result.action === 'saved' || result.action === 'done';
}
