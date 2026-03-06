'use client';

import { EventCategory, EventLocation, CATEGORIES, LOCATIONS } from '@/types/event';
import { Search, X } from 'lucide-react';

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: EventCategory | 'all';
  onCategoryChange: (value: EventCategory | 'all') => void;
  locationFilter: EventLocation | 'all';
  onLocationChange: (value: EventLocation | 'all') => void;
}

export default function EventFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  locationFilter,
  onLocationChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/10 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            categoryFilter === 'all'
              ? 'border-white/30 text-white'
              : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              categoryFilter === cat.value
                ? 'border-white/30 text-white'
                : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onLocationChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            locationFilter === 'all'
              ? 'border-white/30 text-white'
              : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
          }`}
        >
          All Locations
        </button>
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => onLocationChange(loc)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              locationFilter === loc
                ? 'border-white/30 text-white'
                : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}
