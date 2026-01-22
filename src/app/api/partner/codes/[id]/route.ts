import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// Update code
export async function PUT(
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

        const partner = await prisma.partner.findUnique({
            where: { userId: user.id },
        });

        if (!partner) {
            return NextResponse.json(
                { error: 'Not a partner' },
                { status: 404 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        // Check ownership
        const existingCode = await prisma.partnerCode.findUnique({
            where: { id },
        });

        if (!existingCode || existingCode.partnerId !== partner.id) {
            return NextResponse.json(
                { error: 'Code not found' },
                { status: 404 }
            );
        }

        // Validate discount (1-20%)
        if (body.discountPercent && (body.discountPercent < 1 || body.discountPercent > 20)) {
            return NextResponse.json(
                { error: 'Discount must be between 1% and 20%' },
                { status: 400 }
            );
        }

        // Validate expiry (max 1 month)
        if (body.expiryDate) {
            const expiry = new Date(body.expiryDate);
            const maxExpiry = new Date();
            maxExpiry.setMonth(maxExpiry.getMonth() + 1);

            if (expiry > maxExpiry) {
                return NextResponse.json(
                    { error: 'Expiry date cannot exceed 1 month' },
                    { status: 400 }
                );
            }
        }

        // Check for duplicate code (if changing)
        if (body.code && body.code !== existingCode.code) {
            const duplicate = await prisma.partnerCode.findUnique({
                where: { code: body.code },
            });

            if (duplicate) {
                return NextResponse.json(
                    { error: 'Code already exists' },
                    { status: 400 }
                );
            }
        }

        const code = await prisma.partnerCode.update({
            where: { id },
            data: {
                code: body.code,
                discountPercent: body.discountPercent,
                expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
                maxUses: body.maxUses,
                applicableProducts: body.applicableProducts === 'all' ? [] : body.applicableProducts,
                isActive: body.isActive,
            },
        });

        return NextResponse.json({ code });
    } catch (error) {
        console.error('Update code error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Delete code
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

        const partner = await prisma.partner.findUnique({
            where: { userId: user.id },
        });

        if (!partner) {
            return NextResponse.json(
                { error: 'Not a partner' },
                { status: 404 }
            );
        }

        const { id } = await params;

        // Check ownership
        const existingCode = await prisma.partnerCode.findUnique({
            where: { id },
        });

        if (!existingCode || existingCode.partnerId !== partner.id) {
            return NextResponse.json(
                { error: 'Code not found' },
                { status: 404 }
            );
        }

        await prisma.partnerCode.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Code deleted successfully' });
    } catch (error) {
        console.error('Delete code error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
