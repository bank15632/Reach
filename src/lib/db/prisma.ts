import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neon } from '@neondatabase/serverless';

// Singleton instance
let prismaInstance: PrismaClient | null = null;

// Get or create Prisma client (lazy initialization)
export function getPrisma(): PrismaClient {
    if (prismaInstance) {
        return prismaInstance;
    }

    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        throw new Error(
            `DATABASE_URL is not set. ` +
            `Type: ${typeof connectionString}, ` +
            `Value: ${connectionString}`
        );
    }

    // Use Neon HTTP driver
    const sql = neon(connectionString);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaNeon(sql as any);

    prismaInstance = new PrismaClient({
        adapter,
        log: ['error'],
    });

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
