import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { requireAdminPermission } from '@/lib/auth';

// GET /api/admin/auctions - List all auctions for admin
export async function GET(request: NextRequest) {
    try {
        await requireAdminPermission('MANAGE_AUCTIONS');
        const prisma = getPrisma();
        const { searchParams } = new URL(request.url);
        
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const whereClause: any = {};
        
        if (status && status !== 'all') {
            whereClause.status = status;
        }
        
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { titleTh: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [auctions, total] = await Promise.all([
            prisma.auction.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    product: {
                        select: { id: true, name: true, sku: true }
                    },
                    winner: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    _count: {
                        select: { bids: true }
                    }
                }
            }),
            prisma.auction.count({ where: whereClause })
        ]);

        return NextResponse.json({
            auctions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching auctions:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch auctions' },
            { status: 500 }
        );
    }
}

// POST /api/admin/auctions - Create new auction
export async function POST(request: NextRequest) {
    try {
        await requireAdminPermission('MANAGE_AUCTIONS');
        const prisma = getPrisma();
        const data = await request.json();

        const {
            productId,
            title,
            titleTh,
            description,
            descriptionTh,
            images,
            startPrice,
            reservePrice,
            bidIncrement,
            startTime,
            endTime
        } = data;

        // Validation
        if (!title || !titleTh || !startPrice || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (endDate <= startDate) {
            return NextResponse.json(
                { error: 'End time must be after start time' },
                { status: 400 }
            );
        }

        // Determine initial status
        const now = new Date();
        const status = startDate <= now ? 'ACTIVE' : 'SCHEDULED';

        const auction = await prisma.auction.create({
            data: {
                productId: productId || null,
                title,
                titleTh,
                description: description || null,
                descriptionTh: descriptionTh || null,
                images: images || [],
                startPrice: parseFloat(startPrice),
                reservePrice: reservePrice ? parseFloat(reservePrice) : null,
                currentPrice: parseFloat(startPrice),
                bidIncrement: bidIncrement ? parseFloat(bidIncrement) : 100,
                startTime: startDate,
                endTime: endDate,
                status
            }
        });

        return NextResponse.json(auction, { status: 201 });
    } catch (error) {
        console.error('Error creating auction:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to create auction' },
            { status: 500 }
        );
    }
}
