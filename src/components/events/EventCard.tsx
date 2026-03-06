'use client';

import { LocalEvent, CATEGORIES, INSTAGRAM_ACCOUNTS } from '@/types/event';
import { formatDateDisplay } from '@/lib/dateUtils';
import { Instagram, ExternalLink, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: LocalEvent;
  index?: number;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, index = 0, onDelete }: EventCardProps) {
  const category = CATEGORIES.find((c) => c.value === event.category);
  const account = INSTAGRAM_ACCOUNTS.find((a) => a.handle === event.instagramHandle);
  const venueUrl = event.externalUrl || account?.eventsUrl;
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      className="group flex items-start gap-4 sm:gap-6 py-4 border-b border-white/5 last:border-0"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-2xl font-bold text-zinc-700 group-hover:text-teal-400 transition-colors pt-0.5 shrink-0 w-8 sm:w-10 tabular-nums">
        {num}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {venueUrl ? (
              <a
                href={venueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-teal-300 transition-colors block truncate"
              >
                {event.title}
              </a>
            ) : (
              <h3 className="font-semibold text-white truncate">{event.title}</h3>
            )}

            <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500 flex-wrap">
              {event.venue && <span>{event.venue}</span>}
              {event.venue && <span className="text-zinc-700">/</span>}
              <span>{formatDateDisplay(event.date)}</span>
              {event.time && (
                <>
                  <span className="text-zinc-700">/</span>
                  <span>{event.time}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border border-white/10 ${
                category?.value === 'surf' ? 'text-blue-400' :
                category?.value === 'beer' ? 'text-green-400' :
                'text-teal-400'
              }`}>
                {category?.label}
              </span>
              <span className="text-xs text-zinc-600">{event.location}</span>

              {event.instagramUrl && (
                <a
                  href={event.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-pink-400/70 hover:text-pink-300 transition-colors"
                >
                  <Instagram className="h-3 w-3" />
                  {event.instagramHandle || 'Post'}
                </a>
              )}
              {venueUrl && (
                <a
                  href={venueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-teal-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-900/20 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
