import { Module } from '@nestjs/common';
import { JsonStoreService } from '../common/json-store.service';
import { MailModule } from '../mail/mail.module';
import { PayPalModule } from '../paypal/paypal.module';
import { ToursModule } from '../tours/tours.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [PayPalModule, ToursModule, MailModule],
  controllers: [BookingsController],
  providers: [BookingsService, JsonStoreService],
})
export class BookingsModule {}
