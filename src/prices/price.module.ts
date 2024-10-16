// src/prices/prices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { EmailService } from '../common/email.service';
import { Price } from './entities/price.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Alert } from 'src/alerts/entities/alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert]),
    ScheduleModule.forRoot(), // For cron jobs
  ],
  controllers: [PricesController],
  providers: [PricesService ,EmailService],
})
export class PricesModule {}
