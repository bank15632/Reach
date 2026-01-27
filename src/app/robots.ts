import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reach-store.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/profile/',
                    '/checkout/',
                    '/cart/',
                    '/_next/',
                    '/affiliate/dashboard/',
                    '/affiliate/withdraw/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/profile/', '/checkout/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
