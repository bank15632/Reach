import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reach-store.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/rackets',
        '/shoes',
        '/sportswear',
        '/bundles',
        '/supplements',
        '/courts',
        '/articles',
        '/auctions',
        '/sale',
        '/contact',
        '/faq',
        '/returns',
        '/welcome',
        '/affiliate',
        '/login',
    ];

    const staticRoutes = staticPages.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : route.includes('shop') || route.includes('rackets') ? 0.9 : 0.7,
    }));

    // Dynamic pages - products (would be fetched from database in production)
    // For now, using placeholder structure
    const productCategories = ['rackets', 'shoes', 'sportswear', 'bundles', 'supplements'];
    
    // In production, fetch actual products:
    // const prisma = getPrisma();
    // const products = await prisma.product.findMany({ select: { id: true, category: true, updatedAt: true } });
    
    // Placeholder for product pages
    const productRoutes: MetadataRoute.Sitemap = [];

    // Dynamic pages - articles (would be fetched from database)
    // const articles = await prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    
    // Dynamic pages - auctions (would be fetched from database)
    // const auctions = await prisma.auction.findMany({ select: { id: true, updatedAt: true } });

    return [
        ...staticRoutes,
        ...productRoutes,
    ];
}
