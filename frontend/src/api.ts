export interface PriceOption {
  label: string;
  price: number;
}

export interface Tour {
  id: string;
  slug: string;
  name: string;
  category: 'tour' | 'watersport';
  price: number;
  unit: string;
  priceOptions?: PriceOption[];
  pricingNote?: string;
  quantityLabel: string;
  image: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  duration: string;
  capacity: string;
  bookable: boolean;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
}

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

export const api = {
  getTours: (): Promise<Tour[]> => fetch('/api/tours').then(json),
  getTour: (slug: string): Promise<Tour> => fetch(`/api/tours/${slug}`).then(json),
  getDestinations: (): Promise<Destination[]> => fetch('/api/destinations').then(json),
  getDestination: (slug: string): Promise<Destination> =>
    fetch(`/api/destinations/${slug}`).then(json),

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
