import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scrapeEventCalendarApp } from './scrapers/eventCalendarApp.js';
import { scrapeVenturaMusichall } from './scrapers/venturaMusichall.js';
import { scrapeDeerLodge } from './scrapers/deerLodge.js';
import { scrapeLeashless } from './scrapers/leashless.js';
import { scrapeOVLC } from './scrapers/ovlc.js';
import { scrapeSBBowl } from './scrapers/sbbowl.js';
import { scrapeBellringer } from './scrapers/bellringer.js';
import { scrapeWixSites } from './scrapers/wixSites.js';
import { scrapeIslandBrewing } from './scrapers/islandBrewing.js';
import { scrapeBrightSpark } from './scrapers/brightSpark.js';
import { scrapeThirdWindow } from './scrapers/thirdWindow.js';
import { scrapeVenturaRaceway } from './scrapers/venturaRaceway.js';
import { scrapeCalendar805 } from './scrapers/calendar805.js';
import { scrapeEventbrite } from './scrapers/eventbrite.js';
import { scrapeBandsintown } from './scrapers/bandsintown.js';
import { scrapePopmenuSites } from './scrapers/popmenuSites.js';
import { dedupeEvents, filterFutureEvents, isOnTopic } from './utils.js';
import type { ScraperResult } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../../src/lib/scrapedEvents.json');

async function main() {
  console.log('Starting event scrape...\n');
  const startTime = Date.now();

  // Run all scrapers concurrently — failures are isolated
  const results = await Promise.allSettled<ScraperResult>([
    scrapeEventCalendarApp(),
    scrapeVenturaMusichall(),
    scrapeDeerLodge(),
    scrapeLeashless(),
    scrapeOVLC(),
    scrapeSBBowl(),
    scrapeBellringer(),
    scrapeWixSites(),
    scrapeIslandBrewing(),
    scrapeBrightSpark(),
    scrapeThirdWindow(),
    scrapeVenturaRaceway(),
    scrapeCalendar805(),
    scrapeEventbrite(),
    scrapeBandsintown(),
    scrapePopmenuSites(),
  ]);

  // Collect all events
  const allEvents = results.flatMap((r) => {
    if (r.status === 'fulfilled') return r.value.events;
    console.error(`Scraper rejected: ${r.reason}`);
    return [];
  });

  // Dedupe, filter to on-topic + future events only
  const dedupedEvents = dedupeEvents(allEvents);
  const onTopicEvents = dedupedEvents.filter(isOnTopic);
  const futureEvents = filterFutureEvents(onTopicEvents);

  // Sort by date
  futureEvents.sort((a, b) => a.date.localeCompare(b.date));

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(futureEvents, null, 2));

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n--- Scrape Summary ---');
  console.log(`Total events scraped: ${allEvents.length}`);
  console.log(`After dedup: ${dedupedEvents.length}`);
  console.log(`On-topic: ${onTopicEvents.length}`);
  console.log(`Future events written: ${futureEvents.length}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Time: ${elapsed}s`);

  // Report errors
  const errors = results
    .filter((r): r is PromiseFulfilledResult<ScraperResult> => r.status === 'fulfilled' && !!r.value.error)
    .map((r) => `  ${r.value.source}: ${r.value.error}`);

  const rejections = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => `  rejected: ${r.reason}`);

  if (errors.length > 0 || rejections.length > 0) {
    console.log('\nPartial errors (non-fatal):');
    errors.forEach((e) => console.log(e));
    rejections.forEach((e) => console.log(e));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
