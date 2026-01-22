import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// Get order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                        bundle: true,
                    },
                },
                address: true,
                partnerCode: {
                    include: {
                        partner: {
                            select: {
                                affiliateCode: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check ownership (unless admin)
        if (order.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Update order status (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const updateData: Record<string, unknown> = {};

        if (body.status) {
            updateData.status = body.status;

            // Update timestamps based on status
            if (body.status === 'SHIPPED') {
                updateData.shippedAt = new Date();
            } else if (body.status === 'DELIVERED') {
                updateData.deliveredAt = new Date();
            }
        }

        if (body.trackingNumber) {
            updateData.trackingNumber = body.trackingNumber;
        }

        if (body.paymentStatus) {
            updateData.paymentStatus = body.paymentStatus;
            if (body.paymentStatus === 'PAID') {
                updateData.paidAt = new Date();
            }
        }

        const order = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                        bundle: true,
                    },
                },
                address: true,
            },
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Cancel order
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check ownership (unless admin)
        if (order.userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'PENDING' && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Cannot cancel order after processing' },
                { status: 400 }
            );
        }

        // Update order status
        await prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        // Refund points if used
        if (order.pointsUsed > 0) {
            await prisma.user.update({
                where: { id: order.userId },
                data: { rewardPoints: { increment: order.pointsUsed } },
            });
        }

        // Deduct earned points
        if (order.pointsEarned > 0) {
            await prisma.user.update({
                where: { id: order.userId },
                data: { rewardPoints: { decrement: order.pointsEarned } },
            });
        }

        return NextResponse.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Cancel order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
