import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

export async function GET() {
    try {
        await requireAdmin();

        // Get all stats in parallel
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            pendingOrders,
            lowStockProducts,
            revenueData,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.product.count({ where: { stockCount: { lt: 5 } } }),
            prisma.order.aggregate({
                where: { status: 'DELIVERED' },
                _sum: { total: true },
            }),
        ]);

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: revenueData._sum.total || 0,
            pendingOrders,
            lowStockProducts,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
