'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LocalEvent } from '@/types/event';
import { getEvents, saveEvents, getUserEvents, saveUserEvents, getDismissedIds, addDismissedId } from '@/lib/storage';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';
import scrapedEventsData from '@/lib/scrapedEvents.json';

interface ScrapedEventJSON {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  category: string;
  location: string;
  venue?: string;
  externalUrl?: string;
  instagramHandle?: string;
  source: string;
}

// Convert scraped events to LocalEvent format
function scrapedToLocal(scraped: ScrapedEventJSON[]): LocalEvent[] {
  const now = new Date().toISOString();
  return scraped.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description || '',
    date: s.date,
    time: s.time || undefined,
    category: (s.category || 'art') as LocalEvent['category'],
    location: (s.location || 'Ventura') as LocalEvent['location'],
    venue: s.venue || undefined,
    externalUrl: s.externalUrl || undefined,
    instagramHandle: s.instagramHandle || undefined,
    createdAt: now,
    updatedAt: now,
  }));
}

export function useEvents() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const DATA_VERSION = '10';
    const VERSION_KEY = 'local-events-data-version';
    const storedVersion = localStorage.getItem(VERSION_KEY);

    // Load sample events (hardcoded baseline)
    let loaded = getEvents();
    if (loaded.length === 0 || storedVersion !== DATA_VERSION) {
      loaded = SAMPLE_EVENTS;
      saveEvents(loaded);
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }

    // Merge scraped events (from JSON file, committed by scraper)
    const scraped = scrapedToLocal(scrapedEventsData as ScrapedEventJSON[]);
    const dismissed = getDismissedIds();
    const existingIds = new Set(loaded.map((e) => e.id));
    const newScraped = scraped.filter((e) => !existingIds.has(e.id) && !dismissed.has(e.id));

    // Merge user-added events from localStorage
    const userEvents = getUserEvents();
    const allIds = new Set([...existingIds, ...newScraped.map((e) => e.id)]);
    const newUserEvents = userEvents.filter((e) => !allIds.has(e.id));

    const merged = [...loaded, ...newScraped, ...newUserEvents];
    setEvents(merged);
    setIsLoaded(true);
  }, []);

  const addEvent = useCallback(
    (data: Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newEvent: LocalEvent = {
        ...data,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      setEvents((prev) => {
        const updated = [...prev, newEvent];
        saveEvents(updated);
        // Also save to user events for persistence across version resets
        const userEvents = getUserEvents();
        saveUserEvents([...userEvents, newEvent]);
        return updated;
      });
      return newEvent;
    },
    []
  );

  const updateEvent = useCallback((id: string, data: Partial<LocalEvent>) => {
    setEvents((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      );
      saveEvents(updated);
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    // If it's a scraped event, add to dismissed so it doesn't reappear
    addDismissedId(id);
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEvents(updated);
      // Also remove from user events if present
      const userEvents = getUserEvents().filter((e) => e.id !== id);
      saveUserEvents(userEvents);
      return updated;
    });
  }, []);

  const getEventsForDate = useCallback(
    (dateStr: string) => {
      return events.filter((e) => e.date === dateStr);
    },
    [events]
  );

  return { events, isLoaded, addEvent, updateEvent, deleteEvent, getEventsForDate };
}
