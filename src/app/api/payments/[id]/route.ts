import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasAdminPermission } from '@/lib/adminAccess';

// GET /api/payments/[id] - Get payment status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const prisma = getPrisma();
        const { id } = await params;

        const payment = await prisma.payment.findUnique({
            where: { id }
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        // Ensure user owns this payment
        const canManageOrders = hasAdminPermission(user.role, user.adminPermissions, 'MANAGE_ORDERS');
        if (payment.userId !== user.id && !canManageOrders) {
            return NextResponse.json(
                { error: 'Not authorized' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            provider: payment.provider,
            paidAt: payment.paidAt?.toISOString(),
            createdAt: payment.createdAt.toISOString()
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment' },
            { status: 500 }
        );
    }
}
