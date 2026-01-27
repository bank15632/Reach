// Structured Data (JSON-LD) Components for SEO

interface OrganizationData {
    name: string;
    url: string;
    logo: string;
    description: string;
    contactPoint?: {
        telephone: string;
        contactType: string;
        availableLanguage: string[];
    };
    sameAs?: string[];
}

interface ProductData {
    name: string;
    description: string;
    image: string[];
    sku: string;
    brand: string;
    price: number;
    priceCurrency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    url: string;
    reviewCount?: number;
    ratingValue?: number;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

// Organization Schema
export function OrganizationSchema({ data }: { data: OrganizationData }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        ...(data.contactPoint && {
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: data.contactPoint.telephone,
                contactType: data.contactPoint.contactType,
                availableLanguage: data.contactPoint.availableLanguage,
            },
        }),
        ...(data.sameAs && { sameAs: data.sameAs }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// E-commerce Store Schema
export function WebSiteSchema({ name, url, searchUrl }: { name: string; url: string; searchUrl: string }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${searchUrl}?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Product Schema
export function ProductSchema({ data }: { data: ProductData }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        sku: data.sku,
        brand: {
            '@type': 'Brand',
            name: data.brand,
        },
        offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: data.priceCurrency,
            availability: `https://schema.org/${data.availability}`,
            url: data.url,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            seller: {
                '@type': 'Organization',
                name: 'REACH Pro Store',
            },
        },
        ...(data.reviewCount && data.ratingValue && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: data.ratingValue,
                reviewCount: data.reviewCount,
            },
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ Schema
export function FAQSchema({ items }: { items: FAQItem[] }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Local Business Schema (for physical store if applicable)
export function LocalBusinessSchema({
    name,
    url,
    telephone,
    address,
    geo,
    openingHours,
}: {
    name: string;
    url: string;
    telephone: string;
    address: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    geo: { latitude: number; longitude: number };
    openingHours: string[];
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'SportingGoodsStore',
        name,
        url,
        telephone,
        address: {
            '@type': 'PostalAddress',
            ...address,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
        },
        openingHoursSpecification: openingHours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours.split(' ')[0],
            opens: hours.split(' ')[1]?.split('-')[0],
            closes: hours.split(' ')[1]?.split('-')[1],
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Default organization data for the store
export const defaultOrganization: OrganizationData = {
    name: 'REACH Pro Store',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reach-store.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reach-store.com'}/logo.jpg`,
    description: 'Premium badminton equipment store with worldwide shipping. Professional rackets, shoes, and sportswear.',
    contactPoint: {
        telephone: '+66-XX-XXX-XXXX',
        contactType: 'customer service',
        availableLanguage: ['English', 'Thai'],
    },
    sameAs: [
        'https://www.facebook.com/reachbadminton',
        'https://www.instagram.com/reachbadminton',
        'https://www.tiktok.com/@reachbadminton',
    ],
};
