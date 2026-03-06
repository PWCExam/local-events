'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'local-events-visitor-count';

function getCount(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementCount(): number {
  const current = getCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(current));
  return current;
}

function OdometerDigit({ digit, delay }: { digit: string; delay: number }) {
  const [displayed, setDisplayed] = useState('0');
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRolling(true);
      const rollTimer = setTimeout(() => {
        setDisplayed(digit);
        setRolling(false);
      }, 400);
      return () => clearTimeout(rollTimer);
    }, delay);
    return () => clearTimeout(timer);
  }, [digit, delay]);

  return (
    <div className="relative w-6 h-9 bg-zinc-900 border border-white/10 rounded overflow-hidden">
      <div
        className={`absolute inset-0 flex items-center justify-center text-lg font-bold text-teal-400 tabular-nums transition-transform duration-400 ${
          rolling ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {displayed}
      </div>
      {/* Center line for odometer effect */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
    </div>
  );
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sessionKey = 'local-events-session';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      setCount(incrementCount());
    } else {
      setCount(getCount());
    }
  }, []);

  if (count === null) return null;

  const digits = String(count).padStart(6, '0').split('');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3">
        <span className="text-xs text-zinc-500 uppercase tracking-widest">Visitors</span>
        <div className="flex gap-0.5">
          {digits.map((d, i) => (
            <OdometerDigit key={i} digit={d} delay={i * 80} />
          ))}
        </div>
      </div>
    </footer>
  );
}
