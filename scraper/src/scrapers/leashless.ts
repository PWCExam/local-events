import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId } from '../utils.js';
import { format } from 'date-fns';

interface SquarespaceEvent {
  id?: string;
  title?: string;
  startDate?: number;  // Unix timestamp in milliseconds
  endDate?: number;
  fullUrl?: string;
  body?: string;
  excerpt?: string;
  categories?: string[];
  recordType?: number;
}

interface SquarespaceResponse {
  items?: SquarespaceEvent[];
  upcoming?: SquarespaceEvent[];
  past?: SquarespaceEvent[];
}

export async function scrapeLeashless(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://www.leashlessbrewing.com/event-calendar?format=json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: SquarespaceResponse = await res.json();
    const items = data.upcoming || data.items || [];
    const today = format(new Date(), 'yyyy-MM-dd');

    for (const item of items) {
      const title = item.title || '';
      if (!title) continue;

      if (!item.startDate) continue;
      const startDate = new Date(item.startDate);
      const date = format(startDate, 'yyyy-MM-dd');
      if (date < today) continue;

      const time = format(startDate, 'h:mm a');

      const eventUrl = item.fullUrl
        ? `https://www.leashlessbrewing.com${item.fullUrl}`
        : 'https://www.leashlessbrewing.com/event-calendar';

      const description = (item.excerpt || item.body || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 300);

      events.push({
        id: generateEventId(title, date, 'Leashless Brewing'),
        title,
        description,
        date,
        time: time !== '12:00 AM' ? time : undefined, // Skip midnight placeholder
        category: 'beer',
        location: 'Ventura',
        venue: 'Leashless Brewing',
        externalUrl: eventUrl,
        instagramHandle: '@leashlessbrewing',
        source: 'leashless',
      });
    }

    console.log(`  [Leashless] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Leashless] Error - ${msg}`);
    return { source: 'leashless', events: [], error: msg };
  }

  return { source: 'leashless', events };
}
