import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, requireSuperAdmin } from '@/lib/auth';
import { ADMIN_PERMISSION_KEYS } from '@/lib/adminAccess';
import prisma from '@/lib/db/prisma';

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await requireAdminPermission('MANAGE_USERS');

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
                adminPermissions: true,
                rewardPoints: true,
                createdAt: true,
                orders: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        total: true,
                        createdAt: true,
                    },
                },
                partnerInfo: {
                    select: {
                        id: true,
                        affiliateCode: true,
                        status: true,
                        totalCommission: true,
                        totalSales: true,
                        totalOrders: true,
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const admin = await requireSuperAdmin();

        const { id } = await params;
        const body = await request.json();

        // Prevent admin from changing their own role
        if (id === admin.id && body.role && body.role !== admin.role) {
            return NextResponse.json(
                { error: 'Cannot change your own role' },
                { status: 400 }
            );
        }

        const allowedRoles = ['USER', 'PARTNER', 'ADMIN', 'SUPER_ADMIN'];
        const nextRole = typeof body.role === 'string' && allowedRoles.includes(body.role)
            ? body.role
            : undefined;
        const nextPermissions = Array.isArray(body.adminPermissions)
            ? body.adminPermissions.filter((perm: string) => (ADMIN_PERMISSION_KEYS as readonly string[]).includes(perm))
            : undefined;

        const adminPermissionsData =
            typeof nextRole === 'string'
                ? (nextRole === 'ADMIN' ? (nextPermissions || []) : [])
                : nextPermissions;

        const user = await prisma.user.update({
            where: { id },
            data: {
                role: nextRole,
                adminPermissions: adminPermissionsData,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
                adminPermissions: true,
                rewardPoints: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error updating user:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
