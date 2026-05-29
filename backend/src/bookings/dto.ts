import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tourSlug: string;

  @IsString()
  @IsNotEmpty()
  date: string; // ISO date, e.g. 2026-06-15

  @IsString()
  @IsNotEmpty()
  time: string; // e.g. "10:00"

  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;

  @IsString()
  @IsOptional()
  optionLabel?: string; // selected duration/package, when the tour offers options

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CaptureBookingDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}
