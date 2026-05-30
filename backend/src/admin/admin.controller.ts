import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JsonStoreService } from '../common/json-store.service';
import type { Booking } from '../bookings/bookings.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly store: JsonStoreService) {}

  private byNewest<T extends { createdAt?: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  @Get('bookings')
  async bookings() {
    return this.byNewest(await this.store.readAll<Booking>('bookings'));
  }

  @Get('contacts')
  async contacts() {
    return this.byNewest(await this.store.readAll<{ createdAt?: string }>('contact'));
  }

  @Get('subscribers')
  async subscribers() {
    return this.byNewest(await this.store.readAll<{ createdAt?: string }>('newsletter'));
  }

  @Get('summary')
  async summary() {
    const bookings = await this.store.readAll<Booking>('bookings');
    const paid = bookings.filter((b) => b.status === 'deposit_paid');
    const depositsCollected = paid.reduce((sum, b) => sum + (b.depositAmount || 0), 0);
    const expectedRevenue = paid.reduce((sum, b) => sum + (b.total || 0), 0);
    const contacts = await this.store.readAll('contact');
    const subscribers = await this.store.readAll('newsletter');
    return {
      bookings: bookings.length,
      paidBookings: paid.length,
      pendingBookings: bookings.length - paid.length,
      depositsCollected: Math.round(depositsCollected * 100) / 100,
      expectedRevenue: Math.round(expectedRevenue * 100) / 100,
      contacts: contacts.length,
      subscribers: subscribers.length,
    };
  }
}
