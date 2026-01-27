// PayPal Payment Integration
// To enable PayPal, add these environment variables:
// PAYPAL_CLIENT_ID=xxx
// PAYPAL_CLIENT_SECRET=xxx
// PAYPAL_MODE=sandbox or live

export interface PayPalConfig {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
}

export interface CreateOrderParams {
    amount: number; // Amount in currency units (e.g., 100.00 for $100)
    currency: string;
    orderId?: string;
    auctionId?: string;
    description?: string;
}

export interface PayPalOrderResult {
    orderId: string;
    approvalUrl: string;
}

// Check if PayPal is configured
export function isPayPalConfigured(): boolean {
    return !!(
        process.env.PAYPAL_CLIENT_ID &&
        process.env.PAYPAL_CLIENT_SECRET
    );
}

export function getPayPalConfig(): PayPalConfig | null {
    if (!isPayPalConfigured()) return null;
    
    return {
        clientId: process.env.PAYPAL_CLIENT_ID!,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
        mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox'
    };
}

// Get PayPal API base URL
function getBaseUrl(mode: 'sandbox' | 'live'): string {
    return mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
}

// Get access token
async function getAccessToken(): Promise<string> {
    const config = getPayPalConfig();
    if (!config) {
        throw new Error('PayPal is not configured');
    }

    const baseUrl = getBaseUrl(config.mode);
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
}

// Create a PayPal order
export async function createPayPalOrder(params: CreateOrderParams): Promise<PayPalOrderResult> {
    const config = getPayPalConfig();
    if (!config) {
        throw new Error('PayPal is not configured');
    }

    const accessToken = await getAccessToken();
    const baseUrl = getBaseUrl(config.mode);

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: params.currency,
                    value: params.amount.toFixed(2)
                },
                description: params.description,
                custom_id: params.orderId || params.auctionId
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create PayPal order');
    }

    const data = await response.json();
    const approvalLink = data.links.find((link: any) => link.rel === 'approve');

    return {
        orderId: data.id,
        approvalUrl: approvalLink?.href || ''
    };
}

// Capture a PayPal order (after customer approval)
export async function capturePayPalOrder(paypalOrderId: string): Promise<any> {
    const config = getPayPalConfig();
    if (!config) {
        throw new Error('PayPal is not configured');
    }

    const accessToken = await getAccessToken();
    const baseUrl = getBaseUrl(config.mode);

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to capture PayPal order');
    }

    return response.json();
}

// Supported currencies in PayPal
export const paypalSupportedCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'HKD', 'NZD',
    'SGD', 'SEK', 'DKK', 'NOK', 'MXN', 'BRL', 'THB', 'MYR', 'PHP',
    'TWD', 'CZK', 'HUF', 'ILS', 'PLN', 'RUB'
];
