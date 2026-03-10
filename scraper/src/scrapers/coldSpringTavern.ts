import * as cheerio from 'cheerio';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

const URL = 'https://www.coldspringtavern.com/entertainment/';

export async function scrapeColdSpringTavern(): Promise<ScraperResult> {
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

    // Cold Spring Tavern uses Elementor with event blocks
    // Events have dates in .elementor-icon-list-text and titles in headings
    // Pattern: "Month Day, Year · Time"
    const text = $('body').text();
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match date pattern: "March 21, 2026" or "March 21, 2026 · 1:30 - 4:30 pm"
      const dateMatch = line.match(
        /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4}/i
      );
      if (!dateMatch) continue;

      const date = parseDate(dateMatch[0]);
      if (!date || date < today) continue;

      // Extract time — look for patterns like "1:30 - 4:30 pm" or "1:30 pm"
      let time: string | undefined;
      const timeMatch = line.match(/(\d{1,2}:\d{2})\s*(?:-\s*\d{1,2}:\d{2})?\s*(am|pm)/i);
      if (timeMatch) {
        time = parseTime(`${timeMatch[1]} ${timeMatch[2]}`) || undefined;
      }

      // Look for the artist/title — check nearby lines (before and after)
      let title = '';
      // Check lines before
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const candidate = lines[j];
        if (candidate.length < 3 || candidate.length > 120) continue;
        // Skip date lines, boilerplate
        if (/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(candidate)) continue;
        if (/entertainment|cold spring|menu|reservation|contact|home|about/i.test(candidate)) continue;
        if (/^\d/.test(candidate)) continue;
        // Skip descriptions (long sentences with "www" or many words)
        if (candidate.includes('www.') || candidate.split(' ').length > 10) continue;
        title = candidate;
        break;
      }

      // If no title found before, check after
      if (!title) {
        for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
          const candidate = lines[j];
          if (candidate.length < 3 || candidate.length > 120) continue;
          if (/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(candidate)) continue;
          if (/entertainment|cold spring|menu|reservation/i.test(candidate)) continue;
          title = candidate;
          break;
        }
      }

      if (!title || title.length < 3) continue;

      const id = generateEventId(title, date, 'Cold Spring Tavern');
      if (events.some((e) => e.id === id)) continue;

      events.push({
        id,
        title,
        description: 'Live music at Cold Spring Tavern',
        date,
        time: time || undefined,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'Cold Spring Tavern',
        externalUrl: URL,
        source: 'cold-spring-tavern',
      });
    }

    // Also try parsing from Elementor elements directly
    $('.elementor-widget-container').each((_, el) => {
      const block = $(el);
      const blockText = block.text().trim();

      // Look for date in this block
      const dateMatch = blockText.match(
        /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i
      );
      if (!dateMatch) return;

      const date = parseDate(dateMatch[0]);
      if (!date || date < today) return;

      // Get title from heading
      const heading = block.find('h1, h2, h3, h4, h5').first().text().trim();
      if (!heading || heading.length < 3) return;

      const timeMatch = blockText.match(/(\d{1,2}:\d{2})\s*(?:-\s*\d{1,2}:\d{2})?\s*(am|pm)/i);
      const time = timeMatch ? parseTime(`${timeMatch[1]} ${timeMatch[2]}`) || undefined : undefined;

      const id = generateEventId(heading, date, 'Cold Spring Tavern');
      if (events.some((e) => e.id === id)) return;

      events.push({
        id,
        title: heading,
        description: 'Live music at Cold Spring Tavern',
        date,
        time: time || undefined,
        category: 'art',
        location: 'Santa Barbara',
        venue: 'Cold Spring Tavern',
        externalUrl: URL,
        source: 'cold-spring-tavern',
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

    console.log(`  [ColdSpringTavern] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [ColdSpringTavern] Error - ${msg}`);
    return { source: 'cold-spring-tavern', events: [], error: msg };
  }

  return { source: 'cold-spring-tavern', events };
}
