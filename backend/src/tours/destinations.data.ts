export interface Destination {
  id: string;
  slug: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'gjiri-i-lalezit',
    slug: 'gjiri-i-lalezit',
    name: 'Gjiri i Lalëzit',
    image: '/images/932d54b6417c19507ff6a672e6730dd7-1.jpg',
    tagline: 'Our home bay — turquoise water and golden sand',
    description:
      'The Bay of Lalzi (Gjiri i Lalëzit) is one of the most beautiful stretches of the Albanian Adriatic. ' +
      'Soft golden beaches, calm clear water and a backdrop of green pine forest make it the perfect base ' +
      'for boat tours and water sports. This is where every Crystal Boat Tours adventure begins.',
  },
];
