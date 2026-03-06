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

    // Webflow CMS: each event is a .w-dyn-item with specific VMH classes
    $('.w-dyn-item').each((_, el) => {
      const $el = $(el);

      // Title is in .show-name
      const title = $el.find('.show-name').first().text().trim();
      if (!title || title.length < 3) return;

      // Date+time is in .event-start: "March 6, 2026 8:00 PM"
      const eventStartText = $el.find('.event-start').first().text().trim();
      // Also try the short date: "Mar 6, 2026"
      const shortDateText = $el.find('.date').first().text().trim();

      const date = parseDate(eventStartText) || parseDate(shortDateText);
      if (!date || date < today) return;

      // Extract time from .event-start text or .start-time .time elements
      let time: string | undefined;
      const timeFromStart = eventStartText.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
      if (timeFromStart) {
        time = parseTime(timeFromStart[1]) || undefined;
      }
      // Also check the show start time elements
      if (!time) {
        const showTimes = $el.find('.start-time .time');
        if (showTimes.length >= 2) {
          // Second .start-time is "Starts:" time
          const startsTime = $(showTimes[1]).text().trim();
          time = startsTime ? parseTime(startsTime) : undefined;
        } else if (showTimes.length === 1) {
          time = parseTime($(showTimes[0]).text().trim()) || undefined;
        }
      }

      // Ticket link
      const ticketLink = $el.find('a[href*="tixr.com"]').first().attr('href')
        || $el.find('a.nav-button').first().attr('href') || '';

      // Detail page link
      const detailLink = $el.find('a.event-location').first().attr('href') || '';
      const eventUrl = ticketLink
        || (detailLink.startsWith('http') ? detailLink : detailLink ? `https://venturamusichall.com${detailLink}` : url);

      // Description
      const description = $el.find('.show-descrip-rte').first().text().trim().slice(0, 300);

      // Cost
      const cost = $el.find('.cost').first().text().trim();
      const isFree = $el.find('.free').first().length > 0 && !$el.find('.free').first().hasClass('w-condition-invisible');
      const costInfo = isFree ? 'Free' : cost ? `$${cost}` : '';

      events.push({
        id: generateEventId(title, date, 'Ventura Music Hall'),
        title,
        description: costInfo ? `${costInfo} — ${description}` : description,
        date,
        time,
        category: 'art',
        location: 'Ventura',
        venue: 'Ventura Music Hall',
        externalUrl: eventUrl,
        instagramHandle: '@venturamusichall',
        source: 'ventura-music-hall',
      });
    });

    console.log(`  [VenturaMusichall] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [VenturaMusichall] Error - ${msg}`);
    return { source: 'ventura-music-hall', events: [], error: msg };
  }

  return { source: 'ventura-music-hall', events };
}
