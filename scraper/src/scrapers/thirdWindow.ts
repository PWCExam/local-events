import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseTime } from '../utils.js';
import { format, addDays, isBefore, parse, isValid } from 'date-fns';

interface CaliEvent {
  event_id?: number;
  event_title?: string;
  event_details?: string;
  start_date_time?: string;  // "2026-03-29 00:00:00"
  end_date_time?: string;
  event_location?: string;
  external_url?: string;
  event_image_s3?: string | null;
  is_recurring?: number;
  recurrence_type?: string | null;
  repeat_interval?: number | null;
  end_recurring_event?: string | null;
  is_show_time?: string;
  tag_id?: number | null;
}

interface CaliResponse {
  result?: boolean;
  event_data?: CaliEvent[];
  tags?: { id: number; tag_name: string }[];
}

function inferLocation(locationStr: string): 'Ventura' | 'Santa Barbara' | 'Ojai' {
  const lower = locationStr.toLowerCase();
  if (lower.includes('carpinteria') || lower.includes('carp')) return 'Ventura';
  if (lower.includes('santa barbara') || lower.includes('sb')) return 'Santa Barbara';
  return 'Santa Barbara'; // Default for Third Window
}

/**
 * Expand recurring weekly events into individual occurrences.
 */
function expandRecurring(event: CaliEvent, maxDate: string): { date: string; time: string | undefined }[] {
  const occurrences: { date: string; time: string | undefined }[] = [];
  if (!event.start_date_time) return occurrences;

  const startDate = parse(event.start_date_time, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (!isValid(startDate)) return occurrences;

  const endRecur = event.end_recurring_event
    ? parse(event.end_recurring_event, 'yyyy-MM-dd HH:mm:ss', new Date())
    : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const interval = (event.repeat_interval || 1) * 7; // weekly interval in days
  let current = startDate;

  while (format(current, 'yyyy-MM-dd') <= maxDate) {
    if (endRecur && isBefore(endRecur, current)) break;

    if (!isBefore(current, today)) {
      const timePart = event.start_date_time!.slice(11, 16); // "16:00"
      const time = timePart !== '00:00' && event.is_show_time !== '0'
        ? parseTime(timePart) || undefined
        : undefined;

      occurrences.push({
        date: format(current, 'yyyy-MM-dd'),
        time,
      });
    }

    current = addDays(current, interval);
  }

  return occurrences;
}

export async function scrapeThirdWindow(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://theweeapps.com/caly-v2/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: 'shop=third-window-brewing.myshopify.com&req_calling_method=get_front_event_data&calendar_type=original&calendar_id=1',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: CaliResponse = await res.json();

    if (!data.result || !data.event_data) {
      throw new Error('API returned no data');
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    // Look 6 months ahead for recurring events
    const maxDate = format(addDays(new Date(), 180), 'yyyy-MM-dd');

    for (const item of data.event_data) {
      const title = item.event_title || '';
      if (!title) continue;

      const location = inferLocation(item.event_location || '');
      const description = (item.event_details || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 300);

      if (item.is_recurring && item.recurrence_type === 'weekly') {
        // Expand recurring events
        const occurrences = expandRecurring(item, maxDate);
        for (const occ of occurrences) {
          events.push({
            id: generateEventId(title, occ.date, `Third Window ${location}`),
            title,
            description,
            date: occ.date,
            time: occ.time,
            category: 'beer',
            location,
            venue: item.event_location || 'Third Window Brewing',
            externalUrl: item.external_url || 'https://thirdwindowbrewing.com/pages/events',
            instagramHandle: '@thirdwindowbrewing',
            source: 'third-window',
          });
        }
      } else {
        // One-time event
        const date = item.start_date_time?.slice(0, 10);
        if (!date || date < today) continue;

        const timePart = item.start_date_time?.slice(11, 16);
        const time = timePart && timePart !== '00:00' && item.is_show_time !== '0'
          ? parseTime(timePart) || undefined
          : undefined;

        events.push({
          id: generateEventId(title, date, `Third Window ${location}`),
          title,
          description,
          date,
          time,
          category: 'beer',
          location,
          venue: item.event_location || 'Third Window Brewing',
          externalUrl: item.external_url || 'https://thirdwindowbrewing.com/pages/events',
          instagramHandle: '@thirdwindowbrewing',
          source: 'third-window',
        });
      }
    }

    console.log(`  [ThirdWindow] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [ThirdWindow] Error - ${msg}`);
    return { source: 'third-window', events: [], error: msg };
  }

  return { source: 'third-window', events };
}
