import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JsonStoreService } from '../common/json-store.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [JsonStoreService],
})
export class AdminModule {}
