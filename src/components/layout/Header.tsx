'use client';

import { Waves } from 'lucide-react';
import { motion } from 'framer-motion';

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

        <nav className="flex gap-1 -mb-px relative">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-4 py-2.5 text-sm font-medium transition-colors
                ${activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-300"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
