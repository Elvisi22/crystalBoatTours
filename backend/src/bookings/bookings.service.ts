import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { JsonStoreService } from '../common/json-store.service';
import { MailService } from '../mail/mail.service';
import { PayPalService } from '../paypal/paypal.service';
import { ToursService } from '../tours/tours.service';
import { CaptureBookingDto, CreateBookingDto } from './dto';

export interface Booking {
  id: string;
  tourSlug: string;
  tourName: string;
  date: string;
  time: string;
  quantity: number;
  optionLabel?: string;
  unitPrice: number;
  total: number;
  depositPercent: number;
  depositAmount: number;
  currency: string;
  customer: { name: string; email: string; phone: string; notes?: string };
  status: 'pending_payment' | 'deposit_paid' | 'cancelled';
  paypalOrderId?: string;
  createdAt: string;
}

const COLLECTION = 'bookings';

@Injectable()
export class BookingsService {
  constructor(
    private readonly store: JsonStoreService,
    private readonly paypal: PayPalService,
    private readonly tours: ToursService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  private round(n: number) {
    return Math.round(n * 100) / 100;
  }

  async createOrder(dto: CreateBookingDto) {
    const tour = this.tours.findOne(dto.tourSlug);
    if (!tour.bookable) {
      throw new BadRequestException('This experience is not available for online booking.');
    }

    const depositPercent = Number(this.config.get('DEPOSIT_PERCENT') ?? 20);
    const currency = this.config.get<string>('PAYPAL_CURRENCY') || 'EUR';

    // Resolve the unit price server-side — never trust a price from the client.
    let unitPrice = tour.price;
    let optionLabel: string | undefined;
    if (tour.priceOptions?.length) {
      const opt =
        tour.priceOptions.find((o) => o.label === dto.optionLabel) ?? tour.priceOptions[0];
      unitPrice = opt.price;
      optionLabel = opt.label;
    }

    const total = this.round(unitPrice * dto.quantity);
    const depositAmount = this.round((total * depositPercent) / 100);

    const order = await this.paypal.createOrder(
      depositAmount,
      currency,
      `${depositPercent}% deposit — ${tour.name} x${dto.quantity}`,
    );

    const booking: Booking = {
      id: randomUUID(),
      tourSlug: tour.slug,
      tourName: tour.name,
      date: dto.date,
      time: dto.time,
      quantity: dto.quantity,
      optionLabel,
      unitPrice,
      total,
      depositPercent,
      depositAmount,
      currency,
      customer: { name: dto.name, email: dto.email, phone: dto.phone, notes: dto.notes },
      status: 'pending_payment',
      paypalOrderId: order.id,
      createdAt: new Date().toISOString(),
    };
    await this.store.append(COLLECTION, booking);

    return {
      bookingId: booking.id,
      orderId: order.id,
      total,
      depositAmount,
      depositPercent,
      currency,
      mock: this.paypal.isMock,
    };
  }

  async capture(dto: CaptureBookingDto) {
    const booking = await this.store.findOne<Booking>(COLLECTION, dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.paypalOrderId !== dto.orderId) {
      throw new BadRequestException('Order does not match booking');
    }

    const result = await this.paypal.captureOrder(dto.orderId);
    if (result.status !== 'COMPLETED') {
      throw new BadRequestException(`Payment not completed (status: ${result.status})`);
    }

    const updated = await this.store.update<Booking>(COLLECTION, booking.id, {
      status: 'deposit_paid',
    });

    // Notify the business by email. Failure here must not break the booking.
    if (updated) await this.mail.sendBookingNotification(updated);

    return { ok: true, booking: updated };
  }
}
