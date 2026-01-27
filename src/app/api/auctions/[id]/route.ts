import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

// GET /api/auctions/[id] - Get auction details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const prisma = getPrisma();
        const { id } = await params;

        const auction = await prisma.auction.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        nameTh: true,
                        description: true,
                        descriptionTh: true,
                        images: true,
                        brand: true
                    }
                },
                bids: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                winner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                _count: {
                    select: { bids: true }
                }
            }
        });

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        // Mask bidder names for privacy (show only first letter + ***)
        const maskedBids = auction.bids.map(bid => ({
            id: bid.id,
            amount: bid.amount,
            createdAt: bid.createdAt.toISOString(),
            isWinning: bid.isWinning,
            bidder: {
                id: bid.user.id,
                name: `${bid.user.firstName.charAt(0)}***`,
                avatar: bid.user.avatar
            }
        }));

        return NextResponse.json({
            id: auction.id,
            title: auction.title,
            titleTh: auction.titleTh,
            description: auction.description,
            descriptionTh: auction.descriptionTh,
            images: auction.images.length > 0 ? auction.images : auction.product?.images || [],
            startPrice: auction.startPrice,
            currentPrice: auction.currentPrice,
            bidIncrement: auction.bidIncrement,
            reservePrice: auction.reservePrice ? true : false, // Don't expose actual amount
            startTime: auction.startTime.toISOString(),
            endTime: auction.endTime.toISOString(),
            status: auction.status,
            bidCount: auction._count.bids,
            bids: maskedBids,
            product: auction.product,
            winner: auction.status === 'COMPLETED' || auction.status === 'ENDED' ? {
                id: auction.winner?.id,
                name: auction.winner ? `${auction.winner.firstName} ${auction.winner.lastName.charAt(0)}.` : null
            } : null,
            winningBid: auction.status === 'COMPLETED' || auction.status === 'ENDED' ? auction.winningBid : null
        });
    } catch (error) {
        console.error('Error fetching auction:', error);
        return NextResponse.json(
            { error: 'Failed to fetch auction' },
            { status: 500 }
        );
    }
}
