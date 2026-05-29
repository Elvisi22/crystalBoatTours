import { DESTINATIONS, TOURS } from './data/catalog';

export type { Destination, PriceOption, Tour } from './data/catalog';

export interface CreateOrderResponse {
  bookingId: string;
  orderId: string;
  total: number;
  depositAmount: number;
  depositPercent: number;
  currency: string;
  mock: boolean;
}

const json = async (res: Response) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
};

const notFound = (what: string) => Promise.reject(new Error(`${what} not found`));

export const api = {
  // Read-only catalog is served from the bundled data so the site works on a
  // static host (no backend required).
  getTours: () => Promise.resolve(TOURS),
  getTour: (slug: string) => {
    const tour = TOURS.find((t) => t.slug === slug);
    return tour ? Promise.resolve(tour) : notFound('Tour');
  },
  getDestinations: () => Promise.resolve(DESTINATIONS),
  getDestination: (slug: string) => {
    const dest = DESTINATIONS.find((d) => d.slug === slug);
    return dest ? Promise.resolve(dest) : notFound('Destination');
  },

  // These need the backend. On a static deployment they reject and the UI
  // falls back to "contact us" / direct messaging.
  createBookingOrder: (payload: Record<string, unknown>): Promise<CreateOrderResponse> =>
    fetch('/api/bookings/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json),

  captureBooking: (bookingId: string, orderId: string) =>
    fetch('/api/bookings/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, orderId }),
    }).then(json),

  contact: (payload: Record<string, unknown>) =>
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(json),

  subscribe: (email: string) =>
    fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(json),
};
