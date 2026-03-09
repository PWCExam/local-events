import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseDate, parseTime, inferCategory } from '../utils.js';

interface PopmenuSite {
  name: string;
  url: string;
  venue: string;
  location: 'Ventura' | 'Santa Barbara' | 'Ojai';
  instagramHandle: string;
}

const POPMENU_SITES: PopmenuSite[] = [
  {
    name: 'Rincon Brewery',
    url: 'https://www.rinconbrewery.com/events',
    venue: 'Rincon Brewery',
    location: 'Ventura',
    instagramHandle: '@rinconbreweryinc',
  },
  {
    name: 'SB Biergarten',
    url: 'https://www.sbbiergarten.com/events',
    venue: 'SB Biergarten',
    location: 'Santa Barbara',
    instagramHandle: '@sbbiergarten',
  },
];

async function scrapePopmenuSite(site: PopmenuSite): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = [];

  try {
    const puppeteerExtra = await import('puppeteer-extra');
    const StealthPlugin = await import('puppeteer-extra-plugin-stealth');

    puppeteerExtra.default.use(StealthPlugin.default());

    const browser = await puppeteerExtra.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 45000 });

      // Wait for Popmenu content to render
      await new Promise((r) => setTimeout(r, 5000));

      const extracted = await page.evaluate(() => {
        const results: { title: string; date: string; time: string; description: string; url: string }[] = [];

        // Popmenu event selectors
        const eventEls = document.querySelectorAll(
          '[class*="event"], [class*="Event"], .pm-event, .pm-card, [data-testid*="event"]'
        );

        eventEls.forEach((el) => {
          const title = (el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]') as HTMLElement)?.innerText?.trim() || '';
          const dateEl = (el.querySelector('[class*="date"], time, [class*="when"]') as HTMLElement);
          const date = dateEl?.innerText?.trim() || dateEl?.getAttribute('datetime') || '';
          const time = (el.querySelector('[class*="time"]') as HTMLElement)?.innerText?.trim() || '';
          const desc = (el.querySelector('[class*="desc"], [class*="detail"], p') as HTMLElement)?.innerText?.trim() || '';
          const link = (el.querySelector('a') as HTMLAnchorElement)?.href || '';

          if (title && title.length > 2 && date) {
            results.push({ title, date, time, description: desc, url: link });
          }
        });

        // Fallback: scan all text for event-like patterns
        if (results.length === 0) {
          const allText = document.body.innerText;
          const lines = allText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}/i.test(line)) {
              // Found a date-like line — check surrounding lines for title
              const prevLine = i > 0 ? lines[i - 1] : '';
              const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

              const title = prevLine.length > 3 && prevLine.length < 100 ? prevLine : nextLine;
              if (title && title.length > 3) {
                results.push({ title, date: line, time: '', description: '', url: '' });
              }
            }
          }
        }

        return results;
      });

      const today = new Date().toISOString().slice(0, 10);

      for (const item of extracted) {
        const date = parseDate(item.date);
        if (!date || date < today || !item.title) continue;

        const time = item.time ? parseTime(item.time) : undefined;

        events.push({
          id: generateEventId(item.title, date, site.venue),
          title: item.title,
          description: item.description || '',
          date,
          time: time || undefined,
          category: inferCategory(site.venue, item.title),
          location: site.location,
          venue: site.venue,
          externalUrl: item.url?.startsWith('http') ? item.url : site.url,
          instagramHandle: site.instagramHandle,
          source: `popmenu-${site.name.toLowerCase().replace(/\s+/g, '-')}`,
        });
      }
    } finally {
      await browser.close();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Popmenu/${site.name}] Error - ${msg}`);
  }

  return events;
}

export async function scrapePopmenuSites(): Promise<ScraperResult> {
  const allEvents: ScrapedEvent[] = [];
  const errors: string[] = [];

  for (const site of POPMENU_SITES) {
    try {
      const events = await scrapePopmenuSite(site);
      allEvents.push(...events);
      console.log(`  [Popmenu/${site.name}] ${events.length} events`);
    } catch (err) {
      const msg = `${site.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(`  [Popmenu/${site.name}] ${msg}`);
    }
  }

  return {
    source: 'popmenu-sites',
    events: allEvents,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}
