'use client';

import { Waves } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'events', label: 'Events' },
  { id: 'add', label: 'Add Event' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6">
          <div className="flex items-center gap-4">
            <Waves className="h-12 w-12 text-teal-200" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">Ventura and Santa Barbara Event Calendar</h1>
              <span className="text-4xl sm:text-5xl font-bold text-zinc-300 block mt-1">ベンチュラ・サンタバーバラ</span>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-teal-200 text-white'
                    : 'border-transparent text-teal-300 hover:text-white hover:border-teal-400'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
