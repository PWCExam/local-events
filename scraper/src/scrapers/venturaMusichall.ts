import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

export async function scrapeVenturaMusichall(): Promise<ScraperResult> {
  const url = 'https://venturamusichall.com/events';
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const today = new Date().toISOString().slice(0, 10);

    // Webflow CMS uses .w-dyn-item for collection items
    const items = $('.w-dyn-item');

    if (items.length > 0) {
      items.each((_, el) => {
        const $el = $(el);

        // Get title from any heading or link text
        const title = $el.find('h2, h3, h4, [class*="title"], [class*="name"]').first().text().trim()
          || $el.find('a').first().text().trim();
        if (!title || title.length < 3) return;

        // Look for date text
        const dateText = $el.find('[class*="date"], time, [class*="month"], [class*="day"]').first().text().trim()
          || $el.find('[datetime]').first().attr('datetime') || '';
        const date = parseDate(dateText);
        if (!date || date < today) return;

        // Look for time
        const timeText = $el.find('[class*="time"], [class*="door"]').first().text().trim();
        const time = timeText ? parseTime(timeText) : undefined;

        // Get link
        const link = $el.find('a[href*="/show"], a[href*="/event"]').first().attr('href')
          || $el.find('a').first().attr('href') || '';
        const eventUrl = link.startsWith('http') ? link : link ? `https://venturamusichall.com${link}` : url;

        events.push({
          id: generateEventId(title, date, 'Ventura Music Hall'),
          title,
          description: '',
          date,
          time: time || undefined,
          category: 'art',
          location: 'Ventura',
          venue: 'Ventura Music Hall',
          externalUrl: eventUrl,
          instagramHandle: '@venturamusichall',
          source: 'ventura-music-hall',
        });
      });
    }

    // Fallback: look for any collection list items
    if (events.length === 0) {
      $('.collection-list a, .w-dyn-list a').each((_, el) => {
        const $el = $(el);
        const href = $el.attr('href') || '';
        if (!href.includes('/show') && !href.includes('/event')) return;

        const title = $el.text().trim();
        if (!title || title.length < 3 || title.length > 200) return;

        // Try to find date in surrounding context
        const parent = $el.closest('.w-dyn-item, .collection-item, [class*="event"]');
        const dateText = parent.find('[class*="date"], time').first().text().trim();
        const date = dateText ? parseDate(dateText) : null;
        if (!date || date < today) return;

        const eventUrl = href.startsWith('http') ? href : `https://venturamusichall.com${href}`;

        events.push({
          id: generateEventId(title, date, 'Ventura Music Hall'),
          title,
          description: '',
          date,
          time: undefined,
          category: 'art',
          location: 'Ventura',
          venue: 'Ventura Music Hall',
          externalUrl: eventUrl,
          instagramHandle: '@venturamusichall',
          source: 'ventura-music-hall',
        });
      });
    }

    console.log(`  [VenturaMusichall] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [VenturaMusichall] Error - ${msg}`);
    return { source: 'ventura-music-hall', events: [], error: msg };
  }

  return { source: 'ventura-music-hall', events };
}
