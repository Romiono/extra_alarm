import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(NotificationService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Важно!
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        text: body,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendSMS(to: string, body: string) {
    // Позже можно подключить Twilio или другой сервис
    this.logger.log(`(Mock) SMS to ${to}: ${body}`);
  }
}
