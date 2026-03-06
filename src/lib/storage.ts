import { LocalEvent } from '@/types/event';

const STORAGE_KEY = 'local-events';
const USER_EVENTS_KEY = 'local-events-user';
const DISMISSED_KEY = 'local-events-dismissed';

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

// --- User-added events (separate from scraped) ---

export function getUserEvents(): LocalEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USER_EVENTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUserEvents(events: LocalEvent[]): void {
  localStorage.setItem(USER_EVENTS_KEY, JSON.stringify(events));
}

// --- Dismissed scraped event IDs ---

export function getDismissedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const data = localStorage.getItem(DISMISSED_KEY);
  if (!data) return new Set();
  try {
    return new Set(JSON.parse(data));
  } catch {
    return new Set();
  }
}

export function addDismissedId(id: string): void {
  const ids = getDismissedIds();
  ids.add(id);
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(ids)));
}
