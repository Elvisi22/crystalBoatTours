import { Body, Controller, Module, Post } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { randomUUID } from 'crypto';
import { JsonStoreService } from '../common/json-store.service';

class SubscribeDto {
  @IsEmail() email: string;
}

@Controller('newsletter')
class NewsletterController {
  constructor(private readonly store: JsonStoreService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    const existing = await this.store.readAll<{ id: string; email: string }>('newsletter');
    if (!existing.some((s) => s.email.toLowerCase() === dto.email.toLowerCase())) {
      await this.store.append('newsletter', {
        id: randomUUID(),
        email: dto.email,
        createdAt: new Date().toISOString(),
      });
    }
    return { ok: true, message: 'You are subscribed. Welcome aboard!' };
  }
}

@Module({
  controllers: [NewsletterController],
  providers: [JsonStoreService],
})
export class NewsletterModule {}
