import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseTime } from '../utils.js';

interface WPConcert {
  id: number;
  title?: { rendered?: string };
  date?: string;
  slug?: string;
  link?: string;
  content?: { rendered?: string };
  acf?: Record<string, string>;
  meta?: Record<string, string>;
}

/**
 * Extract the event date from the WP concert slug.
 * Slugs look like: "flight-of-the-conchords-2026-05-07"
 * The last part is the actual concert date.
 */
function extractDateFromSlug(slug: string): string | null {
  const match = slug.match(/(\d{4}-\d{2}-\d{2})$/);
  return match ? match[1] : null;
}

export async function scrapeSBBowl(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    // Fetch all concerts, paginated
    let page = 1;
    let allConcerts: WPConcert[] = [];

    while (page <= 5) {
      const url = `https://sbbowl.com/wp-json/wp/v2/concerts?per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });

      if (!res.ok) break;
      const data: WPConcert[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      allConcerts.push(...data);

      // Check total pages from headers
      const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
      if (page >= totalPages) break;
      page++;
    }

    console.log(`  [SBBowl] Fetched ${allConcerts.length} concert posts`);

    const today = new Date().toISOString().slice(0, 10);

    for (const item of allConcerts) {
      const title = item.title?.rendered?.replace(/<[^>]*>/g, '').trim() || '';
      if (!title) continue;

      // Extract event date from the slug (not the WP post date)
      const date = extractDateFromSlug(item.slug || '');
      if (!date || date < today) continue;

      // Try to extract time from content
      let time: string | undefined;
      const content = item.content?.rendered || '';
      const timeMatch = content.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i)
        || content.match(/Doors?\s*(?:at|@|:)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)/i);
      if (timeMatch) {
        time = parseTime(timeMatch[1]) || undefined;
      }

      const description = content
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300);

      const eventUrl = item.link || `https://sbbowl.com/concerts/${item.slug}/`;

      events.push({
        id: generateEventId(title, date, 'Santa Barbara Bowl'),
        title,
        description,
        date,
        time,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'Santa Barbara Bowl',
        externalUrl: eventUrl,
        instagramHandle: '@sbbowl',
        source: 'sbbowl',
      });
    }

    console.log(`  [SBBowl] ${events.length} future events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [SBBowl] Error - ${msg}`);
    return { source: 'sbbowl', events: [], error: msg };
  }

  return { source: 'sbbowl', events };
}
