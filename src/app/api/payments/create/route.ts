import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { isStripeConfigured } from '@/lib/payment/stripe';
import { isPayPalConfigured, createPayPalOrder } from '@/lib/payment/paypal';

// POST /api/payments/create - Create a payment session
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const prisma = getPrisma();
        const { provider, orderId, auctionId, amount, currency = 'THB' } = await request.json();

        if (!provider || (!orderId && !auctionId) || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: provider, orderId/auctionId, amount' },
                { status: 400 }
            );
        }

        // Validate provider
        if (!['stripe', 'paypal'].includes(provider)) {
            return NextResponse.json(
                { error: 'Invalid payment provider. Use "stripe" or "paypal"' },
                { status: 400 }
            );
        }

        // Check if provider is configured
        if (provider === 'stripe' && !isStripeConfigured()) {
            return NextResponse.json(
                { error: 'Stripe is not configured on this server' },
                { status: 503 }
            );
        }

        if (provider === 'paypal' && !isPayPalConfigured()) {
            return NextResponse.json(
                { error: 'PayPal is not configured on this server' },
                { status: 503 }
            );
        }

        // Create payment record in database
        const payment = await prisma.payment.create({
            data: {
                userId: user.id,
                orderId: orderId || null,
                auctionId: auctionId || null,
                amount: parseFloat(amount),
                currency,
                provider: provider.toUpperCase(),
                status: 'PENDING'
            }
        });

        if (provider === 'paypal') {
            try {
                const paypalOrder = await createPayPalOrder({
                    amount: parseFloat(amount),
                    currency,
                    orderId,
                    auctionId,
                    description: orderId 
                        ? `Order #${orderId}`
                        : `Auction Payment`
                });

                // Update payment with PayPal order ID
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { providerId: paypalOrder.orderId }
                });

                return NextResponse.json({
                    success: true,
                    provider: 'paypal',
                    paymentId: payment.id,
                    paypalOrderId: paypalOrder.orderId,
                    approvalUrl: paypalOrder.approvalUrl
                });
            } catch (error: any) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' }
                });
                throw error;
            }
        }

        if (provider === 'stripe') {
            // Stripe implementation would return client secret
            // For now, return a placeholder
            return NextResponse.json({
                success: true,
                provider: 'stripe',
                paymentId: payment.id,
                message: 'Stripe integration requires STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY environment variables'
            });
        }

        return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
    } catch (error: any) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment' },
            { status: 500 }
        );
    }
}

// GET /api/payments/create - Get available payment methods
export async function GET() {
    return NextResponse.json({
        methods: [
            {
                id: 'stripe',
                name: 'Credit/Debit Card',
                available: isStripeConfigured(),
                currencies: ['USD', 'EUR', 'GBP', 'THB', 'SGD', 'AUD', 'JPY']
            },
            {
                id: 'paypal',
                name: 'PayPal',
                available: isPayPalConfigured(),
                currencies: ['USD', 'EUR', 'GBP', 'THB', 'AUD', 'JPY']
            }
        ]
    });
}
