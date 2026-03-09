import crypto from 'crypto';
import { format, parse, isValid, addDays, isBefore, startOfDay } from 'date-fns';
import type { ScrapedEvent } from './types.js';

/**
 * Generate a deterministic ID from event title + date + venue.
 * This ensures dismissed events stay dismissed across scrape runs.
 */
export function generateEventId(title: string, date: string, venue?: string): string {
  const raw = `${title.toLowerCase().trim()}|${date}|${(venue || '').toLowerCase().trim()}`;
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

/**
 * Try to parse a date string into YYYY-MM-DD format.
 * Handles various common formats from venue websites.
 */
export function parseDate(dateStr: string): string | null {
  const cleaned = dateStr.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;

  // ISO datetime
  if (/^\d{4}-\d{2}-\d{2}T/.test(cleaned)) return cleaned.slice(0, 10);

  // Common formats to try
  const formats = [
    'MMMM d, yyyy',
    'MMM d, yyyy',
    'MM/dd/yyyy',
    'M/d/yyyy',
    'MMMM d',
    'MMM d',
    'yyyy/MM/dd',
  ];

  for (const fmt of formats) {
    try {
      const parsed = parse(cleaned, fmt, new Date());
      if (isValid(parsed)) {
        // If no year was in the format, use current year (or next if date has passed)
        if (!fmt.includes('yyyy')) {
          const now = new Date();
          let result = new Date(now.getFullYear(), parsed.getMonth(), parsed.getDate());
          if (isBefore(result, startOfDay(now))) {
            result = new Date(now.getFullYear() + 1, parsed.getMonth(), parsed.getDate());
          }
        }
        return format(parsed, 'yyyy-MM-dd');
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Parse a time string into a normalized "h:mm AM/PM" format.
 */
export function parseTime(timeStr: string): string | null {
  const cleaned = timeStr.trim().toUpperCase();

  // Already formatted like "7:00 PM"
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    const hour = parseInt(match[1]);
    const min = match[2];
    const period = match[3].toUpperCase();
    return `${hour}:${min} ${period}`;
  }

  // 24-hour format like "19:00"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let hour = parseInt(match24[1]);
    const min = match24[2];
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${min} ${period}`;
  }

  return null;
}

/**
 * Infer location from venue name or other context.
 */
export function inferLocation(venue: string): 'Ventura' | 'Santa Barbara' | 'Ojai' {
  const lower = venue.toLowerCase();
  if (lower.includes('ojai') || lower.includes('deer lodge') || lower.includes('fig mountain') || lower.includes('fig mtn')) return 'Ojai';
  if (lower.includes('santa barbara') || lower.includes('sb ') || lower.includes('s.b.') || lower.includes('sbbowl') || lower.includes('bellringer') || lower.includes('seaward')) return 'Santa Barbara';
  return 'Ventura';
}

/**
 * Infer category from venue/event context.
 */
export function inferCategory(venue: string, title: string): 'surf' | 'beer' | 'art' {
  const lower = `${venue} ${title}`.toLowerCase();
  if (lower.includes('brew') || lower.includes('beer') || lower.includes('topa') || lower.includes('madewest') || lower.includes('leashless') || lower.includes('bellringer') || lower.includes('seaward') || lower.includes('fig mtn') || lower.includes('fig mountain')) return 'beer';
  if (lower.includes('surf') || lower.includes('ocean') || lower.includes('dive') || lower.includes('paddle')) return 'surf';
  if (lower.includes('hike') || lower.includes('ovlc') || lower.includes('trail') || lower.includes('conservancy')) return 'art';
  if (lower.includes('music') || lower.includes('concert') || lower.includes('live') || lower.includes('bowl') || lower.includes('hall') || lower.includes('lodge')) return 'art';
  return 'art';
}

/**
 * Filter out events that don't match our theme: surf, beer, music, nature.
 * Removes business meetups, health workshops, career fairs, kids classes,
 * religious events, real estate, etc.
 */
const OFF_TOPIC_PATTERNS = [
  // Business / professional
  /\bbusiness\b/i, /\bnetworking\b/i, /\bcareer\b/i, /\bhiring\b/i,
  /\bjob fair\b/i, /\breal estate\b/i, /\bmarketing\b/i, /\bsales\s+(train|summit|event)/i,
  /\bentrepreneur/i, /\bstartup\b/i, /\binvestment\b/i, /\bfinance\b/i,
  /\btax\b/i, /\blegal\b/i, /\bresume\b/i, /\bleadership\b/i,
  /\bcoach(ing)?\b/i, /\bseminar\b/i, /\bpitchfest/i, /\binnovation awards/i,
  /\bsenior expo\b/i, /\bsponsorship\b/i, /\bdonor\b/i,
  /\bsoft skills\b/i, /\bmanagement\s+train/i, /\bautomation workshop/i,
  /\bhow i built this/i, /\bprotect your legacy/i, /\bemerging professionals/i,

  // Health / wellness / medical
  /\bgut[\s-](health|endo|reset)/i, /\bperimenopausi/i, /\bdental\b/i,
  /\bskin\s*care\b/i, /\bweight\s*loss/i, /\bcounseling\b/i,
  /\bsupport\s+group\b/i, /\bgrief\b/i, /\btherapy\b/i,
  /\bfirst\s+aid\b/i, /\bcpr\b/i, /\bk9\s+emergency/i,
  /\bstrengthening parent/i, /\bmanaging emotions/i,
  /\bflower essence/i, /\bbirthing\b/i,

  // Yoga / meditation / spiritual (keep sound bath / gong at music venues)
  /\byoga\b/i, /\bpilates\b/i, /\bmeditation\b/i,
  /\bkundalini\b/i, /\breiki\b/i, /\bchakra\b/i,
  /\bpsychic\b/i, /\btarot\b/i, /\bastrology\b/i,
  /\bprayer\b/i, /\bbible\b/i, /\bchurch\b/i,
  /\bspiritual\b/i, /\bcacao circle/i, /\bbreathwork\b/i,

  // Kids / family specific
  /\bkids\b.*\bclass/i, /\bages\s+\d+\+?\b/i, /\bpre-junior/i,
  /\bhello kitty\b/i, /\bslime kitchen\b/i,
  /\bparenting\b/i, /\bmother-daughter\b/i,

  // Education / training (non-music)
  /\btraining\b.*\b(installer|enphase|career|soft skill)/i,
  /\binstaller training\b/i, /\bcertification\b/i,
  /\bcómo planificar/i, /\brendir más/i,
  /\bconversatorios de carreras/i, /\bentrenamiento alpha/i,
  /\bmasterclass.*futuro/i, /\bencuentro exclusivo/i,

  // Misc off-topic
  /\bboutique\b.*\bvendor/i, /\bscavenger hunt\b/i,
  /\bbingo\b/i, /\bcasino\b/i, /\bbook\s+(club|fair|talk)\b/i,
  /\bknitting\b/i, /\bsewing\b/i,
  /\bwedding\b/i, /\bbridal\b/i,
  /\bdivorce\b/i, /\bpotluck\b/i,
  /\bluncheon\b.*\bsponsorship/i, /\bladies luncheon/i,
  /\bparkinson/i, /\bmoving day\b/i,

  // Calendar site boilerplate / spam
  /\bemail.*@.*to\s+(advertise|learn)/i, /\bbecome a sponsor/i,
  /\b805calendar\.com\b/i, /\bemail your event/i,
];

/**
 * Sources whose events are curated by the venue itself (music venues,
 * breweries, nature orgs) — we trust these are on-topic.
 */
const TRUSTED_SOURCES = new Set([
  'ventura-music-hall', 'sbbowl', 'deer-lodge', 'leashless',
  'island-brewing', 'bright-spark', 'ventura-raceway', 'ovlc',
  'bandsintown', 'third-window',
]);

export function isOnTopic(event: ScrapedEvent): boolean {
  // Trust venue-specific scrapers — they only list their own events
  if (TRUSTED_SOURCES.has(event.source)) return true;
  // Topa Topa & MadeWest are beer venues
  if (event.source.startsWith('eventcalendarapp-')) return true;

  const text = `${event.title} ${event.description}`.toLowerCase();

  // Check against off-topic patterns
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(`${event.title} ${event.description}`)) return false;
  }

  return true;
}

/**
 * Deduplicate events by their deterministic ID.
 */
export function dedupeEvents(events: ScrapedEvent[]): ScrapedEvent[] {
  const seen = new Map<string, ScrapedEvent>();
  for (const event of events) {
    if (!seen.has(event.id)) {
      seen.set(event.id, event);
    }
  }
  return Array.from(seen.values());
}

/**
 * Filter out events that have already passed.
 */
export function filterFutureEvents(events: ScrapedEvent[]): ScrapedEvent[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return events.filter((e) => e.date >= today);
}
