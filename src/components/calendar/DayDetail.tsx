'use client';

import { LocalEvent } from '@/types/event';
import EventCard from '@/components/events/EventCard';
import { CalendarOff } from 'lucide-react';

interface DayDetailProps {
  date: Date;
  events: LocalEvent[];
  onDelete: (id: string) => void;
}

export default function DayDetail({ date: _date, events, onDelete }: DayDetailProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarOff className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
        <p className="text-sm text-zinc-500">No events this day</p>
      </div>
    );
  }

  return (
    <div>
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} onDelete={onDelete} />
      ))}
    </div>
  );
}
