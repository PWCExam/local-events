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
          return format(result, 'yyyy-MM-dd');
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
  /\bsymposium\b/i, /\bconference\b/i, /\bsummit\b/i,
  /\bsave democracy\b/i, /\bpolitical\b/i,

  // Health / wellness / medical
  /\bgut[\s-](health|endo|reset)/i, /\bperimenopausi/i, /\bdental\b/i,
  /\bskin\s*care\b/i, /\bweight\s*loss/i, /\bcounseling\b/i,
  /\bsupport\s+group\b/i, /\bgrief\b/i, /\btherapy\b/i,
  /\bfirst\s+aid\b/i, /\bcpr\b/i, /\bk9\s+emergency/i,
  /\bstrengthening parent/i, /\bmanaging emotions/i,
  /\bflower essence/i, /\bbirthing\b/i,
  /\bembaraz/i, /\bposparto\b/i, /\bpregnancy\b/i, /\bprenatal\b/i,

  // Yoga / meditation / spiritual / sound healing
  /\byoga\b/i, /\bpilates\b/i, /\bmeditation\b/i,
  /\bkundalini\b/i, /\breiki\b/i, /\bchakra\b/i,
  /\bpsychic\b/i, /\btarot\b/i, /\bastrology\b/i,
  /\bprayer\b/i, /\bbible\b/i, /\bchurch\b/i,
  /\bspiritual\b/i, /\bcacao circle/i, /\bbreathwork\b/i,
  /\bsound\s*(journey|bath|healing)\b/i, /\bdeep\s*rest\b/i,

  // Kids / family specific
  /\bkids\b.*\bclass/i, /\bages\s+\d+\+?\b/i, /\bpre-junior/i,
  /\bhello kitty\b/i, /\bslime kitchen\b/i,
  /\bparenting\b/i, /\bmother-daughter\b/i,

  // Education / training / academic / tech (non-music)
  /\btraining\b.*\b(installer|enphase|career|soft skill)/i,
  /\binstaller training\b/i, /\bcertification\b/i,
  /\bcomputational\b/i, /\bmodelling\b/i, /\bfire safety\b/i,
  /\bimprov\s*(class|lesson|audition|program|101|102)\b/i,
  /\bdrop.in\s*class/i, /\bintro\s+to\s+improv/i,
  /\baudition/i,
  /\bagentic\s*ai\b/i, /\bai\s+for\s+everyone/i,
  /\bgeneral\s*meeting\b/i, /\bchapter\s*event\b/i,

  // Non-English events (French / Spanish educational / medical)
  /\bl'ia\b/i, /\blire autrement\b/i, /\bmaîtrisez\b/i,
  /\bannoncer une mauvaise/i, /\bmémoire.*oublis/i,
  /\bcírculo de apoyo\b/i, /\bcírculo de mujeres\b/i,
  /\batelier\s+en\s+ligne/i, /\bprise\s+en\s+main/i,
  /\bvisas?\s+de\s+travail/i, /\bpsycom\b/i,

  // Crafts / DIY / art classes / art events
  /\bbejewel/i, /\bjewelry\s*(making|class|workshop)/i,
  /\bcrafting\b/i, /\bcraft\s+(night|class|workshop)/i,
  /\bscrapbook/i, /\bcalligraphy\b/i, /\bpottery\b/i,
  /\bwatercolor/i, /\bacrylic\s*painting/i,
  /\bpainting\s*(class|workshop|lesson|with|party)/i,
  /\bpaint\s*(party|night|nite|and\s*sip)\b/i,
  /\bdrawing\s*(class|workshop|lesson)/i, /\bart\s*(class|workshop|lesson)/i,
  /\bstudio\s*artist/i, /\bstudio\s*tour/i, /\bopen\s*studio/i,
  /\bgallery\s*(opening|reception)\b/i, /\bart\s*walk\b/i,
  /\bart\s*&?\s*wine\s*tour/i, /\bcabaret\b/i,

  // Misc off-topic
  /\bboutique\b.*\bvendor/i, /\bscavenger hunt\b/i,
  /\bbingo\b/i, /\bcasino\b/i, /\bbook\s+(club|fair|talk|signing|reading|launch)\b/i,
  /\bknitting\b/i, /\bsewing\b/i,
  /\bwedding\b/i, /\bbridal\b/i,
  /\bdivorce\b/i, /\bpotluck\b/i,
  /\bluncheon\b.*\bsponsorship/i, /\bladies luncheon/i,
  /\bconstruction\s*happy/i, /\bindustry\s*happy\s*hour/i,
  /\bhospital\b/i, /\bcottage\s*hospital/i,
  /\bhistorical\s*museum\b/i, /\bstreets\s+of\b/i,
  /\bstarving\s*artist/i,
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
 * Normalize a title for fuzzy matching: lowercase, strip punctuation,
 * collapse whitespace, remove common suffixes like "tour" names.
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*[–—|].*$/, '')            // strip "Artist – Tour Name", "Artist | Opener"
    .replace(/\s+-\s+.*$/, '')             // strip "Artist - Tour Name" (spaced dash only)
    .replace(/[^a-z0-9\s]/g, '')           // strip punctuation
    .replace(/\s+/g, ' ')                  // collapse whitespace
    .trim();
}

/** Extract significant words (3+ chars) from a title for overlap matching */
function titleWords(title: string): Set<string> {
  return new Set(
    normalizeTitle(title)
      .split(' ')
      .filter((w) => w.length >= 3)
  );
}

/**
 * Venue-specific sources are preferred over aggregator sources when deduping.
 * Lower number = higher priority (keep this one).
 */
function sourcePriority(source: string): number {
  if (source === 'ventura-music-hall' || source === 'sbbowl' || source === 'deer-lodge') return 0;
  if (source.startsWith('eventcalendarapp-')) return 1;
  if (source === 'leashless' || source === 'island-brewing' || source === 'ovlc') return 1;
  if (source === 'third-window' || source === 'ventura-raceway' || source === 'bright-spark') return 1;
  if (source === '805calendar') return 2;
  if (source === 'bandsintown') return 3;
  if (source === 'eventbrite') return 4;
  return 5;
}

/**
 * Deduplicate events. Two passes:
 * 1. Exact ID match (deterministic hash)
 * 2. Fuzzy: same date + similar normalized title → keep the higher-priority source
 */
export function dedupeEvents(events: ScrapedEvent[]): ScrapedEvent[] {
  // Pass 1: exact ID dedup
  const seen = new Map<string, ScrapedEvent>();
  for (const event of events) {
    const existing = seen.get(event.id);
    if (!existing || sourcePriority(event.source) < sourcePriority(existing.source)) {
      seen.set(event.id, event);
    }
  }
  const afterIdDedup = Array.from(seen.values());

  // Pass 2: fuzzy title+date dedup
  // Group by date, then within each date compare normalized titles
  const byDate = new Map<string, ScrapedEvent[]>();
  for (const event of afterIdDedup) {
    const list = byDate.get(event.date) || [];
    list.push(event);
    byDate.set(event.date, list);
  }

  const result: ScrapedEvent[] = [];
  for (const [, dayEvents] of byDate) {
    // Sort by priority so we process venue-specific first
    dayEvents.sort((a, b) => sourcePriority(a.source) - sourcePriority(b.source));

    const keptNormTitles: { norm: string; words: Set<string>; event: ScrapedEvent }[] = [];

    for (const event of dayEvents) {
      const norm = normalizeTitle(event.title);
      if (norm.length < 3) {
        result.push(event);
        continue;
      }

      const words = titleWords(event.title);

      // Check if a similar title was already kept for this date
      const isDup = keptNormTitles.some(({ norm: kept, words: keptWords }) => {
        if (kept === norm) return true;
        // One contains the other (e.g. "disclosure" vs "disclosure todd edwards")
        if (kept.includes(norm) || norm.includes(kept)) return true;
        // Share a significant leading portion (first 10+ chars match)
        const minLen = Math.min(kept.length, norm.length);
        if (minLen >= 10 && kept.slice(0, minLen) === norm.slice(0, minLen)) return true;
        // Significant word overlap (>=50% of smaller set's words match)
        if (words.size >= 2 && keptWords.size >= 2) {
          const overlap = [...words].filter((w) => keptWords.has(w)).length;
          const smaller = Math.min(words.size, keptWords.size);
          if (overlap / smaller >= 0.5) return true;
        }
        return false;
      });

      if (!isDup) {
        keptNormTitles.push({ norm, words, event });
        result.push(event);
      }
    }
  }

  return result;
}

/**
 * Filter out events that have already passed.
 */
export function filterFutureEvents(events: ScrapedEvent[]): ScrapedEvent[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return events.filter((e) => e.date >= today);
}
