// src/prices/prices.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { Alert } from '../alerts/entities/alert.entity'; // Import Alert entity
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../common/email.service';
import axios from 'axios';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price) private pricesRepository: Repository<Price>,
    @InjectRepository(Alert) private alertsRepository: Repository<Alert>, // Inject Alert repository
    private emailService: EmailService,
  ) {}

  // Fetch Ethereum and Polygon prices every 5 minutes
  @Cron('*/5 * * * *')
  async fetchPrices() {
    const ethPrice = await this.fetchEthPrice();
    const polygonPrice = await this.fetchPolygonPrice();

    // Save them to the database
    await this.savePrice('ethereum', ethPrice);
    await this.savePrice('polygon', polygonPrice);

    // Compare and send an email if price increases by 3% in 1 hour
    await this.checkPriceAlert('ethereum', ethPrice);
    await this.checkPriceAlert('polygon', polygonPrice);

    // Check user-defined price alerts
    await this.checkUserPriceAlerts('ethereum', ethPrice);
    await this.checkUserPriceAlerts('polygon', polygonPrice);
  }

  // Example to fetch Ethereum price
  async fetchEthPrice() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    return response.data.ethereum.usd;
  }

  // Example to fetch Polygon price
  async fetchPolygonPrice() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
    return response.data["matic-network"].usd;
  }

  // Save price to the database
  async savePrice(chain: string, price: number) {
    const newPrice = this.pricesRepository.create({ chain, price });
    await this.pricesRepository.save(newPrice);
  }

  // Check for price alert and send an email if price increased by more than 3%
  async checkPriceAlert(chain: string, currentPrice: number) {
    const pastPrice = await this.pricesRepository.findOne({
      where: { chain },
      order: { timestamp: 'DESC' },
    });

    if (pastPrice) {
      const priceChange = ((currentPrice - pastPrice.price) / pastPrice.price) * 100;
      if (priceChange > 3) {
        await this.emailService.sendAlertEmail(chain, currentPrice);
      }
    }
  }

  // New method to set price alerts
  async setAlert(chain: string, price: number, email: string) {
    const alert = this.alertsRepository.create({ chain, targetPrice: price, email });
    await this.alertsRepository.save(alert);
    return { message: `Alert set for ${chain} at $${price}` };
  }

  // Check for user-defined price alerts and send emails
  async checkUserPriceAlerts(chain: string, currentPrice: number) {
    const alerts = await this.alertsRepository.find({ where: { chain } });

    for (const alert of alerts) {
      if (currentPrice <= alert.targetPrice) {
        // Send an email if the current price is equal or below the target price
        await this.emailService.sendPriceAlertEmail(alert.email, chain, currentPrice);
        // Optionally, delete the alert after sending the email
        await this.alertsRepository.delete(alert.id);
      }
    }
  }

  // Get hourly prices for the last 24 hours
  async getHourlyPrices() {
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return this.pricesRepository.find({
      where: { timestamp: oneDayAgo },
      order: { timestamp: 'ASC' },
    });
  }

  // Get swap rate from ETH to BTC
  async getSwapRate(ethAmount: number) {
    const ethPrice = await this.fetchEthPrice();
    const btcPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const btcPrice = btcPriceResponse.data.bitcoin.usd;

    const btcAmount = (ethAmount * ethPrice) / btcPrice;
    const fee = ethAmount * 0.03;

    return {
      btcAmount,
      fee: {
        eth: fee,
        usd: fee * ethPrice,
      },
    };
  }
}
