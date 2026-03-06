import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

export async function scrapeBellringer(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    // Bellringer uses a WordPress AJAX calendar — try multiple approaches

    // Approach 1: Try fetching the events page directly
    const pageUrl = 'https://bellringerbrewco.com/events/';
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try standard event selectors
    const selectors = [
      '.tribe-events-list .type-tribe_events',
      '.tribe_events', '.event-item',
      '.ai1ec-event', '.tribe-events-calendar td',
      '[class*="event"]',
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const $el = $(el);
        const title = $el.find('h2, h3, .tribe-events-list-event-title, [class*="title"]').first().text().trim();
        if (!title || title.length < 3) return;

        const dateText = $el.find('.tribe-event-schedule-details, time, [datetime], [class*="date"]').first().text().trim()
          || $el.find('[datetime]').first().attr('datetime') || '';
        const date = parseDate(dateText);
        if (!date) return;

        const timeText = $el.find('[class*="time"]').first().text().trim();
        const time = timeText ? parseTime(timeText) : undefined;

        const link = $el.find('a').first().attr('href') || '';
        const eventUrl = link.startsWith('http') ? link : link ? `https://bellringerbrewco.com${link}` : pageUrl;

        events.push({
          id: generateEventId(title, date, 'Bellringer Brewing'),
          title,
          description: '',
          date,
          time: time || undefined,
          category: 'beer',
          location: 'Santa Barbara',
          venue: 'Bellringer Brewing',
          externalUrl: eventUrl,
          instagramHandle: '@bellringerbrewco',
          source: 'bellringer',
        });
      });

      if (events.length > 0) break;
    }

    // Approach 2: Try AJAX endpoint for calendar data
    if (events.length === 0) {
      try {
        const ajaxRes = await fetch('https://bellringerbrewco.com/wp-admin/admin-ajax.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
          body: 'action=get_events&month=' + (new Date().getMonth() + 1) + '&year=' + new Date().getFullYear(),
        });

        if (ajaxRes.ok) {
          const text = await ajaxRes.text();
          try {
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
              for (const item of json) {
                const title = (item.title || item.name || '').replace(/<[^>]*>/g, '').trim();
                const date = parseDate(item.start || item.date || '');
                if (!title || !date) continue;

                const time = item.time ? parseTime(item.time) : undefined;
                events.push({
                  id: generateEventId(title, date, 'Bellringer Brewing'),
                  title,
                  description: '',
                  date,
                  time: time || undefined,
                  category: 'beer',
                  location: 'Santa Barbara',
                  venue: 'Bellringer Brewing',
                  externalUrl: item.url || pageUrl,
                  instagramHandle: '@bellringerbrewco',
                  source: 'bellringer',
                });
              }
            }
          } catch {
            // Response wasn't JSON, parse as HTML
            const $ajax = cheerio.load(text);
            $ajax('.event, [class*="event"]').each((_, el) => {
              const title = $ajax(el).text().trim();
              if (title.length > 3) {
                // Minimal extraction from AJAX HTML
              }
            });
          }
        }
      } catch {
        // AJAX endpoint not available
      }
    }

    console.log(`  [Bellringer] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Bellringer] Error - ${msg}`);
    return { source: 'bellringer', events: [], error: msg };
  }

  return { source: 'bellringer', events };
}
