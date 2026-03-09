import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime } from '../utils.js';

interface WixSite {
  name: string;
  url: string;
  venue: string;
  location: 'Ventura' | 'Santa Barbara' | 'Ojai';
  instagramHandle: string;
}

const WIX_SITES: WixSite[] = [
  {
    name: 'Seaward Brewing',
    url: 'https://www.seawardbrewing.com/upcoming-events',
    venue: 'Seaward Brewing',
    location: 'Ventura',
    instagramHandle: '@seawardbrewing',
  },
  {
    name: 'Fig Mountain Brew',
    url: 'https://www.figmtnbrew.com/events',
    venue: 'Fig Mountain Brewing',
    location: 'Santa Barbara',
    instagramHandle: '@figmtnbrewsb',
  },
];

async function scrapeWixSite(site: WixSite): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];

  try {
    // Puppeteer import — only loaded if this scraper runs
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      await page.goto(site.url, { waitUntil: 'networkidle0', timeout: 45000 });

      // Wix Events widgets load lazily — wait for event-related elements
      await page.waitForFunction(
        () => {
          const hasEvents = document.querySelectorAll('[data-hook="ev-rsvp-button"], [data-hook="event-list-item"], [class*="event-card"], [class*="eventTitle"]').length > 0;
          const hasText = document.body.innerText.length > 500;
          return hasEvents || hasText;
        },
        { timeout: 15000 }
      ).catch(() => {});

      // Extra wait for Wix hydration
      await new Promise((r) => setTimeout(r, 3000));

      // Extract events from the page
      const extracted = await page.evaluate(() => {
        const results: { title: string; date: string; time: string; url: string }[] = [];

        // Try common Wix event selectors
        const eventElements = document.querySelectorAll(
          '[data-hook="event-list-item"], .event-item, [class*="event"], .wixui-repeater__item'
        );

        eventElements.forEach((el) => {
          const titleEl = el.querySelector('h2, h3, [data-hook="title"], [class*="title"]');
          const dateEl = el.querySelector('[data-hook="date"], [class*="date"], time');
          const timeEl = el.querySelector('[data-hook="time"], [class*="time"]');
          const linkEl = el.querySelector('a');

          const title = titleEl?.textContent?.trim() || '';
          const date = dateEl?.textContent?.trim() || dateEl?.getAttribute('datetime') || '';
          const time = timeEl?.textContent?.trim() || '';
          const url = linkEl?.getAttribute('href') || '';

          if (title && title.length > 2) {
            results.push({ title, date, time, url });
          }
        });

        // Fallback: look for structured text patterns
        if (results.length === 0) {
          const allText = document.body.innerText;
          const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          // Group consecutive lines that might be event info
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];
            // Check if this line looks like a date
            if (/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(line)) {
              const nextLine = lines[i + 1] || '';
              if (nextLine.length > 3 && nextLine.length < 200) {
                results.push({
                  title: nextLine,
                  date: line,
                  time: lines[i + 2] || '',
                  url: '',
                });
              }
            }
          }
        }

        return results;
      });

      for (const item of extracted) {
        const date = parseDate(item.date);
        if (!date || !item.title) continue;

        const time = item.time ? parseTime(item.time) : undefined;
        const eventUrl = item.url?.startsWith('http') ? item.url : site.url;

        events.push({
          id: generateEventId(item.title, date, site.venue),
          title: item.title,
          description: '',
          date,
          time: time || undefined,
          category: 'beer',
          location: site.location,
          venue: site.venue,
          externalUrl: eventUrl,
          instagramHandle: site.instagramHandle,
          source: `wix-${site.name.toLowerCase().replace(/\s+/g, '-')}`,
        });
      }
    } finally {
      await browser.close();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Wix/${site.name}] Error - ${msg}`);
  }

  return events;
}

export async function scrapeWixSites(): Promise<ScraperResult> {
  const allEvents: ScrapedEvent[] = [];
  const errors: string[] = [];

  for (const site of WIX_SITES) {
    try {
      const events = await scrapeWixSite(site);
      allEvents.push(...events);
      console.log(`  [Wix/${site.name}] ${events.length} events`);
    } catch (err) {
      const msg = `${site.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
    }
  }

  return {
    source: 'wix-sites',
    events: allEvents,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}
