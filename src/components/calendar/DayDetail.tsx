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
        <CalendarOff className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No events this day</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}
