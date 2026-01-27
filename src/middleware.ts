import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value;

        if (pathname === '/admin/login') {
            const targetUrl = new URL(token ? '/profile' : '/login', request.url);
            return NextResponse.redirect(targetUrl);
        }

        // No token - redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Token exists - let the page handle role verification
        // (We can't access database in middleware edge runtime)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
