export interface ScrapedEvent {
  id: string;
  title: string;
  description: string;
  date: string;        // YYYY-MM-DD
  time?: string;       // "7:00 PM"
  category: 'surf' | 'beer' | 'art';
  location: 'Ventura' | 'Santa Barbara' | 'Ojai';
  venue?: string;
  externalUrl?: string;
  instagramHandle?: string;
  source: string;      // Which scraper produced this
}

export interface ScraperResult {
  source: string;
  events: ScrapedEvent[];
  error?: string;
}
