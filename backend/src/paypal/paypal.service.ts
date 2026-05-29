import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PayPalOrder {
  id: string;
  status: string;
  mock?: boolean;
}

/**
 * Thin wrapper over the PayPal Orders v2 REST API.
 *
 * If PAYPAL_CLIENT_ID / SECRET are not configured the service runs in MOCK mode:
 * it returns realistic-looking order ids and "captures" so the entire booking
 * flow can be developed and demoed without a PayPal account.
 */
@Injectable()
export class PayPalService {
  private readonly logger = new Logger(PayPalService.name);
  private token?: { value: string; expiresAt: number };

  constructor(private readonly config: ConfigService) {}

  private get clientId() {
    return this.config.get<string>('PAYPAL_CLIENT_ID');
  }
  private get clientSecret() {
    return this.config.get<string>('PAYPAL_CLIENT_SECRET');
  }
  get isMock() {
    return !this.clientId || !this.clientSecret;
  }
  private get base() {
    return this.config.get('PAYPAL_ENV') === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now()) return this.token.value;
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch(`${this.base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.token = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return data.access_token;
  }

  async createOrder(amount: number, currency: string, description: string): Promise<PayPalOrder> {
    const value = amount.toFixed(2);
    if (this.isMock) {
      this.logger.warn('PayPal in MOCK mode — no real charge will be made.');
      return { id: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, status: 'CREATED', mock: true };
    }
    const token = await this.accessToken();
    const res = await fetch(`${this.base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          { amount: { currency_code: currency, value }, description: description.slice(0, 127) },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error(`PayPal createOrder failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as PayPalOrder;
    return data;
  }

  async captureOrder(orderId: string): Promise<PayPalOrder> {
    if (this.isMock || orderId.startsWith('MOCK-')) {
      return { id: orderId, status: 'COMPLETED', mock: true };
    }
    const token = await this.accessToken();
    const res = await fetch(`${this.base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`PayPal captureOrder failed: ${res.status} ${await res.text()}`);
    }
    return (await res.json()) as PayPalOrder;
  }
}
