export type EventCategory = 'surf' | 'beer' | 'art';
export type EventLocation = 'Ventura' | 'Santa Barbara' | 'Ojai';

export interface LocalEvent {
  id: string;
  title: string;
  description: string;
  date: string;            // YYYY-MM-DD
  time?: string;           // "7:00 PM"
  category: EventCategory;
  location: EventLocation;
  venue?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  externalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES: { value: EventCategory; label: string; color: string; dotColor: string }[] = [
  { value: 'surf', label: 'Surf', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  { value: 'beer', label: 'Beer', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' },
  { value: 'art', label: 'Art', color: 'bg-teal-100 text-teal-700', dotColor: 'bg-teal-500' },
];

export const LOCATIONS: EventLocation[] = ['Ventura', 'Santa Barbara', 'Ojai'];

export interface InstagramAccount {
  handle: string;
  category: EventCategory;
  eventsUrl?: string;
}

export const INSTAGRAM_ACCOUNTS: InstagramAccount[] = [
  { handle: '@revolution1996', category: 'surf' },
  { handle: '@islandbrewingcompany', category: 'beer', eventsUrl: 'http://www.islandbrewingcompany.com/calendar' },
  { handle: '@tentigersventura', category: 'beer' },
  { handle: '@ventura_surf_shop', category: 'surf' },
  { handle: '@prospectroasters', category: 'beer', eventsUrl: 'https://www.prospectcoffee.com/' },
  { handle: '@madewestbeer', category: 'beer', eventsUrl: 'https://madewest.com/pages/calendar' },
  { handle: '@socialtapventura', category: 'beer', eventsUrl: 'https://socialtapventuraca.com/' },
  { handle: '@mspecialbrewco', category: 'beer', eventsUrl: 'https://mspecialbrewco.com/' },
  { handle: '@vcbcbeer', category: 'beer' },
  { handle: '@mollusksantabarbara', category: 'surf', eventsUrl: 'https://mollusksurfshop.com/santa-barbara' },
  { handle: '@thesaloonvta', category: 'beer', eventsUrl: 'https://www.thesaloonvta.com/events' },
  { handle: '@palmandboy', category: 'beer', eventsUrl: 'https://www.palmandboycoffee.com/' },
  { handle: '@ojaivalleylandconservancy', category: 'art', eventsUrl: 'https://ovlc.org/events/' },
  { handle: '@venturaraceway', category: 'art', eventsUrl: 'https://venturaraceway.com/printable-schedule/' },
  { handle: '@venturamusichall', category: 'art', eventsUrl: 'https://venturamusichall.com/events' },
  { handle: '@ojaideerlodge', category: 'art', eventsUrl: 'https://www.deerlodgeojai.com/live-music' },
  { handle: '@ironandresin', category: 'surf', eventsUrl: 'https://ironandresin.com/' },
  { handle: '@chapter11.tv', category: 'surf', eventsUrl: 'https://chapter11.tv/' },
  { handle: '@patagoniavta', category: 'surf', eventsUrl: 'https://linktr.ee/patagoniavta' },
  { handle: '@blue_tuna_spearfishing', category: 'surf' },
  { handle: '@cisurfboards_sbstore', category: 'surf', eventsUrl: 'https://cisurfboards.com/' },
  { handle: '@buddys_wine_ventura', category: 'beer', eventsUrl: 'https://www.buddyswinebar.com/' },
  { handle: '@sbbowl', category: 'art', eventsUrl: 'https://sbbowl.com/concerts/' },
  { handle: '@fluidstate', category: 'beer', eventsUrl: 'https://www.fluidstatebeer.com/' },
  { handle: '@sbaquatics', category: 'surf', eventsUrl: 'https://santabarbaraaquatics.com/collections/trips' },
  { handle: '@topatopabrewingco', category: 'beer', eventsUrl: 'https://topatopa.beer/pages/happenings' },
  { handle: '@muniwine', category: 'beer', eventsUrl: 'https://municipalwinemakers.com/pages/visit-muni-ventura' },
  { handle: '@leashlessbrewing', category: 'beer', eventsUrl: 'https://www.leashlessbrewing.com/event-calendar' },
  { handle: '@bellringerbrewco', category: 'beer', eventsUrl: 'https://bellringerbrewco.com/events/' },
  { handle: '@thirdwindowbrewing', category: 'beer', eventsUrl: 'https://thirdwindowbrewing.com/pages/events' },
  { handle: '@brightsparkbrewing', category: 'beer', eventsUrl: 'https://www.brightsparkbrewing.com/calendar' },
  { handle: '@transmissionbrewing', category: 'beer' },
  { handle: '@ojaivalleymusic', category: 'art' },
  { handle: '@rinconbreweryinc', category: 'beer', eventsUrl: 'https://www.rinconbrewery.com/events' },
  { handle: '@grassroots.yoga.vta', category: 'art', eventsUrl: 'https://www.grassrootsyogaventura.com/workshops' },
  { handle: '@bodhisaltyoga', category: 'art', eventsUrl: 'https://bodhisaltyoga.com/classes' },
  { handle: '@sbbiergarten', category: 'beer', eventsUrl: 'https://www.sbbiergarten.com/events' },
  { handle: '@lamadogtaproom', category: 'beer', eventsUrl: 'https://www.lamadog.com/events4calendar' },
  { handle: '@validationsb', category: 'beer', eventsUrl: 'https://validationale.com/events/' },
  { handle: '@figmtnbrewsb', category: 'beer', eventsUrl: 'https://www.figmtnbrew.com/events' },
  { handle: '@seawardbrewing', category: 'beer', eventsUrl: 'https://www.seawardbrewing.com/upcoming-events' },
];
