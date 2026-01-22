import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// Generate unique affiliate code
async function generateAffiliateCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let exists = true;

    while (exists) {
        const random = Array.from({ length: 6 }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
        code = `REACH${random}`;

        const existing = await prisma.partner.findUnique({
            where: { affiliateCode: code },
        });
        exists = !!existing;
    }

    return code!;
}

// Register as partner
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if already a partner
        const existingPartner = await prisma.partner.findUnique({
            where: { userId: user.id },
        });

        if (existingPartner) {
            return NextResponse.json(
                { error: 'Already registered as partner' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { socialMedia } = body;

        // Generate affiliate code
        const affiliateCode = await generateAffiliateCode();

        // Create partner
        const partner = await prisma.partner.create({
            data: {
                userId: user.id,
                affiliateCode,
                socialMedia,
                status: 'PENDING', // Requires admin approval
            },
            include: {
                codes: true,
                withdrawals: true,
                rewardClaims: true,
            },
        });

        // Update user role
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'PARTNER' },
        });

        return NextResponse.json({ partner }, { status: 201 });
    } catch (error) {
        console.error('Partner registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get partner info
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
            include: {
                codes: {
                    orderBy: { createdAt: 'desc' },
                },
                withdrawals: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                rewardClaims: {
                    orderBy: { claimedAt: 'desc' },
                },
            },
        });

        if (!partner) {
            return NextResponse.json(
                { error: 'Not a partner' },
                { status: 404 }
            );
        }

        return NextResponse.json({ partner });
    } catch (error) {
        console.error('Get partner error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
