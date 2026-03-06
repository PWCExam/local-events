import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId } from '../utils.js';
import { format } from 'date-fns';

interface SquarespaceEvent {
  title?: string;
  startDate?: number;
  endDate?: number;
  fullUrl?: string;
  body?: string;
  excerpt?: string;
  categories?: string[];
  assetUrl?: string;
}

interface SquarespaceResponse {
  upcoming?: SquarespaceEvent[];
  items?: SquarespaceEvent[];
}

export async function scrapeOVLC(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://ovlc.org/events/?format=json', {
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
        ? `https://ovlc.org${item.fullUrl}`
        : 'https://ovlc.org/events/';

      const description = (item.excerpt || item.body || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 300);

      events.push({
        id: generateEventId(title, date, 'OVLC'),
        title,
        description,
        date,
        time: time !== '12:00 AM' ? time : undefined,
        category: 'art',
        location: 'Ojai',
        venue: 'OVLC',
        externalUrl: eventUrl,
        instagramHandle: '@ojaivalleylandconservancy',
        source: 'ovlc',
      });
    }

    console.log(`  [OVLC] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [OVLC] Error - ${msg}`);
    return { source: 'ovlc', events: [], error: msg };
  }

  return { source: 'ovlc', events };
}
