import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, inferLocation, inferCategory } from '../utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Bandsintown artist events API (free tier — artist-based, not location-based)
// Use js_ prefix for app_id (confirmed working)
const API_BASE = 'https://rest.bandsintown.com/artists';
const APP_ID = 'js_local';

// Cities we consider "in our area"
const LOCAL_CITIES = new Set([
  'ventura', 'santa barbara', 'ojai', 'oxnard', 'carpinteria',
  'goleta', 'montecito', 'summerland', 'isla vista',
]);

// Curated seed list — artists known to tour through the 805 area
const SEED_ARTISTS = [
  // Recent / upcoming at Ventura Music Hall
  'Silversun Pickups', 'Ozomatli', 'The Menzingers', 'Shakey Graves',
  'Chet Faker', 'The Wood Brothers', 'Dead Meadow', 'Circles Around The Sun',
  'Pentagram', 'Mike Love', 'Iam Tongi', 'cupcakKe', 'SIPPY', 'Snakehips',
  'Rich Kids on LSD', 'YAIMA', 'Anthony B', 'Vandelux', 'Luniz',
  'Creed Fisher', 'Paul Thorn', 'Will Hoge', 'HOLYWATR', 'Aurorawave',
  'Eyehategod', 'Crowbar',
  // SB Bowl headliners
  'Disclosure', 'David Byrne', 'Charlie Puth', 'James Taylor',
  'Flight of the Conchords', 'Lord Huron', 'The Black Keys',
  'Young The Giant', 'Rainbow Kitten Surprise', 'Trevor Noah',
  'Sierra Ferrell', 'Tedeschi Trucks Band',
  // Deer Lodge / Ojai regulars
  'Beau Red', 'Kelly\'s Lot', 'Jayden Secor',
  // Regional touring acts that frequent the 805
  'Rebelution', 'Slightly Stoopid', 'Stick Figure', 'Sublime with Rome',
  'The Expendables', 'Pepper', 'Iration', 'Dirty Heads', 'Switchfoot',
  'Jack Johnson', 'Donavon Frankenreiter', 'G. Love',
  'Collie Buddz', 'SOJA', 'Tribal Seeds', 'The Green',
  'Thievery Corporation', 'Trombone Shorty', 'Galactic',
  'Steel Pulse', 'Toots and the Maytals', 'Ziggy Marley',
  'Ben Harper', 'Jack White', 'The Lumineers', 'Caamp',
  'Hozier', 'Vance Joy', 'Mt. Joy', 'Trampled by Turtles',
  'Tyler Childers', 'Zach Bryan', 'Turnpike Troubadours',
  'Jason Isbell', 'Sturgill Simpson', 'Nathaniel Rateliff',
  'Modest Mouse', 'Built to Spill', 'Dinosaur Jr.', 'Guided by Voices',
  'Jeff Tweedy', 'Wilco', 'My Morning Jacket',
  'Khruangbin', 'Tash Sultana', 'Kaleo', 'Portugal. The Man',
  'Glass Animals', 'Cage The Elephant', 'Foster The People',
  'Local Natives', 'Cold War Kids', 'Grouplove', 'Young the Giant',
  'Bleachers', 'COIN', 'Peach Pit', 'Wallows',
  'Mac DeMarco', 'King Gizzard', 'Ty Segall', 'Oh Sees',
  'Chicano Batman', 'The Marias', 'Inner Wave',
  'Pinegrove', 'Soccer Mommy', 'Snail Mail', 'Japanese Breakfast',
  'Phoebe Bridgers', 'Boygenius', 'Lucy Dacus', 'Julien Baker',
];

interface BandsintownEvent {
  id: string;
  url: string;
  datetime: string;
  title: string;
  description: string;
  artist: { name: string };
  venue: {
    name: string;
    location: string;
    city: string;
    region: string;
    country: string;
  };
  lineup: string[];
  offers: { url: string; status: string; type: string }[];
  starts_at: string;
}

/** Extract artist names from the previous scrape's music-venue events */
function getArtistNamesFromPreviousScrape(): string[] {
  try {
    const path = resolve(__dirname, '../../../src/lib/scrapedEvents.json');
    const data = JSON.parse(readFileSync(path, 'utf-8')) as ScrapedEvent[];

    const musicSources = ['ventura-music-hall', 'sbbowl', 'deer-lodge'];
    const artists: string[] = [];

    for (const event of data) {
      if (!musicSources.some((s) => event.source.includes(s))) continue;

      let name = event.title.trim();
      // Strip tour name suffixes like "Artist - Tour Name"
      name = name.replace(/\s*[-–—]\s.*$/, '');
      // Strip "w/ opener" or "with special guest"
      name = name.replace(/\s*(?:w\/|with\s).*$/i, '');
      // Strip "| Fully Seated" etc.
      name = name.replace(/\s*\|.*$/, '');
      name = name.trim();

      if (name.length > 2 && name.length < 80) {
        artists.push(name);
      }
    }

    return artists;
  } catch {
    return [];
  }
}

/** Fetch upcoming events for a single artist */
async function fetchArtistEvents(artistName: string): Promise<BandsintownEvent[]> {
  try {
    const encoded = encodeURIComponent(artistName);
    const url = `${API_BASE}/${encoded}/events?app_id=${APP_ID}&date=upcoming`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

/** Small delay to avoid hammering the API */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function scrapeBandsintown(): Promise<ScraperResult> {
  const events: ScrapedEvent[] = [];

  try {
    const today = new Date().toISOString().slice(0, 10);

    // Build artist list: seed + dynamic from previous scrape
    const dynamicArtists = getArtistNamesFromPreviousScrape();
    const allArtists = [...new Set([...SEED_ARTISTS, ...dynamicArtists])];

    console.log(`  [Bandsintown] Querying ${allArtists.length} artists...`);

    // Query artists in batches of 5 with small delays
    const BATCH_SIZE = 5;
    const DELAY_MS = 200;

    for (let i = 0; i < allArtists.length; i += BATCH_SIZE) {
      const batch = allArtists.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(fetchArtistEvents));

      for (const artistEvents of batchResults) {
        for (const evt of artistEvents) {
          const venueCity = evt.venue?.city || '';
          const venueRegion = evt.venue?.region || '';

          // Only include events in our area
          if (venueRegion && venueRegion !== 'CA') continue;
          if (!LOCAL_CITIES.has(venueCity.toLowerCase())) continue;

          const date = evt.datetime?.slice(0, 10) || evt.starts_at?.slice(0, 10) || '';
          if (!date || date < today) continue;

          // Extract time
          let time: string | undefined;
          const raw = evt.datetime || evt.starts_at || '';
          const timeMatch = raw.match(/T(\d{2}):(\d{2})/);
          if (timeMatch) {
            const h = parseInt(timeMatch[1]);
            const m = timeMatch[2];
            // Skip midnight placeholder times
            if (h !== 0 || m !== '00') {
              const period = h >= 12 ? 'PM' : 'AM';
              const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
              time = `${hour12}:${m} ${period}`;
            }
          }

          const artistName = evt.artist?.name || '';
          let venueName = evt.venue?.name || '';

          // Normalize known venue names
          const venueLower = venueName.toLowerCase();
          if (venueLower.includes('ventura music hall')) venueName = 'Ventura Music Hall';
          else if (venueLower.includes('majestic ventura') || venueLower.includes('ventura theater')) venueName = 'Majestic Ventura Theater';
          else if (venueLower.includes('santa barbara bowl') || venueLower.includes('sb bowl')) venueName = 'Santa Barbara Bowl';
          else if (venueLower.includes('deer lodge')) venueName = 'Deer Lodge';
          else if (venueLower.includes('lobero')) venueName = 'Lobero Theatre';
          else if (venueLower.includes('soho') && venueLower.includes('music')) venueName = 'SOhO Restaurant & Music Club';

          const lineup = evt.lineup?.length > 1 ? evt.lineup.join(', ') : '';
          const title = lineup || artistName || evt.title || '';

          if (!title || title.length < 2) continue;

          // Skip events where the "venue" is actually the event title (festival placeholders)
          if (venueName === title) venueName = '';

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
      }

      // Rate-limit between batches
      if (i + BATCH_SIZE < allArtists.length) {
        await sleep(DELAY_MS);
      }
    }

    // Dedupe by event ID (same show from different artist queries)
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
