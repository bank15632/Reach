import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

// GET /api/auctions - List public auctions
export async function GET(request: NextRequest) {
    try {
        const prisma = getPrisma();
        const { searchParams } = new URL(request.url);
        
        const status = searchParams.get('status'); // 'active', 'upcoming', 'ended'
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        const now = new Date();
        
        // Build where clause based on status filter
        let whereClause: any = {};
        
        if (status === 'active') {
            whereClause = {
                status: 'ACTIVE',
                startTime: { lte: now },
                endTime: { gt: now }
            };
        } else if (status === 'upcoming') {
            whereClause = {
                status: 'SCHEDULED',
                startTime: { gt: now }
            };
        } else if (status === 'ended') {
            whereClause = {
                status: { in: ['ENDED', 'COMPLETED', 'NO_BIDS', 'UNPAID'] }
            };
        } else {
            // Default: show active and upcoming
            whereClause = {
                status: { in: ['ACTIVE', 'SCHEDULED'] }
            };
        }

        const [auctions, total] = await Promise.all([
            prisma.auction.findMany({
                where: whereClause,
                orderBy: [
                    { status: 'asc' }, // Active first
                    { endTime: 'asc' }
                ],
                skip,
                take: limit,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            nameTh: true,
                            images: true
                        }
                    },
                    _count: {
                        select: { bids: true }
                    }
                }
            }),
            prisma.auction.count({ where: whereClause })
        ]);

        // Map to public format
        const mappedAuctions = auctions.map(auction => ({
            id: auction.id,
            title: auction.title,
            titleTh: auction.titleTh,
            description: auction.description,
            descriptionTh: auction.descriptionTh,
            images: auction.images.length > 0 ? auction.images : auction.product?.images || [],
            startPrice: auction.startPrice,
            currentPrice: auction.currentPrice,
            bidIncrement: auction.bidIncrement,
            startTime: auction.startTime.toISOString(),
            endTime: auction.endTime.toISOString(),
            status: auction.status,
            bidCount: auction._count.bids,
            product: auction.product ? {
                id: auction.product.id,
                name: auction.product.name,
                nameTh: auction.product.nameTh
            } : null
        }));

        return NextResponse.json({
            auctions: mappedAuctions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching auctions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch auctions' },
            { status: 500 }
        );
    }
}
