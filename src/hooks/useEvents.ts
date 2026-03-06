'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LocalEvent } from '@/types/event';
import { getEvents, saveEvents } from '@/lib/storage';
import { SAMPLE_EVENTS } from '@/lib/sampleEvents';

export function useEvents() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const DATA_VERSION = '3';
    const VERSION_KEY = 'local-events-data-version';
    const storedVersion = localStorage.getItem(VERSION_KEY);
    let loaded = getEvents();
    if (loaded.length === 0 || storedVersion !== DATA_VERSION) {
      loaded = SAMPLE_EVENTS;
      saveEvents(loaded);
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }
    setEvents(loaded);
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
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEvents(updated);
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
