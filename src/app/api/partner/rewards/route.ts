import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// Partner reward levels (points required and reward value)
const PARTNER_REWARDS = [
    { level: 1, pointsRequired: 100, rewardName: 'Level 1 Reward', rewardValue: 500 },
    { level: 2, pointsRequired: 500, rewardName: 'Level 2 Reward', rewardValue: 1500 },
    { level: 3, pointsRequired: 1000, rewardName: 'Level 3 Reward', rewardValue: 3000 },
    { level: 4, pointsRequired: 3000, rewardName: 'Level 4 Reward', rewardValue: 5000 },
    { level: 5, pointsRequired: 5000, rewardName: 'Level 5 Reward', rewardValue: 10000 },
    { level: 6, pointsRequired: 10000, rewardName: 'Level 6 Reward', rewardValue: 20000 },
    { level: 7, pointsRequired: 30000, rewardName: 'Level 7 Reward', rewardValue: 50000 },
    { level: 8, pointsRequired: 50000, rewardName: 'Level 8 Reward', rewardValue: 100000 },
];

// Get reward claims history
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

        // Calculate current level and available rewards
        let currentLevel = 0;
        for (const reward of PARTNER_REWARDS) {
            if (partner.partnerPoints >= reward.pointsRequired) {
                currentLevel = reward.level;
            }
        }

        const availableRewards = PARTNER_REWARDS.map(reward => ({
            ...reward,
            unlocked: partner.partnerPoints >= reward.pointsRequired,
            claimed: partner.claimedLevels.includes(reward.level),
        }));

        return NextResponse.json({
            currentLevel,
            partnerPoints: partner.partnerPoints,
            claimedLevels: partner.claimedLevels,
            rewardClaims: partner.rewardClaims,
            availableRewards,
        });
    } catch (error) {
        console.error('Get rewards error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Claim a reward
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
        const { level } = body;

        // Find the reward
        const reward = PARTNER_REWARDS.find(r => r.level === level);

        if (!reward) {
            return NextResponse.json(
                { error: 'Invalid reward level' },
                { status: 400 }
            );
        }

        // Check if already claimed
        if (partner.claimedLevels.includes(level)) {
            return NextResponse.json(
                { error: 'Reward already claimed' },
                { status: 400 }
            );
        }

        // Check if enough points
        if (partner.partnerPoints < reward.pointsRequired) {
            return NextResponse.json(
                { error: 'Not enough points to claim this reward' },
                { status: 400 }
            );
        }

        // Create reward claim
        const claim = await prisma.partnerRewardClaim.create({
            data: {
                partnerId: partner.id,
                level: reward.level,
                rewardName: reward.rewardName,
                rewardValue: reward.rewardValue,
            },
        });

        // Update partner
        await prisma.partner.update({
            where: { id: partner.id },
            data: {
                claimedLevels: { push: level },
                currentLevel: Math.max(partner.currentLevel, level),
                // Add reward value to available commission
                availableCommission: { increment: reward.rewardValue },
            },
        });

        return NextResponse.json({
            message: 'Reward claimed successfully',
            claim,
            rewardValue: reward.rewardValue,
        }, { status: 201 });
    } catch (error) {
        console.error('Claim reward error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
