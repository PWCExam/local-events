'use client';

import { useState, useMemo, useRef } from 'react';
import { LocalEvent, EventCategory, EventLocation } from '@/types/event';
import { parseISO, isBefore, startOfDay, format } from '@/lib/dateUtils';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { CalendarOff } from 'lucide-react';

interface EventListProps {
  events: LocalEvent[];
  onDelete: (id: string) => void;
}

interface MonthGroup {
  label: string;
  events: LocalEvent[];
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

  // Group by month
  const monthGroups = useMemo<MonthGroup[]>(() => {
    const groups = new Map<string, LocalEvent[]>();
    for (const event of filteredEvents) {
      const key = event.date.slice(0, 7); // YYYY-MM
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(event);
    }
    return Array.from(groups.entries()).map(([key, evts]) => ({
      label: format(parseISO(key + '-01'), 'MMMM yyyy'),
      events: evts,
    }));
  }, [filteredEvents]);

  let globalIndex = 0;

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 sm:p-6">
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <CalendarOff className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No upcoming events</p>
          <p className="text-zinc-600 text-sm mt-1">Add events from the Add tab</p>
        </div>
      ) : (
        <div className="space-y-8">
          {monthGroups.map((group, groupIdx) => (
            <AnimatedSection key={group.label} delay={groupIdx * 0.05}>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-2 tracking-tight">
                {group.label}
              </h2>
              <div className="border-t border-white/5">
                {group.events.map((event) => {
                  const idx = globalIndex++;
                  return (
                    <EventCard key={event.id} event={event} index={idx} onDelete={onDelete} />
                  );
                })}
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
