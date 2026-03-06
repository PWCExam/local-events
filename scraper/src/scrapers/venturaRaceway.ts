import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

export async function scrapeVenturaRaceway(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    // Try the Tribe Events REST API first
    const now = new Date();
    const months = [0, 1, 2, 3, 4, 5]; // Check 6 months ahead

    for (const offset of months) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const monthStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const url = `https://venturaraceway.com/events/month/${monthStr}/`;

      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
        });

        if (!res.ok) continue;
        const html = await res.text();
        const $ = cheerio.load(html);
        const today = now.toISOString().slice(0, 10);

        // Tribe Events selectors
        $('.tribe-events-calendar td[data-day]').each((_, el) => {
          const $el = $(el);
          const day = $el.attr('data-day');
          if (!day || day < today) return;

          $el.find('.tribe-events-tooltip, .tribe-events-month-event-title, [class*="event"]').each((_, eventEl) => {
            const title = $(eventEl).text().trim();
            if (!title || title.length < 3) return;

            events.push({
              id: generateEventId(title, day, 'Ventura Raceway'),
              title,
              description: '',
              date: day,
              time: undefined,
              category: 'art',
              location: 'Ventura',
              venue: 'Ventura Raceway',
              externalUrl: `https://venturaraceway.com/events/month/${monthStr}/`,
              instagramHandle: '@venturaraceway',
              source: 'ventura-raceway',
            });
          });
        });

        // Also try list view items
        $('.tribe-events-list .type-tribe_events, .tribe-event-item').each((_, el) => {
          const $el = $(el);
          const title = $el.find('.tribe-events-list-event-title, h2, h3').first().text().trim();
          if (!title) return;

          const dateText = $el.find('.tribe-event-schedule-details, [datetime], time').first().text().trim()
            || $el.find('[datetime]').first().attr('datetime') || '';
          const date = parseDate(dateText);
          if (!date || date < today) return;

          const timeText = $el.find('.tribe-event-time').first().text().trim();
          const time = timeText ? parseTime(timeText) : undefined;

          const link = $el.find('a').first().attr('href') || '';

          events.push({
            id: generateEventId(title, date, 'Ventura Raceway'),
            title,
            description: '',
            date,
            time: time || undefined,
            category: 'art',
            location: 'Ventura',
            venue: 'Ventura Raceway',
            externalUrl: link.startsWith('http') ? link : url,
            instagramHandle: '@venturaraceway',
            source: 'ventura-raceway',
          });
        });
      } catch {
        continue;
      }
    }

    console.log(`  [VenturaRaceway] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [VenturaRaceway] Error - ${msg}`);
    return { source: 'ventura-raceway', events: [], error: msg };
  }

  return { source: 'ventura-raceway', events };
}
