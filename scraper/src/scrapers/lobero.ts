import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

const URL = 'https://www.lobero.org/whats-on/monthly-calendar/';

export async function scrapeLobero(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const today = new Date().toISOString().slice(0, 10);

    // Try event links with /events/ in the href
    $('a[href*="/events/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const container = $(el);

      // Get title from h3 or the link text itself
      const title = container.find('h3').first().text().trim()
        || container.text().trim();

      if (!title || title.length < 3 || title.length > 150) return;
      // Skip nav links and boilerplate
      if (/whats-on|monthly-calendar|buy tickets|learn more|Previous|Next Month/i.test(title)) return;
      if (title.includes('«') || title.includes('»') || title.includes('←') || title.includes('→')) return;

      // Look for date text in the container or nearby elements
      const fullText = container.text() + ' ' + container.parent().text();

      // Match patterns like "Wednesday, March 10, 7:30 PM" or "Mar 10, 2026"
      const dateMatch = fullText.match(
        /(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*,?\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}(?:,?\s+\d{4})?/i
      );

      if (!dateMatch) return;

      const date = parseDate(dateMatch[0]);
      if (!date || date < today) return;

      // Extract time
      const timeMatch = fullText.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i);
      const time = timeMatch ? parseTime(timeMatch[1]) : undefined;

      // Skip cancelled events
      if (/cancel/i.test(fullText)) return;

      const eventUrl = href.startsWith('http') ? href : `https://www.lobero.org${href}`;
      const id = generateEventId(title, date, 'Lobero');

      if (events.some((e) => e.id === id)) return;

      events.push({
        id,
        title,
        description: 'at Lobero Theatre',
        date,
        time: time || undefined,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'Lobero Theatre',
        externalUrl: eventUrl,
        source: 'lobero',
      });
    });

    // Fallback: parse text content for event-like patterns
    if (events.length === 0) {
      const text = $('body').text();
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const dateMatch = line.match(
          /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}(?:,?\s+\d{4})?/i
        );
        if (!dateMatch) continue;

        const date = parseDate(dateMatch[0]);
        if (!date || date < today) continue;

        // Title is often the line before the date
        let title = '';
        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
          const c = lines[j];
          if (c.length >= 4 && c.length <= 120 && !/^\d/.test(c)) {
            title = c;
            break;
          }
        }
        if (!title) continue;
        if (/cancel/i.test(title)) continue;

        const timeMatch = line.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i);
        const time = timeMatch ? parseTime(timeMatch[1]) : undefined;

        const id = generateEventId(title, date, 'Lobero');
        if (events.some((e) => e.id === id)) continue;

        events.push({
          id,
          title,
          description: 'at Lobero Theatre',
          date,
          time: time || undefined,
          category: 'art',
          location: 'Santa Barbara',
          venue: 'Lobero Theatre',
          externalUrl: URL,
          source: 'lobero',
        });
      }
    }

    // Filter out navigation/boilerplate that slipped through
    const filtered = events.filter((e) =>
      !/previous|next month/i.test(e.title) && !e.title.includes('\u00AB') && !e.title.includes('\u00BB')
    );
    events.length = 0;
    events.push(...filtered);

    // Dedupe
    const seen = new Set<string>();
    const unique = events.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    events.length = 0;
    events.push(...unique);

    console.log(`  [Lobero] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Lobero] Error - ${msg}`);
    return { source: 'lobero', events: [], error: msg };
  }

  return { source: 'lobero', events };
}
