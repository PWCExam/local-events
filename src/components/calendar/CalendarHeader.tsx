'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear } from '@/lib/dateUtils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-500">
          {formatMonthYear(currentMonth)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm font-medium text-teal-400 hover:text-teal-300 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-white tracking-widest uppercase text-center mt-2">
        805 Surf, Beer, Music, Nature
      </p>
    </div>
  );
}
