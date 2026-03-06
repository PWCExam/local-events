import { LocalEvent } from '@/types/event';

const STORAGE_KEY = 'local-events';

export function getEvents(): LocalEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveEvents(events: LocalEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event: LocalEvent): LocalEvent[] {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
  return events;
}

export function updateEvent(updated: LocalEvent): LocalEvent[] {
  const events = getEvents().map(e => e.id === updated.id ? updated : e);
  saveEvents(events);
  return events;
}

export function deleteEvent(id: string): LocalEvent[] {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
  return events;
}
