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
        relative flex flex-col items-start p-2 sm:p-3 min-h-[240px] sm:min-h-[360px] border border-white/15 transition-colors text-left overflow-hidden
        ${!isCurrentMonth ? 'text-zinc-700 opacity-30' : 'text-white'}
        ${isSelected ? 'bg-teal-900/20 ring-1 ring-teal-500/50' : 'hover:bg-white/5'}
        ${today && !isSelected ? 'bg-white/5' : ''}
      `}
    >
      <span
        className={`
          text-sm sm:text-base font-bold mb-2 shrink-0
          ${today ? 'bg-teal-400 text-black w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center' : ''}
        `}
      >
        {day.getDate()}
      </span>

      {dayEvents.length > 0 && (
        <div className="flex flex-col gap-1.5 w-full overflow-hidden flex-1">
          {dayEvents.slice(0, 10).map((event) => {
            const catInfo = CATEGORIES.find((c) => c.value === event.category);
            return (
              <div
                key={event.id}
                className="flex items-start gap-1.5 min-w-0"
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[5px] ${catInfo?.dotColor || 'bg-zinc-500'}`} />
                <div className="min-w-0 leading-tight">
                  <span className="text-xs sm:text-sm text-white line-clamp-2">
                    {event.title}
                  </span>
                  {event.time && (
                    <span className="text-[11px] text-zinc-300 block">{event.time}</span>
                  )}
                </div>
              </div>
            );
          })}
          {dayEvents.length > 10 && (
            <span className="text-xs text-zinc-300 pl-3">
              +{dayEvents.length - 10} more
            </span>
          )}
        </div>
      )}
    </button>
  );
}
