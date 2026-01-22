import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// Get withdrawal history
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

        const withdrawals = await prisma.partnerWithdrawal.findMany({
            where: { partnerId: partner.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error('Get withdrawals error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Request withdrawal
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
        const { amount, bankName, bankAccount, bankHolder } = body;

        // Validate amount
        if (!amount || amount < 100) {
            return NextResponse.json(
                { error: 'Minimum withdrawal amount is 100 THB' },
                { status: 400 }
            );
        }

        if (amount > partner.availableCommission) {
            return NextResponse.json(
                { error: 'Insufficient balance' },
                { status: 400 }
            );
        }

        // Validate bank info
        if (!bankName || !bankAccount || !bankHolder) {
            return NextResponse.json(
                { error: 'Bank information is required' },
                { status: 400 }
            );
        }

        // Check for pending withdrawal
        const pendingWithdrawal = await prisma.partnerWithdrawal.findFirst({
            where: {
                partnerId: partner.id,
                status: { in: ['PENDING', 'PROCESSING'] },
            },
        });

        if (pendingWithdrawal) {
            return NextResponse.json(
                { error: 'You already have a pending withdrawal request' },
                { status: 400 }
            );
        }

        // Create withdrawal request
        const withdrawal = await prisma.partnerWithdrawal.create({
            data: {
                partnerId: partner.id,
                amount,
                bankName,
                bankAccount,
                bankHolder,
                status: 'PENDING',
            },
        });

        // Deduct from available commission
        await prisma.partner.update({
            where: { id: partner.id },
            data: {
                availableCommission: { decrement: amount },
            },
        });

        return NextResponse.json({ withdrawal }, { status: 201 });
    } catch (error) {
        console.error('Request withdrawal error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
