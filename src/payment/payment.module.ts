import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

import { ConfigModule } from "@nestjs/config"
import { StoresModule } from 'src/stores/stores.module';
@Module({
  imports: [ConfigModule, StoresModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
