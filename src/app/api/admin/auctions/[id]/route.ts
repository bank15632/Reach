import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { requireAdminPermission } from '@/lib/auth';

// GET /api/admin/auctions/[id] - Get auction details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdminPermission('MANAGE_AUCTIONS');
        const prisma = getPrisma();
        const { id } = await params;

        const auction = await prisma.auction.findUnique({
            where: { id },
            include: {
                product: true,
                winner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                bids: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(auction);
    } catch (error) {
        console.error('Error fetching auction:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json(
            { error: 'Failed to fetch auction' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/auctions/[id] - Update auction
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdminPermission('MANAGE_AUCTIONS');
        const prisma = getPrisma();
        const { id } = await params;
        const data = await request.json();

        const auction = await prisma.auction.findUnique({
            where: { id }
        });

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        // Can't modify active or ended auctions significantly
        if (auction.status === 'ACTIVE') {
            // Only allow extending end time for active auctions
            const updateData: any = {};
            if (data.endTime) {
                const newEndTime = new Date(data.endTime);
                if (newEndTime > auction.endTime) {
                    updateData.endTime = newEndTime;
                }
            }
            if (Object.keys(updateData).length === 0) {
                return NextResponse.json(
                    { error: 'Cannot modify active auction except to extend end time' },
                    { status: 400 }
                );
            }
            const updated = await prisma.auction.update({
                where: { id },
                data: updateData
            });
            return NextResponse.json(updated);
        }

        // For scheduled auctions, allow full updates
        const updateData: any = {};
        
        if (data.title) updateData.title = data.title;
        if (data.titleTh) updateData.titleTh = data.titleTh;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.descriptionTh !== undefined) updateData.descriptionTh = data.descriptionTh;
        if (data.images) updateData.images = data.images;
        if (data.startPrice) {
            updateData.startPrice = parseFloat(data.startPrice);
            updateData.currentPrice = parseFloat(data.startPrice);
        }
        if (data.reservePrice !== undefined) {
            updateData.reservePrice = data.reservePrice ? parseFloat(data.reservePrice) : null;
        }
        if (data.bidIncrement) updateData.bidIncrement = parseFloat(data.bidIncrement);
        if (data.startTime) updateData.startTime = new Date(data.startTime);
        if (data.endTime) updateData.endTime = new Date(data.endTime);
        if (data.status) updateData.status = data.status;

        const updated = await prisma.auction.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating auction:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json(
            { error: 'Failed to update auction' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/auctions/[id] - Delete or cancel auction
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdminPermission('MANAGE_AUCTIONS');
        const prisma = getPrisma();
        const { id } = await params;

        const auction = await prisma.auction.findUnique({
            where: { id },
            include: { _count: { select: { bids: true } } }
        });

        if (!auction) {
            return NextResponse.json(
                { error: 'Auction not found' },
                { status: 404 }
            );
        }

        // If auction has bids, cancel instead of delete
        if (auction._count.bids > 0) {
            await prisma.auction.update({
                where: { id },
                data: { status: 'CANCELLED' }
            });
            return NextResponse.json({ message: 'Auction cancelled (has bids)' });
        }

        // No bids, safe to delete
        await prisma.auction.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Auction deleted' });
    } catch (error) {
        console.error('Error deleting auction:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json(
            { error: 'Failed to delete auction' },
            { status: 500 }
        );
    }
}
