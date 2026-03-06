import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseTime } from '../utils.js';
import { format } from 'date-fns';

interface SquarespaceItem {
  title?: string;
  excerpt?: string;
  fullUrl?: string;
  urlId?: string;
  assetUrl?: string;
  structuredContent?: { variants?: { price?: number }[] };
}

interface SquarespaceResponse {
  collection?: { items?: SquarespaceItem[] };
  items?: SquarespaceItem[];
}

export async function scrapeDeerLodge(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://www.deerlodgeojai.com/live-music?format=json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: SquarespaceResponse = await res.json();
    const items = data.collection?.items || data.items || [];
    const today = format(new Date(), 'yyyy-MM-dd');

    for (const item of items) {
      const title = item.title || '';
      if (!title) continue;

      // Deer Lodge titles often include date like "Artist Name | 3.15.26 @ 8PM"
      let date: string | null = null;
      let time: string | undefined;

      // Try to extract date from title: "3.6.26 @ 8PM" or "03.15.26"
      const dateMatch = title.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
      if (dateMatch) {
        const month = dateMatch[1].padStart(2, '0');
        const day = dateMatch[2].padStart(2, '0');
        let year = dateMatch[3];
        if (year.length === 2) year = '20' + year;
        date = `${year}-${month}-${day}`;
      }

      // Extract time from title: "@ 8PM" or "@ 7:30PM"
      const timeMatch = title.match(/@\s*(\d{1,2}(?::\d{2})?\s*[AP]M)/i);
      if (timeMatch) {
        time = parseTime(timeMatch[1]) || undefined;
      }

      // Also check excerpt for time: "Doors @ 7PM"
      if (!time && item.excerpt) {
        const excerptTime = item.excerpt.match(/(\d{1,2}(?::\d{2})?\s*[AP]M)/i);
        if (excerptTime) time = parseTime(excerptTime[1]) || undefined;
      }

      if (!date || date < today) continue;

      // Clean title - remove the date/time part
      const cleanTitle = title.replace(/\s*\|\s*\d{1,2}\.\d{1,2}\.\d{2,4}\s*@?\s*\d{0,2}:?\d{0,2}\s*[AP]?M?\s*/i, '').trim();

      const eventUrl = item.fullUrl
        ? `https://www.deerlodgeojai.com${item.fullUrl}`
        : 'https://www.deerlodgeojai.com/live-music';

      events.push({
        id: generateEventId(cleanTitle || title, date, 'Deer Lodge'),
        title: cleanTitle || title,
        description: item.excerpt?.replace(/<[^>]*>/g, '').trim() || '',
        date,
        time,
        category: 'art',
        location: 'Ojai',
        venue: 'Deer Lodge',
        externalUrl: eventUrl,
        instagramHandle: '@ojaideerlodge',
        source: 'deer-lodge',
      });
    }

    console.log(`  [DeerLodge] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [DeerLodge] Error - ${msg}`);
    return { source: 'deer-lodge', events: [], error: msg };
  }

  return { source: 'deer-lodge', events };
}
