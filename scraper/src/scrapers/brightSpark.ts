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
}

interface SquarespaceResponse {
  upcoming?: SquarespaceEvent[];
  items?: SquarespaceEvent[];
}

export async function scrapeBrightSpark(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://www.brightsparkbrewing.com/calendar?format=json', {
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
        ? `https://www.brightsparkbrewing.com${item.fullUrl}`
        : 'https://www.brightsparkbrewing.com/calendar';

      const description = (item.excerpt || item.body || '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .slice(0, 300);

      events.push({
        id: generateEventId(title, date, 'Bright Spark Brewing'),
        title,
        description,
        date,
        time: time !== '12:00 AM' ? time : undefined,
        category: 'beer',
        location: 'Ventura',
        venue: 'Bright Spark Brewing',
        externalUrl: eventUrl,
        instagramHandle: '@brightsparkbrewing',
        source: 'bright-spark',
      });
    }

    console.log(`  [BrightSpark] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [BrightSpark] Error - ${msg}`);
    return { source: 'bright-spark', events: [], error: msg };
  }

  return { source: 'bright-spark', events };
}
