import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { mailContent } from './dto/mailContent.dto';
import * as fs from 'fs';
import * as util from 'util';
import Handlebars from 'handlebars';

@Injectable()
export class NotificationService {
  constructor(private configService: ConfigService) {}
  mailTransport() {
    const transporter = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(mailContent: mailContent) {
    const { from, recipients, subject, html } = mailContent;
    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: recipients,
      subject,
      html,
    };
    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async sendOrderConfirmationEmail(orderInfo) {
    const readFile = util.promisify(fs.readFile);
    const templateContent = await readFile(
      'src/notification/orderConfirmation.html',
      'utf8',
    );
    const data = {
      customerName: orderInfo.receiverName,
      orderItems: orderInfo.orderItems,
      totalAmount: orderInfo.totalAmount,
    };
    const template = Handlebars.compile(templateContent);
    const renderedTemplate = template(data);
    const mailContent: mailContent = {
      recipients: [
        {
          name: orderInfo.receiverName,
          address: orderInfo.receiverEmail,
        },
      ],
      subject: 'Order Confirmation',
      html: renderedTemplate,
    };
    return this.sendEmail(mailContent);
  }
}
