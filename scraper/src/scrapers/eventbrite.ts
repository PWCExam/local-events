import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime, inferLocation, inferCategory } from '../utils.js';

// Exclude areas south of Oxnard
const EXCLUDED_AREAS = [
  'simi valley', 'simi', 'agoura hills', 'agoura', 'thousand oaks',
  'camarillo', 'moorpark', 'newbury park', 'westlake', 'woodland hills',
  'calabasas', 'chatsworth', 'canoga park', 'northridge', 'panorama city',
  'los angeles', 'pasadena', 'burbank', 'glendale',
];

const SEARCH_URLS = [
  'https://www.eventbrite.com/d/ca--ventura/events/',
  'https://www.eventbrite.com/d/ca--santa-barbara/events/',
  'https://www.eventbrite.com/d/ca--ojai/events/',
];

export async function scrapeEventbrite(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    for (const searchUrl of SEARCH_URLS) {
      try {
        const res = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });

        if (!res.ok) continue;
        const html = await res.text();
        const $ = cheerio.load(html);

        // Extract events from JSON-LD (Schema.org Event markup)
        $('script[type="application/ld+json"]').each((_, el) => {
          try {
            const json = JSON.parse($(el).html() || '');
            const items = json['@type'] === 'ItemList'
              ? (json.itemListElement || []).map((i: any) => i.item || i)
              : json['@type'] === 'Event' ? [json] : [];

            for (const item of items) {
              if (item['@type'] !== 'Event') continue;

              const title = item.name || '';
              const startDate = item.startDate || '';
              const locationName = item.location?.name || '';
              const city = item.location?.address?.addressLocality || '';
              const url = item.url || '';

              if (!title || !startDate) continue;

              // Skip excluded areas
              const locationText = `${city} ${locationName}`.toLowerCase();
              if (EXCLUDED_AREAS.some((area) => locationText.includes(area))) continue;

              // Skip webinars, online events, and generic business events
              if (/webinar|online|virtual|zoom|linkedin|certification|fast-track|capm|pmp|data science|machine learn/i.test(title)) continue;

              // Skip non-US Eventbrite events (eventbrite.fr, .ca, .co.uk)
              if (url && !url.includes('eventbrite.com')) continue;

              const date = parseDate(startDate);
              if (!date) continue;

              const today = new Date().toISOString().slice(0, 10);
              if (date < today) continue;

              // Try to extract time from startDate (ISO 8601)
              let time: string | undefined;
              const timeMatch = startDate.match(/T(\d{2}):(\d{2})/);
              if (timeMatch) {
                const h = parseInt(timeMatch[1]);
                const m = timeMatch[2];
                const period = h >= 12 ? 'PM' : 'AM';
                const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                time = `${hour12}:${m} ${period}`;
              }

              const location = inferLocation(`${city} ${locationName}`);
              const category = inferCategory(locationName, title);

              events.push({
                id: generateEventId(title, date, 'eventbrite'),
                title,
                description: locationName ? `at ${locationName}` : '',
                date,
                time,
                category,
                location,
                venue: locationName || undefined,
                externalUrl: url || searchUrl,
                source: 'eventbrite',
              });
            }
          } catch {
            // Skip invalid JSON-LD blocks
          }
        });
      } catch {
        continue;
      }
    }

    // Dedupe by ID
    const seen = new Set<string>();
    const unique = events.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    events.length = 0;
    events.push(...unique);

    console.log(`  [Eventbrite] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Eventbrite] Error - ${msg}`);
    return { source: 'eventbrite', events: [], error: msg };
  }

  return { source: 'eventbrite', events };
}
