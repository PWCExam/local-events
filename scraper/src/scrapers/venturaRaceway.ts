import type { ScrapedEvent, ScraperResult } from '../types.js';
import { generateEventId } from '../utils.js';

/**
 * Ventura Raceway 2026 schedule — parsed from their official PDF at
 * https://venturaraceway.com/wp-content/uploads/2026-Schedule.pdf
 *
 * Gates open at 3 PM, racing at 5:30 PM every Saturday.
 * "OFF NIGHT" dates are excluded.
 */
const SCHEDULE_2026: { date: string; title: string }[] = [
  { date: '2026-03-07', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, Hobby Stocks, IMCA Sport Compacts, VRA Junior Classes' },
  { date: '2026-03-21', title: 'VRA Sprint Cars, California Lightning Sprints, NMRA TQ Midgets, Mini Stocks, Motorcycles' },
  { date: '2026-03-28', title: 'IMCA Modifieds, IMCA Sport Mods, VRA Dwarf Cars, Hobby Stocks, IMCA Sport Compacts, VRA Junior Classes' },
  { date: '2026-04-04', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, IMCA Modifieds, NMRA TQ Midgets, Motorcycles' },
  { date: '2026-04-11', title: 'VRA Dwarf Cars, IMCA Modifieds, VRA Hobby Stocks, IMCA Sport Compacts, VRA Junior Classes, Motorcycles' },
  { date: '2026-04-25', title: 'American Flat Track Motorcycles' },
  { date: '2026-05-02', title: 'USAC/CRA Sprint Cars, USAC Midgets, VRA Hobby Stocks, IMCA Sport Compacts, VRA Junior Classes' },
  { date: '2026-05-09', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, NMRA TQ Midgets, Mini Stocks, VRA Junior Classes' },
  { date: '2026-05-23', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, IMCA Modifieds, IMCA Sport Compacts, Motorcycles' },
  { date: '2026-05-30', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, California Lightning Sprints, NMRA TQ Midgets, Motorcycles' },
  { date: '2026-06-13', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, IMCA Modifieds, California Lightning Sprints, VRA Junior Classes' },
  { date: '2026-06-27', title: 'USCS Sprint Cars, VRA Dwarf Cars, IMCA Sport Compacts, VRA Junior Classes' },
  { date: '2026-07-11', title: 'IMCA Modifieds, IMCA Sport Mods, VRA Dwarf Cars, Hobby Stocks, West Coast Sport Compacts, Demolition Derby #1' },
  { date: '2026-08-29', title: 'USCS Sprint Cars, California Lightning Sprints, WRA Vintage, IMCA Sport Compacts, NMRA TQ Midgets' },
  { date: '2026-09-12', title: 'USAC Midgets, VRA Dwarf Cars, IMCA Sport Compacts, NMRA TQ Midgets, Mini Stocks' },
  { date: '2026-09-19', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, West Coast Sport Compacts, VRA Junior Classes' },
  { date: '2026-09-26', title: 'World of Outlaws, California Lightning Sprints' },
  { date: '2026-10-03', title: 'VRA Sprint Cars, Senior Sprints, VRA Dwarf Cars, VRA Hobby Stocks, IMCA Modifieds, IMCA Sport Mods, Motorcycles' },
  { date: '2026-10-17', title: 'USAC Midgets, VRA Dwarf Cars, VRA Hobby Stocks, IMCA Sport Compacts, NMRA TQ Midgets, VRA Junior Classes' },
  { date: '2026-10-24', title: 'VRA Sprint Cars, Senior Sprints, IMCA Modifieds, California Lightning Sprints, VRA Hobby Stocks, Demolition Derby #2' },
  { date: '2026-11-07', title: 'USCS Sprint Cars, VRA Dwarf Cars, VRA Hobby Stocks, IMCA Sport Compacts, VRA Junior Classes' },
  { date: '2026-11-27', title: '85th Turkey Night Grand Prix — USAC Midgets and Sprint Cars (Day 1)' },
  { date: '2026-11-28', title: '85th Turkey Night Grand Prix — USAC Midgets and Sprint Cars (Day 2)' },
];

export async function scrapeVenturaRaceway(): Promise<ScraperResult> {
  const today = new Date().toISOString().slice(0, 10);

  const events: ScrapedEvent[] = SCHEDULE_2026
    .filter((e) => e.date >= today)
    .map((e) => ({
      id: generateEventId(e.title, e.date, 'Ventura Raceway'),
      title: `Ventura Raceway: ${e.title}`,
      description: 'Gates open at 3 PM, Racing at 5:30 PM. At the Ventura County Fairgrounds.',
      date: e.date,
      time: '5:30 PM',
      category: 'art' as const,
      location: 'Ventura' as const,
      venue: 'Ventura Raceway',
      externalUrl: 'https://venturaraceway.com/printable-schedule/',
      instagramHandle: '@venturaraceway',
      source: 'ventura-raceway',
    }));

  console.log(`  [VenturaRaceway] ${events.length} events`);
  return { source: 'ventura-raceway', events };
}
