import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

// GET /api/shipping/zones - List all shipping zones
export async function GET() {
    try {
        const prisma = getPrisma();
        
        const zones = await prisma.shippingZone.findMany({
            where: { isActive: true },
            orderBy: { baseRate: 'asc' }
        });

        return NextResponse.json({ zones });
    } catch (error) {
        console.error('Error fetching shipping zones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shipping zones' },
            { status: 500 }
        );
    }
}
