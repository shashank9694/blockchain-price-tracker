// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesModule } from './prices/price.module';
import { Price } from './prices/entities/price.entity';
import { Alert } from './alerts/entities/alert.entity';
import { EmailService } from './common/email.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database', // Use the Docker service name here
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'prices',
      entities: [Price, Alert, EmailService],
      synchronize: true, 
    }),
    PricesModule,
  ],
})
export class AppModule {}
