import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

interface CaliEvent {
  event_title?: string;
  event_details?: string;
  event_start_date?: string;
  event_end_date?: string;
  event_start_time?: string;
  event_end_time?: string;
  event_color?: string;
  event_url?: string;
  event_image_s3?: string;
  is_recurring?: boolean;
}

export async function scrapeThirdWindow(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    // Third Window uses the Cali Calendar Shopify widget
    const res = await fetch('https://theweeapps.com/caly-v2/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: 'req_calling_method=get_front_event_data&calendar_id=1',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const today = new Date().toISOString().slice(0, 10);

    // The API may return events in various structures
    const rawEvents: CaliEvent[] = Array.isArray(data) ? data
      : data.events || data.data || [];

    for (const item of rawEvents) {
      const title = item.event_title || '';
      if (!title) continue;

      const date = item.event_start_date ? parseDate(item.event_start_date) : null;
      if (!date || date < today) continue;

      const time = item.event_start_time ? parseTime(item.event_start_time) : undefined;

      const description = (item.event_details || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 300);

      events.push({
        id: generateEventId(title, date, 'Third Window Brewing'),
        title,
        description,
        date,
        time: time || undefined,
        category: 'beer',
        location: 'Santa Barbara',
        venue: 'Third Window Brewing',
        externalUrl: item.event_url || 'https://thirdwindowbrewing.com/pages/events',
        instagramHandle: '@thirdwindowbrewing',
        source: 'third-window',
      });
    }

    console.log(`  [ThirdWindow] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [ThirdWindow] Error - ${msg}`);
    return { source: 'third-window', events: [], error: msg };
  }

  return { source: 'third-window', events };
}
