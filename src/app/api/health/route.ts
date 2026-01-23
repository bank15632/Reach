import { NextResponse } from 'next/server';

export async function GET() {
    const checks = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: {
            configured: !!process.env.DATABASE_URL,
            // Don't expose actual URL, just check if it starts with expected pattern
            provider: process.env.DATABASE_URL?.includes('neon') ? 'neon' : 'unknown',
        },
        jwt: {
            configured: !!process.env.JWT_SECRET,
            isDefault: process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production',
        },
        prisma: {
            configured: false,
            error: null as string | null,
        },
    };

    // Test Prisma connection
    try {
        const { default: prisma } = await import('@/lib/db/prisma');
        await prisma.$queryRaw`SELECT 1`;
        checks.prisma.configured = true;
    } catch (error) {
        checks.prisma.error = error instanceof Error ? error.message : 'Unknown error';
    }

    const allConfigured = 
        checks.database.configured && 
        checks.jwt.configured && 
        !checks.jwt.isDefault &&
        checks.prisma.configured;

    return NextResponse.json({
        status: allConfigured ? 'healthy' : 'unhealthy',
        checks,
    }, {
        status: allConfigured ? 200 : 503,
    });
}
