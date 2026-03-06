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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/10 bg-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            categoryFilter === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === cat.value ? cat.color : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onLocationChange('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            locationFilter === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          All Locations
        </button>
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => onLocationChange(loc)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              locationFilter === loc
                ? 'bg-teal-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}
