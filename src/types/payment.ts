export interface PaymentGatewayConfig {
  stripe: StripeConfig | null;
  paypal: PayPalConfig | null;
  crypto: CryptoConfig | null;
  activeGateway: 'stripe' | 'paypal' | 'crypto' | 'none';
  testMode: boolean;
  webhooks: WebhookConfig[];
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  accountId?: string;
  enabled: boolean;
}

export interface PayPalConfig {
  clientId: string;
  secret: string;
  businessEmail: string;
  webhookId?: string;
  sandbox: boolean;
  enabled: boolean;
}

export interface CryptoConfig {
  bitcoin: string; // wallet address
  ethereum: string;
  usdt: string;
  coinbaseApiKey?: string;
  coinbaseWebhookSecret?: string;
  enabled: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscribers: number;
  churnRate: number;
  averageRevenuePerUser: number;
  revenueByPlan: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'paypal' | 'crypto';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  gatewayTransactionId?: string;
}

export const PAYMENT_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'charge.refunded',
];
