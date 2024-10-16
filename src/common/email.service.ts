// src/common/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: 'None',
    });
  }

  async sendAlertEmail(chain: string, price: number) {
    const mailOptions = {
      from: '"Blockchain Tracker" <no-reply@tracker.com>',
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} price alert`,
      text: `The price of ${chain} has increased by more than 3% in the last hour. Current price: ${price}`,
    };

    
    await this.transporter.sendMail(mailOptions);
}
async sendPriceAlertEmail(email:string, chain: string, price: number) {
    const mailOptions = {
      from: '"Blockchain Tracker" <no-reply@tracker.com>',
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} price alert`,
      text: `The price of ${chain} has increased by more than 3% in the last hour. Current price: ${price}`,
    };
    await this.transporter.sendMail(mailOptions);
}
}
