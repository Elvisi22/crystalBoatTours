import { Body, Controller, Module, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { randomUUID } from 'crypto';
import { JsonStoreService } from '../common/json-store.service';

class ContactDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsNotEmpty() message: string;
}

@Controller('contact')
class ContactController {
  constructor(private readonly store: JsonStoreService) {}

  @Post()
  async submit(@Body() dto: ContactDto) {
    const record = { id: randomUUID(), ...dto, createdAt: new Date().toISOString() };
    await this.store.append('contact', record);
    return { ok: true, message: 'Thanks! We will get back to you shortly.' };
  }
}

@Module({
  controllers: [ContactController],
  providers: [JsonStoreService],
})
export class ContactModule {}
