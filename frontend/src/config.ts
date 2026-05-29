/** Central place for business / contact details shown across the site. */
export const SITE = {
  name: 'Crystal Boat Tours',
  tagline: 'Boat tours & water sports in the Bay of Lalzi, Albania',
  phone: '+355 68 866 8888',
  phoneHref: 'tel:+35568866888',
  whatsapp: 'https://wa.me/35568866888',
  location: 'Bay of Lalzi, Albania',
  email: 'info@crystalboattours.com',
  social: {
    instagram: 'https://instagram.com/crystal_boat_tours_meliadurres',
    instagramHandle: '@crystal_boat_tours_meliadurres',
    tiktok: 'https://www.tiktok.com/@crystal_boat_tours',
    tiktokHandle: '@crystal_boat_tours',
  },
  logo: '/images/cropped-image00239-removebg-preview-1.png',
};

export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
export const PAYPAL_CURRENCY = import.meta.env.VITE_PAYPAL_CURRENCY || 'EUR';
