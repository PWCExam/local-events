'use client';

import { useState, useMemo } from 'react';
import { LocalEvent, EventCategory, EventLocation } from '@/types/event';
import { parseISO, isBefore, startOfDay } from '@/lib/dateUtils';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import { CalendarOff } from 'lucide-react';

interface EventListProps {
  events: LocalEvent[];
  onDelete: (id: string) => void;
}

export default function EventList({ events, onDelete }: EventListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<EventLocation | 'all'>('all');

  const filteredEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return events
      .filter((e) => {
        if (isBefore(parseISO(e.date), today)) return false;
        if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
        if (locationFilter !== 'all' && e.location !== locationFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.venue?.toLowerCase().includes(q) ||
            e.instagramHandle?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, search, categoryFilter, locationFilter]);

  return (
    <div className="space-y-4 bg-zinc-900 rounded-xl border border-white/10 shadow-lg p-4 sm:p-6">
      <EventFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
      />

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarOff className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No upcoming events</p>
          <p className="text-gray-400 text-sm mt-1">Add events from the Add tab</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
