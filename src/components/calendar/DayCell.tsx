'use client';

import { LocalEvent, CATEGORIES } from '@/types/event';
import { isSameDay, isSameMonth, isToday, toDateString } from '@/lib/dateUtils';

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  events: LocalEvent[];
  onClick: (date: Date) => void;
}

export default function DayCell({ day, currentMonth, selectedDate, events, onClick }: DayCellProps) {
  const dateStr = toDateString(day);
  const dayEvents = events.filter((e) => e.date === dateStr);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const today = isToday(day);

  return (
    <button
      onClick={() => onClick(day)}
      className={`
        relative flex flex-col items-start p-2 sm:p-3 min-h-[140px] sm:min-h-[180px] border border-gray-200 transition-colors text-left
        ${!isCurrentMonth ? 'text-gray-300 opacity-40' : 'text-gray-900'}
        ${isSelected ? 'bg-teal-50 ring-2 ring-teal-500' : 'hover:bg-gray-50'}
        ${today && !isSelected ? 'bg-teal-50/50' : ''}
      `}
    >
      <span
        className={`
          text-sm font-medium mb-1
          ${today ? 'bg-teal-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''}
        `}
      >
        {day.getDate()}
      </span>

      {dayEvents.length > 0 && (
        <div className="flex flex-col gap-0.5 w-full overflow-hidden">
          {dayEvents.slice(0, 4).map((event) => {
            const catInfo = CATEGORIES.find((c) => c.value === event.category);
            return (
              <div
                key={event.id}
                className={`text-[11px] sm:text-xs leading-snug px-1.5 py-1 rounded font-medium ${catInfo?.color || 'bg-gray-100 text-gray-600'}`}
              >
                <div>{event.title}</div>
                {event.instagramHandle && (
                  <div className="opacity-60 font-normal">{event.instagramHandle}</div>
                )}
              </div>
            );
          })}
          {dayEvents.length > 4 && (
            <div className="text-[11px] sm:text-xs text-gray-500 font-medium px-1.5 py-0.5">
              +{dayEvents.length - 4} more
            </div>
          )}
        </div>
      )}
    </button>
  );
}
