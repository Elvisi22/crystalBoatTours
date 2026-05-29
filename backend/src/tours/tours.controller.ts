import { Controller, Get, Param } from '@nestjs/common';
import { ToursService } from './tours.service';

@Controller()
export class ToursController {
  constructor(private readonly tours: ToursService) {}

  @Get('tours')
  getTours() {
    return this.tours.findAll();
  }

  @Get('tours/:slug')
  getTour(@Param('slug') slug: string) {
    return this.tours.findOne(slug);
  }

  @Get('destinations')
  getDestinations() {
    return this.tours.findDestinations();
  }

  @Get('destinations/:slug')
  getDestination(@Param('slug') slug: string) {
    return this.tours.findDestination(slug);
  }
}
