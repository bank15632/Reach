import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// Generate order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RC${timestamp}${random}`;
}

// Get user's orders
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: Record<string, unknown> = { userId: user.id };
        if (status) {
            where.status = status;
        }

        const total = await prisma.order.count({ where });

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                        bundle: true,
                    },
                },
                address: true,
                partnerCode: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Create order
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            items,
            addressId,
            partnerCode,
            paymentMethod,
            shippingMethod,
            pointsUsed,
            notes,
        } = body;

        // Validate items
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Calculate totals
        let subtotal = 0;
        let discount = 0;
        const shippingFee = 0; // Free shipping for now

        // Process items and calculate subtotal
        const orderItems = [];
        for (const item of items) {
            let unitPrice = 0;

            if (item.productId) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) continue;
                unitPrice = product.salePrice || product.price;
            } else if (item.bundleId) {
                const bundle = await prisma.bundle.findUnique({
                    where: { id: item.bundleId },
                });
                if (!bundle) continue;
                unitPrice = bundle.price;
            }

            const totalPrice = unitPrice * item.quantity;
            subtotal += totalPrice;

            orderItems.push({
                productId: item.productId,
                variantId: item.variantId,
                bundleId: item.bundleId,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
            });
        }

        // Apply partner code discount
        let partnerCodeId = null;
        if (partnerCode) {
            const code = await prisma.partnerCode.findUnique({
                where: { code: partnerCode },
                include: { partner: true },
            });

            if (code && code.isActive) {
                // Check expiry
                if (!code.expiryDate || new Date(code.expiryDate) > new Date()) {
                    // Check max uses
                    if (!code.maxUses || code.usedCount < code.maxUses) {
                        discount = (subtotal * code.discountPercent) / 100;
                        partnerCodeId = code.id;

                        // Update code usage
                        await prisma.partnerCode.update({
                            where: { id: code.id },
                            data: { usedCount: { increment: 1 } },
                        });

                        // Calculate commission for partner (20% - discount% = commission%)
                        const commissionRate = (20 - code.discountPercent) / 100;
                        const commissionAmount = subtotal * commissionRate;
                        const pointsEarned = subtotal * 0.01; // 1 baht = 0.01 points

                        // Update partner stats
                        await prisma.partner.update({
                            where: { id: code.partnerId },
                            data: {
                                totalSales: { increment: subtotal },
                                totalOrders: { increment: 1 },
                                totalCommission: { increment: commissionAmount },
                                availableCommission: { increment: commissionAmount },
                                partnerPoints: { increment: pointsEarned },
                            },
                        });
                    }
                }
            }
        }

        // Apply reward points discount
        let pointsDiscount = 0;
        if (pointsUsed && pointsUsed > 0) {
            // 1 point = 1 baht
            pointsDiscount = Math.min(pointsUsed, user.rewardPoints, subtotal - discount);
            discount += pointsDiscount;

            // Deduct points from user
            await prisma.user.update({
                where: { id: user.id },
                data: { rewardPoints: { decrement: pointsDiscount } },
            });
        }

        const total = subtotal - discount + shippingFee;

        // Calculate points earned (1% of total)
        const pointsEarned = Math.floor(total * 0.01);

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: user.id,
                addressId,
                subtotal,
                discount,
                shippingFee,
                total,
                partnerCodeId,
                paymentMethod,
                shippingMethod,
                pointsEarned,
                pointsUsed: pointsDiscount,
                notes,
                items: {
                    create: orderItems,
                },
            },
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

        // Add earned points to user
        await prisma.user.update({
            where: { id: user.id },
            data: { rewardPoints: { increment: pointsEarned } },
        });

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
