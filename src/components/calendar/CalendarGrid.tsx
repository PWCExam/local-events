'use client';

import { useState, useCallback } from 'react';
import { LocalEvent } from '@/types/event';
import { getCalendarDays, addMonths, subMonths, toDateString, format, formatMonthYear } from '@/lib/dateUtils';
import { Modal } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarHeader from './CalendarHeader';
import DayCell from './DayCell';
import DayDetail from './DayDetail';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarGridProps {
  events: LocalEvent[];
  onDelete: (id: string) => void;
}

export default function CalendarGrid({ events, onDelete }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getCalendarDays(currentMonth);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const selectedDateEvents = selectedDate
    ? events.filter((e) => e.date === toDateString(selectedDate))
    : [];

  return (
    <div className="bg-zinc-900 rounded-xl border border-white/5 p-4 sm:p-6">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-zinc-300 uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, i) => (
          <DayCell
            key={i}
            day={day}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            events={events}
            onClick={handleDayClick}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <button
          onClick={handlePrevMonth}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {formatMonthYear(subMonths(currentMonth, 1))}
        </button>
        <button
          onClick={handleToday}
          className="px-3 py-1.5 text-sm font-medium text-teal-400 hover:text-teal-300 rounded-lg transition-colors"
        >
          Today
        </button>
        <button
          onClick={handleNextMonth}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors"
        >
          {formatMonthYear(addMonths(currentMonth, 1))}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Modal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? format(selectedDate, 'EEEE, MMMM d') : ''}
        size="lg"
      >
        {selectedDate && (
          <DayDetail date={selectedDate} events={selectedDateEvents} onDelete={onDelete} />
        )}
      </Modal>
    </div>
  );
}
