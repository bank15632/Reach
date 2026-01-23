import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Node.js (Vercel Serverless)
neonConfig.webSocketConstructor = ws;

// Singleton instance
let prismaInstance: PrismaClient | null = null;

// Parse PostgreSQL connection string into components
function parseConnectionString(url: string) {
    const regex = /^postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)(\?.*)?$/;
    const match = url.match(regex);
    
    if (!match) {
        throw new Error('Invalid connection string format');
    }

    const [, user, password, hostWithPort, database, queryString] = match;
    const [host, port] = hostWithPort.split(':');

    return {
        user: decodeURIComponent(user),
        password: decodeURIComponent(password),
        host,
        port: port ? parseInt(port, 10) : 5432,
        database,
        ssl: queryString?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
    };
}

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
    console.log('[Prisma] Connection string length:', connectionString.length);

    // Parse and create Pool with explicit parameters
    const config = parseConnectionString(connectionString);
    console.log('[Prisma] Parsed host:', config.host);
    console.log('[Prisma] Parsed database:', config.database);

    const pool = new Pool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new PrismaNeon(pool as any);

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
