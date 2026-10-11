import type { CalendarEvent } from './addToCalendar';

export type { CalendarEvent };

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** Browsers have no calendar sheet, so download an .ics file the OS calendar can open. */
export async function addToCalendar(event: CalendarEvent) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//acquaint//EN',
    'BEGIN:VEVENT',
    `UID:${stamp(event.start)}@acquaint`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.location)}`,
    `DESCRIPTION:${escape(event.notes)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'acquaint-date.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
