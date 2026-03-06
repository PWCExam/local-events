import { LocalEvent } from '@/types/event';
import { v4 as uuidv4 } from 'uuid';

const now = new Date().toISOString();

function e(data: Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>): LocalEvent {
  return { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
}

export const SAMPLE_EVENTS: LocalEvent[] = [
  // === MARCH 2026 ===

  // Ventura Music Hall
  e({ title: 'Last Dinosaurs - Wellness 10YR Anniversary', description: 'With ELMJACK.', date: '2026-03-06', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/last-dinosaurs---wellness-10yr-anniversary-tour' }),
  e({ title: 'The Brothers Comatose', description: 'Live at Ventura Music Hall.', date: '2026-03-07', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-brothers-comatose' }),
  e({ title: 'The Garcia Project', description: 'Grateful Dead tribute.', date: '2026-03-08', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-garcia-project' }),
  e({ title: 'Silversun Pickups - Tenterhooks Tour', description: 'With Pure Hex. SOLD OUT.', date: '2026-03-11', time: '7:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/silversun-pickups---tenterhooks-tour' }),
  e({ title: 'Micro Mania Wrestling', description: 'Live wrestling event.', date: '2026-03-12', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/micro-mania-wrestling' }),
  e({ title: 'cupcakKe', description: 'With DFO.', date: '2026-03-13', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/cupcakke' }),
  e({ title: "It's A 2000s Party: Ventura", description: 'Throwback dance party.', date: '2026-03-14', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/it-s-a-2000s-party-ventura' }),
  e({ title: 'SIPPY', description: 'Electronic/bass.', date: '2026-03-20', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/sippy' }),
  e({ title: 'Ozomatli', description: 'Live at Ventura Music Hall.', date: '2026-03-21', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/ozomatli' }),
  e({ title: 'Eyehategod & Crowbar', description: 'Double bill.', date: '2026-03-27', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/eyehategod-crowbar' }),
  e({ title: 'The Dave Matthews Tribute Band', description: 'Tomorrow We Die Tour.', date: '2026-03-28', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-dave-matthews-tribute-band---tomorrow-we-die-tour' }),

  // SB Bowl
  e({ title: 'Westmont Spring Sing 2026', description: '"That\'s Classic" — annual college competition.', date: '2026-03-28', time: '6:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/' }),

  // Leashless Brewing
  e({ title: 'Wisdom Tree Reggae', description: 'Live reggae at Leashless.', date: '2026-03-06', time: '6:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/6/wisdom-tree-reggae' }),
  e({ title: 'Top Shelf Reggae', description: 'Live at Leashless.', date: '2026-03-07', time: '6:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/7/top-shelf-reggae' }),
  e({ title: 'Chris Murray - Rocksteady Sunday', description: 'Rocksteady afternoon session.', date: '2026-03-08', time: '3:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/8/chris-murray-rocksteady-sunday' }),
  e({ title: "A Pint of Irish - St. Patrick's", description: "St. Patrick's Day celebration.", date: '2026-03-14', time: '1:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/14/a-pint-of-irish' }),
  e({ title: 'ONEPEOPLE', description: 'Live at Leashless.', date: '2026-03-21', time: '6:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/21/onepeople' }),
  e({ title: "Founder's Day with Neon Blonde", description: 'Leashless anniversary celebration.', date: '2026-03-27', time: '6:00 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/27/founders-day-with-neon-blonde' }),
  e({ title: 'Movie Night: The Big Lebowski', description: 'Outdoor movie screening at Leashless.', date: '2026-03-31', time: '5:30 PM', category: 'beer', location: 'Ventura', venue: 'Leashless Brewing', instagramHandle: '@leashlessbrewing', externalUrl: 'https://www.leashlessbrewing.com/event-calendar/2026/3/31/movie-night-the-big-lebowski' }),

  // Ojai Deer Lodge
  e({ title: 'Salty Strings & Josh Bergmann', description: 'Live music. $10.', date: '2026-03-06', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/salty-strings-josh-bergmann-3626-8pm' }),
  e({ title: 'Shaky Feelin', description: 'Live music. $15.', date: '2026-03-07', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/shaky-feeling-3726-8pm' }),
  e({ title: 'Beau Red & the Tailor Maide', description: 'Live music. $15.', date: '2026-03-14', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/beau-red-the-tailor-maide-31426-8pm' }),
  e({ title: 'Pape Crown', description: 'Live music.', date: '2026-03-19', time: '6:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/pape-crown-31926-6pm' }),
  e({ title: 'Little Truck & Bex Morton', description: 'Live music.', date: '2026-03-20', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/little-truck-bex-morton-32026-9pm' }),
  e({ title: "Kelly's Lot", description: 'Live music.', date: '2026-03-22', time: '2:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/kellys-lot-32226-2pm' }),
  e({ title: 'Jayden Secor', description: 'Live music.', date: '2026-03-27', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/jayden-secor-32726-9pm' }),
  e({ title: 'Soul Revival Band', description: 'Live music. $10.', date: '2026-03-28', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/soul-revival-band-32826-9pm' }),

  // OVLC
  e({ title: 'Listers: Birdwatching Film & Excursion', description: 'Film screening Friday, guided birding Saturday.', date: '2026-03-07', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Ventura River Preserve', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/listers-a-glimpse-into-extreme-birdwatching' }),
  e({ title: 'Geology of Ojai - Docent-Led Hike', description: 'Guided hike at Valley View Preserve. Limited space.', date: '2026-03-08', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Valley View Preserve', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/docent-led-hike-at-valley-view-preserve-6x8br-gp5sw-s57ch' }),
  e({ title: 'CA Native Garden Design Workshop', description: 'With Morami Studio. Hands-on workshop.', date: '2026-03-14', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'OVLC', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/ca-native-garden-design-with-morami-studio-edskp-dc4r6-ggz78' }),

  // Bright Spark
  e({ title: "St. Patrick's Day Bash", description: 'Live Irish music, food & drink specials.', date: '2026-03-14', time: '11:00 AM', category: 'beer', location: 'Ventura', venue: 'Bright Spark Brewing', instagramHandle: '@brightsparkbrewing', externalUrl: 'https://www.brightsparkbrewing.com/calendar' }),

  // Island Brewing
  e({ title: 'Teresa Russell - Live', description: 'Live music at Island Brewing.', date: '2026-03-07', time: '6:00 PM', category: 'beer', location: 'Santa Barbara', venue: 'Island Brewing Co', instagramHandle: '@islandbrewingcompany', externalUrl: 'http://www.islandbrewingcompany.com/calendar' }),

  // Bodhi Salt Yoga
  e({ title: 'Bodhi Hikes', description: 'Guided hike with the yoga community.', date: '2026-03-08', time: '10:30 AM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),
  e({ title: 'Somatic Psoas Release', description: 'Somatic bodywork workshop.', date: '2026-03-14', time: '4:30 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),
  e({ title: 'Breath & Sounds Journey', description: 'A return to the body — breathwork & sound healing.', date: '2026-03-15', time: '2:30 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/' }),
  e({ title: 'Reiki-Infused Sound Healing', description: 'Reiki and sound bath experience.', date: '2026-03-21', time: '6:45 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),

  // Lama Dog Taproom
  e({ title: "Brawlin' Betties: Love v. Luck Scrimmage", description: 'Roller derby viewing event.', date: '2026-03-08', time: '6:30 PM', category: 'beer', location: 'Santa Barbara', venue: 'Lama Dog Taproom', instagramHandle: '@lamadogtaproom', externalUrl: 'https://www.lamadog.com/events4calendar' }),
  e({ title: 'Profs at the Pub: Music & AI', description: 'Music Composition & Glitch in the Age of AI with Professor Andrew Watts.', date: '2026-03-11', time: '6:30 PM', category: 'beer', location: 'Santa Barbara', venue: 'Lama Dog Taproom', instagramHandle: '@lamadogtaproom', externalUrl: 'https://www.lamadog.com/events4calendar' }),

  // Third Window Brewing
  e({ title: 'Spring Beer Release & BBQ', description: '$95. Santa Maria-style BBQ with Wagyu, live music, vineyard views at Fess Parker Ranch.', date: '2026-03-29', time: '1:00 PM', category: 'beer', location: 'Santa Barbara', venue: 'Third Window Brewing', instagramHandle: '@thirdwindowbrewing', externalUrl: 'https://thirdwindowbrewing.com/products/spring-release-event' }),

  // Ventura Raceway
  e({ title: 'Season Opener - Sprint Cars', description: 'Opening night of racing.', date: '2026-03-14', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),

  // === APRIL 2026 ===

  // SB Bowl
  e({ title: 'Disclosure', description: 'Special guest: JADALAREIGN. Tickets from $61.', date: '2026-04-07', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/disclosure-2026-04-07/' }),
  e({ title: 'Disclosure (Night 2)', description: 'Special guest: Todd Edwards. Tickets from $74.', date: '2026-04-08', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/disclosure-2026-04-08/' }),
  e({ title: 'David Byrne', description: 'Solo performance. Tickets from $204.', date: '2026-04-14', time: '7:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/david-byrne-2026-04-14/' }),
  e({ title: 'Charlie Puth', description: 'With Daniel Seavey & Ally Salort. Tickets from $71.', date: '2026-04-25', time: '6:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/charlie-puth-2026-04-25/' }),

  // Ventura Music Hall
  e({ title: 'The Menzingers', description: 'With I Am The Avalanche.', date: '2026-04-01', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-menzingers' }),
  e({ title: 'FIA - THE LOVE ME TOUR', description: 'Live at Ventura Music Hall.', date: '2026-04-02', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/fia---the-love-me-tour' }),
  e({ title: 'Snakehips - Always Forever Tour', description: 'Electronic/dance.', date: '2026-04-03', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/snakehips-presents-the-always-forever-tour' }),
  e({ title: 'Circles Around The Sun', description: 'Psychedelic jam.', date: '2026-04-04', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/circles-around-the-sun' }),
  e({ title: 'HOLYWATR', description: 'Live at Ventura Music Hall.', date: '2026-04-06', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/holywatr' }),
  e({ title: 'Aurorawave', description: 'Live at Ventura Music Hall.', date: '2026-04-09', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/aurorawave' }),
  e({ title: 'Paul Thorn with Will Hoge', description: 'Fully seated.', date: '2026-04-10', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/paul-thorn-with-special-guest-will-hoge-fully-seated' }),
  e({ title: 'Rich Kids on LSD', description: 'With Good Riddance, Fourth In Line, Human Issue.', date: '2026-04-11', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/rich-kids-on-lsd' }),
  e({ title: 'YAIMA', description: 'Live at Ventura Music Hall.', date: '2026-04-12', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/yaima' }),
  e({ title: 'Anthony B', description: 'Reggae.', date: '2026-04-15', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/anthony-b' }),
  e({ title: 'Iam Tongi', description: 'All ages show.', date: '2026-04-17', time: '8:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/iam-tongi' }),
  e({ title: 'Pentagram', description: 'Doom metal legends.', date: '2026-04-18', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/pentagram' }),
  e({ title: 'Shakey Graves', description: 'With Jobi Riccio.', date: '2026-04-21', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/shakey-graves' }),
  e({ title: 'Vandelux', description: 'Live at Ventura Music Hall.', date: '2026-04-23', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/vandelux' }),
  e({ title: 'Mike Love', description: 'With Dub FX. Reggae.', date: '2026-04-24', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/mike-love' }),
  e({ title: 'Reggaeton Rave', description: 'Dance party.', date: '2026-04-25', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/reggaeton-rave' }),
  e({ title: 'Zebra: 50th Anniversary Tour', description: 'With Donnie Vie.', date: '2026-04-26', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/zebra-50th-anniversary-tour-with-special-guest-donnie-vie-the-voice-of-enuff-z-nuff-fully-seated' }),

  // Ojai Deer Lodge
  e({ title: 'Lael Neale & Guy Blakeslee', description: '$30. Deer Lodge.', date: '2026-04-02', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/lael-neale-guy-blakeslee-4226-8pm' }),
  e({ title: 'Mild Universe & Theodor', description: '$23. Deer Lodge.', date: '2026-04-03', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/mild-universe-theodor-4326-8pm' }),
  e({ title: 'Habibi', description: '$18. Deer Lodge.', date: '2026-04-08', time: '7:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/habibi-4826-7pm' }),
  e({ title: "Marty O'Reilly", description: '$18. Deer Lodge.', date: '2026-04-12', time: '7:30 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/marty-o-reilly-41226-730pm' }),
  e({ title: 'James Intveld & John Surge', description: 'With The Haymakers. $25.', date: '2026-04-18', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/james-intveld-john-surge-the-haymakers-41826-8pm' }),
  e({ title: 'The Paradise Kings', description: 'Live music.', date: '2026-04-19', time: '2:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/the-paradise-kings-41926-2pm-1' }),
  e({ title: 'Cactus Lee & Austin Leonard Jones', description: 'Live music.', date: '2026-04-26', time: '7:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/cactus-lee-austin-leonard-jones-42626-7pm' }),

  // OVLC
  e({ title: 'Birding & Natural History Walk', description: 'Guided walk at Ojai Meadows Preserve.', date: '2026-04-06', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Ojai Meadows Preserve', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/' }),
  e({ title: 'Wildflower Walk', description: 'Guided wildflower walk at Ojai Meadows.', date: '2026-04-12', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Ojai Meadows Preserve', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/' }),
  e({ title: 'Rewild Ojai Native Garden Tour', description: '3rd Annual. Eleven gardens across Ojai Valley.', date: '2026-04-18', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Ojai Valley', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/rewild-ojai-garden-tour-2026' }),

  // Ventura Raceway
  e({ title: 'USAC/CRA Sprint Cars', description: '2-night non-wing sprint car racing.', date: '2026-04-17', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),
  e({ title: 'American Flat Track - Ventura Short Track', description: 'Round 4 of Progressive AFT Championship.', date: '2026-04-25', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),

  // Bright Spark
  e({ title: 'Easter Keg Hunt Fun Run', description: '3-mile brewery fun run (Bright Spark → Topa Topa → MadeWest → Seaward). Live music after.', date: '2026-04-05', time: '11:30 AM', category: 'beer', location: 'Ventura', venue: 'Bright Spark Brewing', instagramHandle: '@brightsparkbrewing', externalUrl: 'https://www.brightsparkbrewing.com/calendar' }),

  // Bodhi Salt Yoga
  e({ title: 'Restorative Yoga: Watering the Heart', description: 'Deep restorative yoga session.', date: '2026-04-12', time: '2:00 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),
  e({ title: 'Reiki-Infused Sound Healing', description: 'Reiki and sound bath experience.', date: '2026-04-18', time: '6:45 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),

  // === MAY 2026 ===

  // SB Bowl
  e({ title: 'James Taylor & His All-Star Band', description: 'Tickets from $172.', date: '2026-05-06', time: '7:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/james-taylor-2026-05-06/' }),
  e({ title: 'Flight of the Conchords', description: 'Tickets from $78.', date: '2026-05-07', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/flight-of-the-conchords-2026-05-07/' }),

  // Ventura Music Hall
  e({ title: 'Luniz', description: 'Live at Ventura Music Hall.', date: '2026-05-02', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/luniz' }),
  e({ title: 'The Wood Brothers', description: 'Live at Ventura Music Hall.', date: '2026-05-03', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-wood-brothers' }),
  e({ title: 'Chet Faker', description: 'Live at Ventura Music Hall.', date: '2026-05-04', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/chet-faker' }),
  e({ title: 'Creed Fisher', description: 'Country.', date: '2026-05-05', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/creed-fisher' }),
  e({ title: 'Dead Meadow', description: 'Psych rock.', date: '2026-05-08', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/dead-meadow' }),
  e({ title: 'TOPS', description: 'Indie pop.', date: '2026-05-12', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/tops' }),
  e({ title: 'Mickey Avalon', description: 'Live at Ventura Music Hall.', date: '2026-05-15', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/mickey-avalon' }),
  e({ title: 'Son Rompe Pera', description: 'Marimba punk from Mexico City.', date: '2026-05-16', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/son-rompe-pera' }),
  e({ title: 'Unknown Mortal Orchestra', description: 'With elliot & vincent.', date: '2026-05-19', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/unknown-mortal-orchestra-with-elliot-vincent' }),
  e({ title: 'Straight Tequila Night: 90s Country Tribute', description: '90s country party.', date: '2026-05-21', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/straight-tequila-night-90-s-country-tribute' }),
  e({ title: 'Yellowman', description: 'Reggae legend.', date: '2026-05-22', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/yellowman' }),
  e({ title: 'THE MOVEMENT - Visions Tour 2026', description: 'With Bedouin Soundclash & Bikini Trill.', date: '2026-05-23', time: '7:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/the-movement---visions-tour-2026-with-special-guests-bedouin-soundclash-and-bikini-trill' }),
  e({ title: 'Grandaddy - 25th Anniv. Sophtware Slump', description: 'Full album performance.', date: '2026-05-24', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/grandaddy---25th-anniversary-of-sophtware-slump' }),
  e({ title: 'Collie Buddz - Spark Up Tour', description: 'Reggae.', date: '2026-05-27', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/collie-buddz---spark-up-tour' }),
  e({ title: 'Third World', description: 'Reggae legends.', date: '2026-05-29', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/third-world' }),
  e({ title: 'Sun Kil Moon', description: 'Fully seated. Mark Kozelek.', date: '2026-05-30', time: '9:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/sun-kil-moon-fully-seated' }),

  // Ojai Deer Lodge
  e({ title: 'Levitation Room', description: '$27.50. Psych rock.', date: '2026-05-01', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/levitation-room-5126-8pm' }),
  e({ title: 'Virtual Nobodies & Greg in Good Company', description: 'Live music.', date: '2026-05-02', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/virtual-nobodies-greg-in-good-company-5226-8pm' }),
  e({ title: 'Brown Horse', description: '$25. Deer Lodge.', date: '2026-05-03', time: '8:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/brown-horse-5326-8pm' }),
  e({ title: 'Youngtones', description: 'Live music.', date: '2026-05-16', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/youngtones-51626-9pm' }),
  e({ title: 'Swimming Bell, Minor Gold & Breezers', description: 'Triple bill.', date: '2026-05-21', time: '6:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/minor-gold-breezers-swimming-bell-52126-6pm' }),

  // Ventura Raceway
  e({ title: 'USAC/CRA Sprint Cars + Western States Midgets', description: 'Double-header race night.', date: '2026-05-02', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),

  // SB Aquatics
  e({ title: 'Wakatobi International Dive Trip', description: '6 days, unlimited dive access + resort. Indonesia.', date: '2026-05-15', time: '8:00 AM', category: 'surf', location: 'Santa Barbara', venue: 'SB Aquatics', instagramHandle: '@sbaquatics', externalUrl: 'https://santabarbaraaquatics.com/products/wakatobi-indonesia-may-15th-22nd-2026' }),

  // Bodhi Salt Yoga
  e({ title: 'Reiki-Infused Sound Healing', description: 'Reiki and sound bath experience.', date: '2026-05-09', time: '6:45 PM', category: 'art', location: 'Ventura', venue: 'Bodhi Salt Yoga', instagramHandle: '@bodhisaltyoga', externalUrl: 'https://bodhisaltyoga.com/classes' }),

  // === JUNE 2026 ===

  // SB Bowl
  e({ title: 'Lord Huron', description: 'Tickets from $60.', date: '2026-06-02', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/lord-huron-2026-06-02/' }),
  e({ title: 'The Black Keys', description: 'With Fai Laci. Tickets from $100.', date: '2026-06-13', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/the-black-keys-2026-06-13/' }),

  // Ventura Music Hall
  e({ title: "Juvenile's Boiling Point Album Release Tour", description: 'With the 400 Degreez Band.', date: '2026-06-03', time: '8:00 PM', category: 'art', location: 'Ventura', venue: 'Ventura Music Hall', instagramHandle: '@venturamusichall', externalUrl: 'https://venturamusichall.com/shows/juvenile-s-boiling-point-album-release-tour-with-the-400-degreez-band' }),

  // Ojai Deer Lodge
  e({ title: 'SLO County Stumblers', description: '$10. Deer Lodge.', date: '2026-06-06', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/slo-county-stumblers-6626-9pm' }),
  e({ title: 'The Soda Crackers', description: '$10. Deer Lodge.', date: '2026-06-20', time: '9:00 PM', category: 'art', location: 'Ojai', venue: 'Deer Lodge', instagramHandle: '@ojaideerlodge', externalUrl: 'https://www.deerlodgeojai.com/live-music/the-soda-crackers-62026-9pm' }),

  // OVLC
  e({ title: 'Wills Canyon & El Nido Meadow Exploration', description: 'Guided hike at Ventura River Preserve.', date: '2026-06-18', time: '9:00 AM', category: 'art', location: 'Ojai', venue: 'Ventura River Preserve', instagramHandle: '@ojaivalleylandconservancy', externalUrl: 'https://ovlc.org/events/' }),

  // SB Aquatics
  e({ title: 'Farnsworth Bank Dive Trip', description: 'Quarterly dive trip to Catalina.', date: '2026-06-20', time: '6:00 AM', category: 'surf', location: 'Santa Barbara', venue: 'SB Aquatics', instagramHandle: '@sbaquatics', externalUrl: 'https://santabarbaraaquatics.com/products/sb-dive-team' }),

  // === JULY 2026 ===

  // SB Bowl
  e({ title: 'Gabriel "Fluffy" Iglesias', description: 'Comedy. Tickets from $70.', date: '2026-07-17', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/gabriel-fluffy-iglesias-2026-07-17/' }),
  e({ title: 'Young the Giant', description: 'With Cold War Kids & KennyHoopla. Tickets from $65.', date: '2026-07-18', time: '6:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/young-the-giant-2026-07-18/' }),
  e({ title: 'Rainbow Kitten Surprise', description: 'Tickets from $80.', date: '2026-07-19', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/rainbow-kitten-surprise-2026-07-19/' }),

  // === AUGUST 2026 ===

  // SB Bowl
  e({ title: 'Trevor Noah (Night 1)', description: 'Comedy. Tickets from $63.', date: '2026-08-01', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/trevor-noah-2026-08-01/' }),
  e({ title: 'Trevor Noah (Night 2)', description: 'Comedy. Tickets from $65.', date: '2026-08-02', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/trevor-noah-2026-08-02/' }),
  e({ title: 'Sierra Ferrell', description: 'Tickets from $66.', date: '2026-08-06', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/sierra-ferrell-2026-08-06/' }),
  e({ title: 'Tedeschi Trucks Band', description: 'With Lukas Nelson. Tickets from $69.', date: '2026-08-13', time: '6:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/tedeschi-trucks-band-2026-08-13/' }),
  e({ title: 'Train', description: 'With Barenaked Ladies & Matt Nathanson. Tickets from $134.', date: '2026-08-22', time: '6:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/train-2026-08-22/' }),

  // === SEPTEMBER 2026 ===

  // SB Bowl
  e({ title: 'Earth, Wind & Fire', description: 'Tickets from $164.', date: '2026-09-18', time: '7:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/earth-wind-fire-2026-09-18/' }),
  e({ title: 'Freya Skye', description: 'Live at the Bowl.', date: '2026-09-19', time: '7:00 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/freya-skye-2026-09-19/' }),

  // Ventura Raceway
  e({ title: 'USAC Western States Midgets', description: 'Midget racing.', date: '2026-09-12', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),
  e({ title: 'World of Outlaws - Battle on the Beach', description: 'WoO debut at Ventura Raceway. Sprint cars.', date: '2026-09-26', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),

  // SB Aquatics
  e({ title: 'Oil Rigs Dive Trip', description: 'Quarterly dive trip off Long Beach.', date: '2026-09-12', time: '6:00 AM', category: 'surf', location: 'Santa Barbara', venue: 'SB Aquatics', instagramHandle: '@sbaquatics', externalUrl: 'https://santabarbaraaquatics.com/products/sb-dive-team' }),

  // === OCTOBER 2026 ===

  // SB Bowl
  e({ title: 'Jack Johnson (Night 1)', description: 'Tickets from $250.', date: '2026-10-03', time: '6:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/jack-johnson-2026-10-03/' }),
  e({ title: 'Jack Johnson (Night 2)', description: 'Tickets from $181.', date: '2026-10-04', time: '6:30 PM', category: 'art', location: 'Santa Barbara', venue: 'Santa Barbara Bowl', instagramHandle: '@sbbowl', externalUrl: 'https://sbbowl.com/concerts/jack-johnson-2026-10-04/' }),

  // Ventura Raceway
  e({ title: '59th Western World Championships', description: 'USAC/CRA Sprint Cars premier event. 2 nights.', date: '2026-10-23', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),

  // === NOVEMBER 2026 ===

  // Ventura Raceway
  e({ title: '82nd Turkey Night Grand Prix', description: 'Historic Thanksgiving race tradition.', date: '2026-11-25', time: '5:30 PM', category: 'art', location: 'Ventura', venue: 'Ventura Raceway', instagramHandle: '@venturaraceway', externalUrl: 'https://venturaraceway.com/printable-schedule/' }),
];
