import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CaptureBookingDto, CreateBookingDto } from './dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post('create-order')
  createOrder(@Body() dto: CreateBookingDto) {
    return this.bookings.createOrder(dto);
  }

  @Post('capture')
  capture(@Body() dto: CaptureBookingDto) {
    return this.bookings.capture(dto);
  }
}
