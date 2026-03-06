'use client';

import { LocalEvent, CATEGORIES, INSTAGRAM_ACCOUNTS } from '@/types/event';
import { formatDateDisplay } from '@/lib/dateUtils';
import { Badge } from '@/components/ui';
import { MapPin, Clock, Instagram, ExternalLink, Trash2 } from 'lucide-react';

interface EventCardProps {
  event: LocalEvent;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const category = CATEGORIES.find((c) => c.value === event.category);
  const account = INSTAGRAM_ACCOUNTS.find((a) => a.handle === event.instagramHandle);
  const venueUrl = event.externalUrl || account?.eventsUrl;

  return (
    <div className="bg-zinc-800 rounded-xl border border-white/10 p-4 hover:bg-zinc-750 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="custom" className={category?.color}>
              {category?.label}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
          </div>

          {venueUrl ? (
            <a
              href={venueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-teal-300 transition-colors mb-1 block"
            >
              {event.title}
            </a>
          ) : (
            <h3 className="font-semibold text-white mb-1">{event.title}</h3>
          )}

          {event.instagramHandle && (
            <p className="text-sm text-zinc-400 mb-1">
              Hosted by <span className="font-medium text-zinc-200">{event.instagramHandle}</span>
            </p>
          )}

          {event.description && (
            <p className="text-sm text-zinc-400 mb-2 line-clamp-2">{event.description}</p>
          )}

          <div className="flex items-center gap-3 text-sm text-zinc-400 flex-wrap">
            <span>{formatDateDisplay(event.date)}</span>
            {event.time && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {event.time}
              </span>
            )}
            {event.venue && <span className="text-zinc-500">@ {event.venue}</span>}
          </div>

          <div className="flex items-center gap-3 mt-3">
            {event.instagramUrl && (
              <a
                href={event.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-pink-400 hover:text-pink-300"
              >
                <Instagram className="h-4 w-4" />
                {event.instagramHandle || 'View post'}
              </a>
            )}
            {venueUrl && (
              <a
                href={venueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 truncate max-w-xs"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                {venueUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-900/30 transition-colors shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
