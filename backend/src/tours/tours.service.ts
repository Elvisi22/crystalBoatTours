import { Injectable, NotFoundException } from '@nestjs/common';
import { TOURS, Tour } from './tours.data';
import { DESTINATIONS, Destination } from './destinations.data';

@Injectable()
export class ToursService {
  findAll(): Tour[] {
    return TOURS;
  }

  findOne(slug: string): Tour {
    const tour = TOURS.find((t) => t.slug === slug);
    if (!tour) throw new NotFoundException(`Tour "${slug}" not found`);
    return tour;
  }

  findDestinations(): Destination[] {
    return DESTINATIONS;
  }

  findDestination(slug: string): Destination {
    const dest = DESTINATIONS.find((d) => d.slug === slug);
    if (!dest) throw new NotFoundException(`Destination "${slug}" not found`);
    return dest;
  }
}
