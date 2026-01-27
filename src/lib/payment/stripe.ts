// Stripe Payment Integration
// To enable Stripe, add these environment variables:
// STRIPE_SECRET_KEY=sk_live_xxx or sk_test_xxx
// STRIPE_PUBLISHABLE_KEY=pk_live_xxx or pk_test_xxx
// STRIPE_WEBHOOK_SECRET=whsec_xxx

export interface StripeConfig {
    secretKey: string;
    publishableKey: string;
    webhookSecret?: string;
}

export interface CreatePaymentIntentParams {
    amount: number; // Amount in smallest currency unit (satang for THB)
    currency: string;
    orderId?: string;
    auctionId?: string;
    customerId?: string;
    metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
    clientSecret: string;
    paymentIntentId: string;
}

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
    return !!(
        process.env.STRIPE_SECRET_KEY &&
        process.env.STRIPE_PUBLISHABLE_KEY
    );
}

export function getStripeConfig(): StripeConfig | null {
    if (!isStripeConfigured()) return null;
    
    return {
        secretKey: process.env.STRIPE_SECRET_KEY!,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    };
}

// Create a payment intent
// In production, use the actual Stripe SDK:
// npm install stripe
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const config = getStripeConfig();
    if (!config) {
        throw new Error('Stripe is not configured');
    }

    // Actual implementation would use Stripe SDK:
    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: params.amount,
    //     currency: params.currency.toLowerCase(),
    //     metadata: {
    //         orderId: params.orderId,
    //         auctionId: params.auctionId,
    //         ...params.metadata
    //     }
    // });

    // Placeholder for development
    throw new Error('Stripe integration not yet implemented. Install stripe package and configure API keys.');
}

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string): boolean {
    const config = getStripeConfig();
    if (!config?.webhookSecret) {
        throw new Error('Stripe webhook secret is not configured');
    }

    // Actual implementation:
    // const event = stripe.webhooks.constructEvent(
    //     payload,
    //     signature,
    //     config.webhookSecret
    // );
    
    throw new Error('Stripe webhook verification not yet implemented');
}

// Supported currencies in Stripe
export const stripeSupportedCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 
    'NZD', 'SGD', 'SEK', 'DKK', 'NOK', 'MXN', 'BRL', 'THB', 'INR',
    'MYR', 'PHP', 'IDR', 'TWD', 'KRW', 'AED', 'SAR', 'PLN', 'CZK'
];
