import { NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getPrisma } from '@/lib/db/prisma';

export async function GET() {
    try {
        await requireAdminPermission('VIEW_DASHBOARD');
        const prisma = getPrisma();

        // Get all stats in parallel
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            pendingOrders,
            lowStockProducts,
            revenueData,
            totalArticles,
            totalAuctions,
            activeAuctions,
            totalPartners,
            pendingWithdrawals,
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
            prisma.article.count(),
            prisma.auction.count(),
            prisma.auction.count({ where: { status: 'ACTIVE' } }),
            prisma.partner.count(),
            prisma.partnerWithdrawal.count({ where: { status: 'PENDING' } }),
        ]);

        return NextResponse.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: revenueData._sum.total || 0,
            pendingOrders,
            lowStockProducts,
            totalArticles,
            totalAuctions,
            activeAuctions,
            totalPartners,
            pendingWithdrawals,
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
