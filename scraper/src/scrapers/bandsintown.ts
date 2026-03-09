import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, inferLocation, inferCategory } from '../utils.js';

// Bandsintown REST API — search by venue location
// API docs: https://www.bandsintown.com/api
const APP_ID = 'squarespace';

// Key 805 area venues on Bandsintown
const VENUE_CITIES = [
  { city: 'Ventura', region: 'CA' },
  { city: 'Santa Barbara', region: 'CA' },
  { city: 'Ojai', region: 'CA' },
  { city: 'Oxnard', region: 'CA' },
  { city: 'Carpinteria', region: 'CA' },
  { city: 'Goleta', region: 'CA' },
];

// Well-known artists that play in the 805 — scrape their events
// (Bandsintown API is artist-based, not location-based)
const AREA_VENUES = [
  'Ventura Music Hall',
  'Ventura Theater',
  'Majestic Ventura Theater',
  'Santa Barbara Bowl',
  'Lobero Theatre',
  'SOhO Restaurant and Music Club',
  'Velvet Jones',
  'EOS Lounge',
  'Cold Spring Tavern',
  'Deer Lodge',
  'The Canyon',
  'Discovery Ventura',
  'Topa Topa Brewing',
  'Leashless Brewing',
  'MadeWest Brewing',
];

interface BandsintownEvent {
  id: string;
  url: string;
  datetime: string;
  title: string;
  description: string;
  artist: {
    name: string;
    image_url: string;
  };
  venue: {
    name: string;
    location: string;
    city: string;
    region: string;
    country: string;
  };
  lineup: string[];
  offers: { url: string; status: string }[];
}

async function fetchCityPage(city: string): Promise<BandsintownEvent[]> {
  try {
    const slug = city.toLowerCase().replace(/\s+/g, '-');
    const url = `https://www.bandsintown.com/c/${slug}-ca`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    if (!res.ok) return [];
    const html = await res.text();

    // Extract __NEXT_DATA__ JSON from Bandsintown (Next.js app)
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
    if (!nextDataMatch) return [];

    const nextData = JSON.parse(nextDataMatch[1]);
    const events: BandsintownEvent[] = [];

    // Navigate the Next.js data structure to find events
    const pageProps = nextData?.props?.pageProps;
    if (!pageProps) return [];

    // Try different data shapes
    const eventList = pageProps.events || pageProps.initialEvents || pageProps.eventsData?.events || [];

    for (const evt of eventList) {
      if (evt.datetime && evt.venue) {
        events.push(evt);
      }
    }

    return events;
  } catch {
    return [];
  }
}

export async function scrapeBandsintown(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const today = new Date().toISOString().slice(0, 10);

    // Fetch city pages to find events
    const allBitEvents: BandsintownEvent[] = [];

    for (const { city } of VENUE_CITIES) {
      const cityEvents = await fetchCityPage(city);
      allBitEvents.push(...cityEvents);
    }

    // Process events
    for (const evt of allBitEvents) {
      const venueName = evt.venue?.name || '';
      const venueCity = evt.venue?.city || '';
      const venueRegion = evt.venue?.region || '';

      // Only include CA events
      if (venueRegion && venueRegion !== 'CA') continue;

      // Check if venue is in our area
      const isInArea = AREA_VENUES.some((v) => venueName.toLowerCase().includes(v.toLowerCase())) ||
        VENUE_CITIES.some((c) => venueCity.toLowerCase() === c.city.toLowerCase());

      if (!isInArea) continue;

      const date = evt.datetime ? evt.datetime.slice(0, 10) : null;
      if (!date || date < today) continue;

      // Extract time
      let time: string | undefined;
      const timeMatch = evt.datetime.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        const h = parseInt(timeMatch[1]);
        const m = timeMatch[2];
        if (h !== 0 || m !== '00') {
          const period = h >= 12 ? 'PM' : 'AM';
          const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
          time = `${hour12}:${m} ${period}`;
        }
      }

      const artistName = evt.artist?.name || evt.lineup?.join(', ') || evt.title || '';
      const title = artistName || venueName;

      if (!title || title.length < 2) continue;

      const location = inferLocation(`${venueCity} ${venueName}`);
      const category = inferCategory(venueName, title);
      const ticketUrl = evt.offers?.find((o) => o.status === 'available')?.url || evt.url;

      events.push({
        id: generateEventId(title, date, venueName || 'bandsintown'),
        title,
        description: venueName ? `at ${venueName}` : '',
        date,
        time,
        category,
        location,
        venue: venueName || undefined,
        externalUrl: ticketUrl || evt.url,
        source: 'bandsintown',
      });
    }

    // Dedupe
    const seen = new Set<string>();
    const unique = events.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    events.length = 0;
    events.push(...unique);

    console.log(`  [Bandsintown] ${events.length} events`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  [Bandsintown] Error - ${msg}`);
    return { source: 'bandsintown', events: [], error: msg };
  }

  return { source: 'bandsintown', events };
}
