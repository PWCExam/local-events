import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId, parseTime } from '../utils.js';
import { format } from 'date-fns';

interface ECAWidget {
  name: string;
  widgetUuid: string;
  accountId: number;
  venue: string;
  location: 'Ventura' | 'Santa Barbara' | 'Ojai';
  instagramHandle?: string;
}

const WIDGETS: ECAWidget[] = [
  {
    name: 'Topa Topa Ventura',
    widgetUuid: '7e3b29ec-7b56-4807-8262-f6088b1dd182',
    accountId: 7998,
    venue: 'Topa Topa Brewing - Ventura',
    location: 'Ventura',
    instagramHandle: '@topatopabrewingco',
  },
  {
    name: 'Topa Topa Santa Barbara',
    widgetUuid: 'eb334f5a-869b-44ef-946a-485ac71d51cb',
    accountId: 7998,
    venue: 'Topa Topa Brewing - Santa Barbara',
    location: 'Santa Barbara',
    instagramHandle: '@topatopabrewingco',
  },
  {
    name: 'Topa Topa Ojai',
    widgetUuid: '91f31c6c-63fa-429e-af96-d5e9ef6333b2',
    accountId: 7998,
    venue: 'Topa Topa Brewing - Ojai',
    location: 'Ojai',
    instagramHandle: '@topatopabrewingco',
  },
  {
    name: 'MadeWest',
    widgetUuid: 'bc6303ee-50a8-4233-9d60-431b784c7ecf',
    accountId: 3051,
    venue: 'MadeWest Brewing',
    location: 'Ventura',
    instagramHandle: '@madewestbeer',
  },
];

interface ECAEvent {
  summary?: string;
  description?: string;
  timezoneStart?: string;  // "2026-03-13T18:00:00"
  timezoneEnd?: string;
  utcStartTime?: number;
  ticketsLink?: string;
  location?: { description?: string };
}

interface ECAResponse {
  events?: ECAEvent[];
  pages?: { current: number; total: number; nextPage?: string; previousPage?: string };
}

async function fetchFutureEvents(widget: ECAWidget): Promise<ECAEvent[]> {
  // First, fetch page 1 to discover total pages
  const firstUrl = `https://api.eventcalendarapp.com/events?id=${widget.accountId}&widgetUuid=${widget.widgetUuid}&page=1`;
  const firstRes = await fetch(firstUrl, { headers: { 'Accept': 'application/json' } });
  if (!firstRes.ok) throw new Error(`API returned ${firstRes.status} for ${widget.name}`);
  const firstData: ECAResponse = await firstRes.json();
  const totalPages = firstData.pages?.total || 1;

  // Events are sorted chronologically — future events are on later pages.
  // Start from the last page and work backwards to collect future events.
  const today = format(new Date(), 'yyyy-MM-dd');
  const allEvents: ECAEvent[] = [];
  let foundPastEvent = false;

  for (let page = totalPages; page >= 1 && !foundPastEvent; page--) {
    let data: ECAResponse;
    if (page === 1) {
      // Reuse the first page we already fetched
      data = firstData;
    } else {
      const url = `https://api.eventcalendarapp.com/events?id=${widget.accountId}&widgetUuid=${widget.widgetUuid}&page=${page}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) continue;
      data = await res.json();
    }

    const events = data.events || [];
    for (const event of events) {
      const eventDate = event.timezoneStart?.slice(0, 10);
      if (eventDate && eventDate >= today) {
        allEvents.push(event);
      } else if (eventDate && eventDate < today) {
        foundPastEvent = true;
      }
    }
  }

  return allEvents;
}

async function scrapeWidget(widget: ECAWidget): Promise<ScrapedEvent[]> {
  const rawEvents = await fetchFutureEvents(widget);
  const events: ScrapedEvent[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');

  for (const raw of rawEvents) {
    const title = raw.summary || '';
    if (!title) continue;

    // Parse date from timezoneStart (e.g. "2026-03-13T18:00:00")
    let date: string | null = null;
    let time: string | undefined;

    if (raw.timezoneStart) {
      date = raw.timezoneStart.slice(0, 10); // "2026-03-13"
      const timePart = raw.timezoneStart.slice(11, 16); // "18:00"
      time = timePart ? parseTime(timePart) || undefined : undefined;
    } else if (raw.utcStartTime) {
      const d = new Date(raw.utcStartTime * 1000);
      date = format(d, 'yyyy-MM-dd');
      time = format(d, 'h:mm a');
    }

    if (!date || date < today) continue;

    events.push({
      id: generateEventId(title, date, widget.venue),
      title,
      description: (raw.description || '').replace(/<[^>]*>/g, '').trim().slice(0, 300),
      date,
      time,
      category: 'beer',
      location: widget.location,
      venue: widget.venue,
      externalUrl: raw.ticketsLink || 'https://topatopa.beer/pages/happenings',
      instagramHandle: widget.instagramHandle,
      source: `eventcalendarapp-${widget.name.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }

  return events;
}

export async function scrapeEventCalendarApp(): Promise<ScraperResult> {
  const allEvents: ScrapedEvent[] = [];
  const errors: string[] = [];

  for (const widget of WIDGETS) {
    try {
      const events = await scrapeWidget(widget);
      allEvents.push(...events);
      console.log(`  [EventCalendarApp] ${widget.name}: ${events.length} events`);
    } catch (err) {
      const msg = `${widget.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(`  [EventCalendarApp] Error - ${msg}`);
    }
  }

  return {
    source: 'eventcalendarapp',
    events: allEvents,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}
