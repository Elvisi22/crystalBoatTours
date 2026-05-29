import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Booking } from '../bookings/bookings.service';

/**
 * Sends the booking notification email after a successful deposit payment.
 * If SMTP isn't configured the booking still succeeds — we just log instead of
 * failing the customer's checkout.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') ?? 587),
        secure: this.config.get('SMTP_SECURE') === 'true',
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP not configured — booking emails will be logged, not sent.');
    }
  }

  async sendBookingNotification(booking: Booking): Promise<void> {
    const to = this.config.get<string>('BOOKING_NOTIFY_EMAIL') || 'info@crystalboattours.com';
    const from =
      this.config.get<string>('MAIL_FROM') ||
      'Crystal Boat Tours <info@crystalboattours.com>';
    const subject = `New booking: ${booking.tourName} — ${booking.date} ${booking.time}`;
    const { html, text } = this.render(booking);

    if (!this.transporter) {
      this.logger.log(`[MAIL:would-send] to=${to} subject="${subject}"\n${text}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from,
        to,
        replyTo: booking.customer.email,
        subject,
        text,
        html,
      });
      this.logger.log(`Booking notification sent to ${to} for booking ${booking.id}`);
    } catch (err) {
      // Never break the booking because email failed.
      this.logger.error(`Failed to send booking email: ${(err as Error).message}`);
    }
  }

  private render(b: Booking) {
    const money = (n: number) => `€${n.toFixed(2)}`;
    const rows: [string, string][] = [
      ['Experience', b.tourName + (b.optionLabel ? ` (${b.optionLabel})` : '')],
      ['Date', b.date],
      ['Time', b.time],
      ['Quantity', String(b.quantity)],
      ['Unit price', money(b.unitPrice)],
      ['Total', money(b.total)],
      [`Deposit paid (${b.depositPercent}%)`, money(b.depositAmount)],
      ['Balance due on arrival', money(b.total - b.depositAmount)],
      ['Name', b.customer.name],
      ['Email', b.customer.email],
      ['Phone', b.customer.phone],
      ['Notes', b.customer.notes || '—'],
      ['PayPal order', b.paypalOrderId || '—'],
      ['Booking ID', b.id],
    ];

    const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#185d94">New booking — deposit paid ✅</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:8px 10px;background:#f1f7fb;border:1px solid #e3eef5;font-weight:bold;width:42%">${k}</td>` +
                `<td style="padding:8px 10px;border:1px solid #e3eef5">${v}</td></tr>`,
            )
            .join('')}
        </table>
        <p style="color:#64748b;font-size:12px;margin-top:16px">
          Sent automatically by the Crystal Boat Tours website.
        </p>
      </div>`;
    return { text, html };
  }
}
