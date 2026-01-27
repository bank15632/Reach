import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getPrisma } from './db/prisma';
import { AdminPermissionKey, hasAdminPermission, isAdminRole, isSuperAdmin } from './adminAccess';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const TOKEN_EXPIRY = '7d';

// Password utilities
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): { userId: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

// Session management
export async function createSession(userId: string): Promise<string> {
    const prisma = getPrisma();
    const token = generateToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
}

export async function deleteSession(token: string): Promise<void> {
    const prisma = getPrisma();
    await prisma.session.deleteMany({
        where: { token },
    });
}

export async function getSessionUser(token: string) {
    const prisma = getPrisma();
    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    emailVerified: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true,
                    role: true,
                    adminPermissions: true,
                    rewardPoints: true,
                    partnerInfo: {
                        include: {
                            codes: true,
                            withdrawals: true,
                            rewardClaims: true,
                        },
                    },
                },
            },
        },
    });

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await deleteSession(token);
        }
        return null;
    }

    return session.user;
}

// Get current user from cookies
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return null;
    }

    return getSessionUser(token);
}

// Auth middleware helper
export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if (!isAdminRole(user.role)) {
        throw new Error('Forbidden');
    }

    return user;
}

export async function requireSuperAdmin() {
    const user = await requireAuth();

    if (!isSuperAdmin(user.role)) {
        throw new Error('Forbidden');
    }

    return user;
}

export async function requireAdminPermission(permission: AdminPermissionKey) {
    const user = await requireAuth();

    if (!hasAdminPermission(user.role, user.adminPermissions, permission)) {
        throw new Error('Forbidden');
    }

    return user;
}

export async function requirePartner() {
    const user = await requireAuth();

    if (user.role !== 'PARTNER' && !isAdminRole(user.role)) {
        throw new Error('Forbidden');
    }

    return user;
}
