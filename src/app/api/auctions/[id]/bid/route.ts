import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST /api/auctions/[id]/bid - Place a bid
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const prisma = getPrisma();
        const { id: auctionId } = await params;

        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required', code: 'AUTH_REQUIRED' },
                { status: 401 }
            );
        }

        // Check if user is email verified
        if (!user.emailVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before bidding', code: 'EMAIL_NOT_VERIFIED' },
                { status: 403 }
            );
        }

        // Check if user is blacklisted
        const blacklist = await prisma.bidderBlacklist.findUnique({
            where: { userId: user.id }
        });

        if (blacklist) {
            // Check if blacklist has expired
            if (!blacklist.expiresAt || blacklist.expiresAt > new Date()) {
                return NextResponse.json(
                    {
                        error: 'You are currently unable to participate in auctions due to previous unpaid bids',
                        code: 'BLACKLISTED',
                        reason: blacklist.reason
                    },
                    { status: 403 }
                );
            }
            // If expired, remove from blacklist
            await prisma.bidderBlacklist.delete({
                where: { userId: user.id }
            });
        }

        const { amount } = await request.json();

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid bid amount' },
                { status: 400 }
            );
        }

        // Get auction with lock for update
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId }
        });

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        const now = new Date();

        // Check auction status
        if (auction.status !== 'ACTIVE') {
            if (auction.status === 'SCHEDULED' && auction.startTime > now) {
                return NextResponse.json(
                    { error: 'Auction has not started yet', code: 'NOT_STARTED' },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: 'Auction is no longer accepting bids', code: 'AUCTION_ENDED' },
                { status: 400 }
            );
        }

        // Check if auction has ended
        if (auction.endTime <= now) {
            return NextResponse.json(
                { error: 'Auction has ended', code: 'AUCTION_ENDED' },
                { status: 400 }
            );
        }

        // Calculate minimum bid
        const minimumBid = auction.currentPrice + auction.bidIncrement;

        if (amount < minimumBid) {
            return NextResponse.json(
                {
                    error: `Minimum bid is ${minimumBid.toLocaleString()} THB`,
                    code: 'BID_TOO_LOW',
                    minimumBid
                },
                { status: 400 }
            );
        }

        // Create bid and update auction in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Mark previous winning bid as not winning
            await tx.bid.updateMany({
                where: { auctionId, isWinning: true },
                data: { isWinning: false }
            });

            // Create new bid
            const newBid = await tx.bid.create({
                data: {
                    auctionId,
                    userId: user.id,
                    amount,
                    isWinning: true
                }
            });

            // Update auction current price
            const updatedAuction = await tx.auction.update({
                where: { id: auctionId },
                data: { currentPrice: amount }
            });

            return { bid: newBid, auction: updatedAuction };
        });

        // TODO: Send outbid notification to previous high bidder

        return NextResponse.json({
            success: true,
            bid: {
                id: result.bid.id,
                amount: result.bid.amount,
                createdAt: result.bid.createdAt.toISOString()
            },
            currentPrice: result.auction.currentPrice
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        return NextResponse.json(
            { error: 'Failed to place bid' },
            { status: 500 }
        );
    }
}
