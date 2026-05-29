export interface PriceOption {
  label: string; // e.g. "15 minutes"
  price: number; // EUR for this option
}

export interface Tour {
  id: string;
  slug: string;
  name: string;
  category: 'tour' | 'watersport';
  /** headline price (used when the tour has no selectable options), in EUR */
  price: number;
  unit: string; // e.g. "per person", "per 15 min", "per 60 min"
  /** optional duration/package choices; when present the customer picks one */
  priceOptions?: PriceOption[];
  /** extra pricing detail shown to the customer (e.g. surcharges) */
  pricingNote?: string;
  /** label for the quantity field on the booking form */
  quantityLabel: string;
  image: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  duration: string;
  capacity: string;
  bookable: boolean;
}

/**
 * Catalog and prices mirror crystalboattours.com/services (verified May 2026).
 * Pricing is resolved server-side from this file — the client never sets prices.
 */
export const TOURS: Tour[] = [
  {
    id: 'boat-tour',
    slug: 'boat-tour',
    name: 'Boat Tour',
    category: 'tour',
    price: 50,
    unit: 'per person',
    quantityLabel: 'Guests',
    image: '/images/image00238.jpeg',
    shortDescription:
      'A guided cruise along the Adriatic coast to the beautiful Cape of Rodon.',
    description:
      'Sail the stunning Adriatic coastline with a local skipper and discover the Cape of Rodon, ' +
      'one of the most scenic spots in the bay. We stop at secluded beaches and clear water for ' +
      'swimming and snorkelling along the way.',
    highlights: [
      'Local English-speaking guide',
      'Cape of Rodon & hidden beaches',
      'Swimming & snorkelling stops',
      'Refreshments on board',
    ],
    duration: '3 hours',
    capacity: 'Up to 10 guests',
    bookable: true,
  },
  {
    id: 'jet-ski',
    slug: 'jet-ski',
    name: 'Jet Ski',
    category: 'watersport',
    price: 45,
    unit: 'per 15 min',
    priceOptions: [
      { label: '15 minutes', price: 45 },
      { label: '30 minutes', price: 90 },
      { label: '1 hour (weekday)', price: 170 },
      { label: '1 hour (weekend)', price: 180 },
    ],
    pricingNote: 'Early-bird (8:30–9:30am): €155 weekday / €172 weekend per hour.',
    quantityLabel: 'Jet skis',
    image: '/images/56091f0ad0037ebe029ca85bc4d69e51.jpg',
    shortDescription:
      'Feel the adrenaline as you race across the open water on a powerful jet ski.',
    description:
      'Open the throttle and fly across the bay on one of our well-maintained jet skis. ' +
      'Perfect for thrill-seekers — no experience or licence required, with a full safety ' +
      'briefing and equipment provided. Ride solo or take a partner along.',
    highlights: [
      'Powerful, well-maintained jet skis',
      'Safety briefing & life jackets',
      'Solo or tandem riding',
      'No licence required',
    ],
    duration: 'From 15 minutes',
    capacity: '1–2 riders per ski',
    bookable: true,
  },
  {
    id: 'sea-jet-car',
    slug: 'sea-jet-car',
    name: 'Sea Jet Car',
    category: 'watersport',
    price: 60,
    unit: 'per 15 min (up to 2 people)',
    pricingNote: '+€10 per extra person, settled on arrival.',
    quantityLabel: 'Sessions (15 min)',
    image: '/images/photo-2025-04-20-17-06-35-1.jpg',
    shortDescription:
      'The ultimate water toy — a futuristic sea car that skims and dives across the waves.',
    description:
      'Experience the most exclusive ride on the coast. The Sea Jet Car is a head-turning, ' +
      'semi-submersible machine that lets you skim the surface and dip beneath the waves. ' +
      'A truly unique experience for up to two people, with full instructor guidance.',
    highlights: [
      'Unique semi-submersible ride',
      'Full instructor guidance',
      'Unforgettable photos & video',
      'Safety equipment included',
    ],
    duration: '15 minutes',
    capacity: '2 people (extra at surcharge)',
    bookable: true,
  },
  {
    id: 'sup-surf',
    slug: 'sup-surf',
    name: 'SUP Surf',
    category: 'watersport',
    price: 20,
    unit: 'per 60 min',
    quantityLabel: 'Boards',
    image: '/images/7bd19c1cb8195b51d52b1a715141b0fd-1.jpg',
    shortDescription:
      'Stand-up paddleboarding on calm, glassy water — fun for all ages and skill levels.',
    description:
      'Glide over the calm waters of the bay on a stand-up paddleboard. A relaxing full-body ' +
      'workout and a beautiful way to explore the shoreline at your own pace. Boards and paddles ' +
      'provided, with a quick lesson for first-timers.',
    highlights: [
      'Great for beginners & families',
      'Boards & paddles provided',
      'Quick starter lesson included',
      'Calm, scenic waters',
    ],
    duration: '60 minutes',
    capacity: '1 per board',
    bookable: true,
  },
  {
    id: 'kayak',
    slug: 'kayak',
    name: 'Kayak Rental',
    category: 'watersport',
    price: 20,
    unit: 'per person',
    quantityLabel: 'Guests',
    image: '/images/268e63afd595172e45c91db4ffe1a26d-1.jpg',
    shortDescription:
      'Paddle along the coast at your own pace and discover quiet little bays.',
    description:
      'Hire a stable, easy-to-paddle kayak and explore the coastline of the Bay of Lalzi. ' +
      'Single and double kayaks available — perfect for couples, friends and families who want ' +
      'a peaceful adventure on the water.',
    highlights: [
      'Single & double kayaks',
      'Stable and beginner-friendly',
      'Life jackets included',
      'Explore at your own pace',
    ],
    duration: 'Flexible',
    capacity: '1–2 paddlers',
    bookable: true,
  },
  {
    id: 'banana-boat',
    slug: 'banana-boat',
    name: 'Banana Boat Ride',
    category: 'watersport',
    price: 20,
    unit: 'per person',
    quantityLabel: 'Riders',
    image: '/images/8ff1d6cc689d00635ae6fa94c0e5959c.jpg',
    shortDescription: 'Hold on tight for a hilarious, splashy ride the whole group will love.',
    description:
      'Climb aboard the banana boat and get towed across the bay for a fun, fast and splashy ' +
      'ride. A guaranteed laugh for friends and families — life jackets and full supervision included.',
    highlights: ['Great group fun', 'Life jackets included', 'Full supervision', 'Suitable for all ages'],
    duration: '~15 minutes',
    capacity: 'Up to 6 riders',
    bookable: true,
  },
  {
    id: 'spinera-ride',
    slug: 'spinera-ride',
    name: 'Spinera Ride',
    category: 'watersport',
    price: 20,
    unit: 'per person',
    quantityLabel: 'Riders',
    image: '/images/107ae2e2-2412-4b39-b177-8a0e2bb32dde-1.jpeg',
    shortDescription: 'An exciting towable ride that bounces and glides over the waves.',
    description:
      'Hop on the Spinera towable and enjoy a thrilling ride across the water behind our boat. ' +
      'Fast, fun and perfect for thrill-seekers, with full safety supervision throughout.',
    highlights: ['Adrenaline-packed', 'Life jackets included', 'Full supervision', 'Great for groups'],
    duration: '~15 minutes',
    capacity: 'Up to 4 riders',
    bookable: true,
  },
  {
    id: 'sofa-ride',
    slug: 'sofa-ride',
    name: 'Sofa Ride',
    category: 'watersport',
    price: 25,
    unit: 'per person',
    quantityLabel: 'Riders',
    image: '/images/336f2c84-301e-41bf-b9c0-4bc444a6f036.jpeg',
    shortDescription: 'Relax and get towed across the bay on a comfy inflatable sofa.',
    description:
      'Kick back on the inflatable sofa and enjoy a smooth, exciting tow across the bay. ' +
      'A favourite for couples and small groups who want fun without the extreme bounce.',
    highlights: ['Comfortable inflatable', 'Life jackets included', 'Full supervision', 'Fun for couples & groups'],
    duration: '~15 minutes',
    capacity: 'Up to 3 riders',
    bookable: true,
  },
];
