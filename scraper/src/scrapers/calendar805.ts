import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime, inferLocation, inferCategory } from '../utils.js';

export async function scrapeCalendar805(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const res = await fetch('https://805calendar.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const today = new Date().toISOString().slice(0, 10);
    const currentYear = new Date().getFullYear();

    // 805calendar.com has events in blockquote elements
    // Events follow pattern: "Day, Mon DD: Event Title - details"
    const datePattern = /(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:day)?,\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2})/i;

    $('blockquote').each((_, blockEl) => {
      const blockHtml = $(blockEl).html() || '';
      // Split by line breaks and strong/bold tags that contain dates
      const lines = blockHtml.split(/<br\s*\/?>|\n/).map(l => l.trim()).filter(l => l.length > 0);

      let currentDate: string | null = null;

      for (const line of lines) {
        const $line = cheerio.load(line);
        const text = $line.root().text().trim();
        if (!text) continue;

        // Check if this line starts with a date pattern
        const dateMatch = text.match(datePattern);
        if (dateMatch) {
          const dateStr = `${dateMatch[1]}, ${currentYear}`;
          currentDate = parseDate(dateStr);

          // If the parsed date is in the past (before today), try next year
          if (currentDate && currentDate < today) {
            const nextYearStr = `${dateMatch[1]}, ${currentYear + 1}`;
            currentDate = parseDate(nextYearStr);
          }

          // Extract event info after the date+colon
          const afterDate = text.replace(datePattern, '').replace(/^[,:\s]+/, '').trim();
          if (afterDate && currentDate && currentDate >= today) {
            parseEventLine(afterDate, currentDate, $line, events);
          }
        } else if (currentDate && currentDate >= today && text.length > 5) {
          // Continuation line — might be another event on the same date
          // Check if it looks like an event (has venue-like words or time)
          if (text.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/i) || text.length > 10) {
            parseEventLine(text, currentDate, $line, events);
          }
        }
      }
    });

    // Dedupe by ID
    const seen = new Set<string>();
    const uniqueEvents = events.filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    events.length = 0;
    events.push(...uniqueEvents);

    console.log(`  [805Calendar] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [805Calendar] Error - ${msg}`);
    return { source: '805calendar', events: [], error: msg };
  }

  return { source: '805calendar', events };
}

function parseEventLine(
  text: string,
  date: string,
  $line: cheerio.CheerioAPI,
  events: ScrapedEvent[]
) {
  // Try to extract time
  const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  const time = timeMatch ? parseTime(timeMatch[1]) : undefined;

  // Try to find a ticket/event link
  const linkEl = $line('a[href]').first();
  const externalUrl = linkEl.attr('href') || undefined;

  // Clean up the title - remove time info
  let title = text
    .replace(/\d{1,2}(?::\d{2})?\s*(?:am|pm)/gi, '')
    .replace(/doors?\s*(?:at|@)\s*/gi, '')
    .replace(/show\s*(?:at|@)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Try to split into event name and venue
  // Common patterns: "Event at Venue", "Event - Venue", "Event @ Venue"
  let venue = '';
  const atMatch = title.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
  const dashMatch = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);

  if (atMatch) {
    title = atMatch[1].trim();
    venue = atMatch[2].trim();
  } else if (dashMatch) {
    // Check which part is more likely to be the venue
    const part1 = dashMatch[1].trim();
    const part2 = dashMatch[2].trim();
    const venueWords = /hall|theater|theatre|bowl|brew|tap|bar|lodge|club|lounge|stage|room|pub/i;
    if (venueWords.test(part2)) {
      title = part1;
      venue = part2;
    } else if (venueWords.test(part1)) {
      venue = part1;
      title = part2;
    } else {
      title = `${part1} - ${part2}`;
    }
  }

  if (!title || title.length < 3) return;

  const location = inferLocation(venue || title);
  const category = inferCategory(venue || '', title);

  events.push({
    id: generateEventId(title, date, venue || '805calendar'),
    title,
    description: venue ? `at ${venue}` : '',
    date,
    time: time || undefined,
    category,
    location,
    venue: venue || undefined,
    externalUrl,
    source: '805calendar',
  });
}
