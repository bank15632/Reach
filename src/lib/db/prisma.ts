import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';

// Singleton instance
let prismaInstance: PrismaClient | null = null;

// Get or create Prisma client (lazy initialization)
export function getPrisma(): PrismaClient {
    if (prismaInstance) {
        return prismaInstance;
    }

    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set');
    }

    console.log('[Prisma] Initializing...');
    
    // Disable WebSocket pooling - use fetch instead
    neonConfig.poolQueryViaFetch = true;
    neonConfig.fetchConnectionCache = true;

    // Create Pool - it will use HTTP via fetch due to neonConfig above
    const pool = new Pool({ connectionString });
    
    console.log('[Prisma] Created Pool');

    const adapter = new PrismaNeon(pool);

    console.log('[Prisma] Created adapter');

    prismaInstance = new PrismaClient({
        adapter,
        log: ['error'],
    });

    console.log('[Prisma] Created PrismaClient');

    return prismaInstance;
}

// For backward compatibility - but this will be evaluated at import time
// Use getPrisma() instead for guaranteed lazy initialization
export const prisma = {
    get user() { return getPrisma().user; },
    get session() { return getPrisma().session; },
    get address() { return getPrisma().address; },
    get product() { return getPrisma().product; },
    get productVariant() { return getPrisma().productVariant; },
    get bundle() { return getPrisma().bundle; },
    get bundleItem() { return getPrisma().bundleItem; },
    get order() { return getPrisma().order; },
    get orderItem() { return getPrisma().orderItem; },
    get partner() { return getPrisma().partner; },
    get partnerCode() { return getPrisma().partnerCode; },
    get partnerWithdrawal() { return getPrisma().partnerWithdrawal; },
    get partnerRewardClaim() { return getPrisma().partnerRewardClaim; },
    get tournament() { return getPrisma().tournament; },
    get tournamentMatch() { return getPrisma().tournamentMatch; },
    get article() { return getPrisma().article; },
    $queryRaw: (...args: Parameters<PrismaClient['$queryRaw']>) => getPrisma().$queryRaw(...args),
    $executeRaw: (...args: Parameters<PrismaClient['$executeRaw']>) => getPrisma().$executeRaw(...args),
    $transaction: (...args: Parameters<PrismaClient['$transaction']>) => getPrisma().$transaction(...args),
    $disconnect: () => getPrisma().$disconnect(),
    $connect: () => getPrisma().$connect(),
};

export default prisma;
