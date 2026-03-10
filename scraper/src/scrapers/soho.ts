import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

const URL = 'https://tickets.sohosb.com/';

export async function scrapeSoho(): Promise<ScraperResult> {
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

    // SOhO tickets page has event blocks with links to /e/[slug]
    // Parse the full text content looking for event patterns
    const text = $('body').text();
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    // Look for date patterns like "Mar 11, 2026" or "March 11, 2026"
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match date patterns: "Mon DD, YYYY" or "Month DD, YYYY"
      const dateMatch = line.match(
        /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4}/i
      );
      if (!dateMatch) continue;

      const date = parseDate(dateMatch[0]);
      if (!date || date < today) continue;

      // Extract time from the same or nearby lines
      const timeMatch = line.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      const time = timeMatch ? parseTime(timeMatch[1]) : undefined;

      // Look backward for the event title (usually the line before the date)
      let title = '';
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const candidate = lines[j];
        // Skip short lines, "More details", "Tickets", and other boilerplate
        if (candidate.length < 4 || candidate.length > 120) continue;
        if (/^(more details|tickets|buy|map|directions|soho)/i.test(candidate)) continue;
        if (/^\d/.test(candidate)) continue; // skip lines starting with numbers
        title = candidate;
        break;
      }

      if (!title || title.length < 3) continue;
      // Skip cancelled events
      if (/cancel/i.test(title) || /cancel/i.test(line)) continue;

      events.push({
        id: generateEventId(title, date, 'SOhO'),
        title,
        description: 'at SOhO Restaurant & Music Club',
        date,
        time: time || undefined,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'SOhO Restaurant & Music Club',
        externalUrl: URL,
        source: 'soho',
      });
    }

    // Also try extracting from anchor tags with /e/ links
    $('a[href*="/e/"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();

      // Skip navigation/boilerplate links
      if (!text || text.length < 3 || text.length > 120) return;
      if (/more details|tickets|buy/i.test(text)) return;

      // Look for date info near this element
      const parent = $(el).parent();
      const parentText = parent.text();
      const dateMatch = parentText.match(
        /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4}/i
      );
      if (!dateMatch) return;

      const date = parseDate(dateMatch[0]);
      if (!date || date < today) return;

      const timeMatch = parentText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      const time = timeMatch ? parseTime(timeMatch[1]) : undefined;

      const eventUrl = href.startsWith('http') ? href : `https://tickets.sohosb.com${href}`;

      // Check if we already have this event
      const id = generateEventId(text, date, 'SOhO');
      if (events.some((e) => e.id === id)) return;

      events.push({
        id,
        title: text,
        description: 'at SOhO Restaurant & Music Club',
        date,
        time: time || undefined,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'SOhO Restaurant & Music Club',
        externalUrl: eventUrl,
        source: 'soho',
      });
    });

    // Dedupe
    const seen = new Set<string>();
    const unique = events.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });
    events.length = 0;
    events.push(...unique);

    console.log(`  [SOhO] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [SOhO] Error - ${msg}`);
    return { source: 'soho', events: [], error: msg };
  }

  return { source: 'soho', events };
}
