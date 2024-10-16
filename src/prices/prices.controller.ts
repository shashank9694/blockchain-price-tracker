// src/prices/prices.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('/hourly')
  getHourlyPrices() {
    return this.pricesService.getHourlyPrices();
  }

  @Get('/set-alert')
  setPriceAlert(
    @Query('chain') chain: string,
    @Query('price') price: number,
    @Query('email') email: string,
  ) {
    return this.pricesService.setAlert(chain, price, email);
  }

  @Get('/swap-rate')
  getSwapRate(@Query('ethAmount') ethAmount: number) {
    return this.pricesService.getSwapRate(ethAmount);
  }
}
