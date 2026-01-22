import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// Get partner's codes
export async function GET() {
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

        const codes = await prisma.partnerCode.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ codes });
    } catch (error) {
        console.error('Get codes error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Create new code
export async function POST(request: NextRequest) {
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

        if (partner.status !== 'APPROVED') {
            return NextResponse.json(
                { error: 'Partner account not approved' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            code,
            discountPercent,
            expiryDate,
            maxUses,
            applicableProducts,
            isActive,
        } = body;

        // Validate discount (1-20%)
        if (discountPercent < 1 || discountPercent > 20) {
            return NextResponse.json(
                { error: 'Discount must be between 1% and 20%' },
                { status: 400 }
            );
        }

        // Validate expiry (required, max 1 month)
        if (!expiryDate) {
            return NextResponse.json(
                { error: 'Expiry date is required' },
                { status: 400 }
            );
        }

        const expiry = new Date(expiryDate);
        const maxExpiry = new Date();
        maxExpiry.setMonth(maxExpiry.getMonth() + 1);

        if (expiry > maxExpiry) {
            return NextResponse.json(
                { error: 'Expiry date cannot exceed 1 month' },
                { status: 400 }
            );
        }

        // Check for duplicate code
        const existingCode = await prisma.partnerCode.findUnique({
            where: { code },
        });

        if (existingCode) {
            return NextResponse.json(
                { error: 'Code already exists' },
                { status: 400 }
            );
        }

        const partnerCode = await prisma.partnerCode.create({
            data: {
                partnerId: partner.id,
                code,
                discountPercent,
                expiryDate: expiry,
                maxUses,
                applicableProducts: applicableProducts === 'all' ? [] : applicableProducts,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json({ code: partnerCode }, { status: 201 });
    } catch (error) {
        console.error('Create code error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
