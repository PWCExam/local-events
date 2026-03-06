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
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {formatMonthYear(currentMonth)}
      </h2>
      <div className="flex items-center gap-1">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
        >
          Today
        </button>
        <button
          onClick={onPrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
