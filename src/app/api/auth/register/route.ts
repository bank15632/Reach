import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { hashPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    // Debug: Check DATABASE_URL at request time
    const dbUrl = process.env.DATABASE_URL;
    console.log('[Register] DATABASE_URL exists:', !!dbUrl);
    console.log('[Register] DATABASE_URL length:', dbUrl?.length);
    console.log('[Register] DATABASE_URL starts with:', dbUrl?.substring(0, 30));

    try {
        const body = await request.json();
        const { email, password, firstName, lastName, phone } = body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get Prisma client (lazy initialization)
        const prisma = getPrisma();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                rewardPoints: true,
            },
        });

        // Create session
        const token = await createSession(user.id);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return NextResponse.json({
            message: 'Registration successful',
            user,
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Debug info
        const dbUrl = process.env.DATABASE_URL;
        
        // Always return detailed error for debugging (remove in production later)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        
        return NextResponse.json({
            error: 'Registration failed',
            details: errorMessage,
            type: errorName,
            debug: {
                dbUrlExists: !!dbUrl,
                dbUrlLength: dbUrl?.length,
                dbUrlPrefix: dbUrl?.substring(0, 20),
            }
        }, { status: 500 });
    }
}
