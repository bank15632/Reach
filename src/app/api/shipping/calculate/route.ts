import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

// POST /api/shipping/calculate - Calculate shipping cost
export async function POST(request: NextRequest) {
    try {
        const prisma = getPrisma();
        const { country, weight, subtotal } = await request.json();

        if (!country) {
            return NextResponse.json(
                { error: 'Country code is required' },
                { status: 400 }
            );
        }

        // Find shipping zone for the country
        const zones = await prisma.shippingZone.findMany({
            where: { isActive: true }
        });

        const zone = zones.find(z => z.countries.includes(country.toUpperCase()));

        if (!zone) {
            return NextResponse.json({
                available: false,
                message: 'Shipping is not available to this country',
                country
            });
        }

        // Calculate shipping cost
        const productWeight = weight || 0.5; // Default 0.5kg if not provided
        let shippingCost = zone.baseRate + (productWeight * zone.perKgRate);

        // Check for free shipping threshold
        const orderSubtotal = subtotal || 0;
        const freeShipping = zone.freeShippingThreshold && orderSubtotal >= zone.freeShippingThreshold;

        if (freeShipping) {
            shippingCost = 0;
        }

        return NextResponse.json({
            available: true,
            zone: zone.name,
            country,
            shippingCost: Math.round(shippingCost),
            estimatedDays: zone.estimatedDays,
            freeShipping,
            freeShippingThreshold: zone.freeShippingThreshold,
            currency: 'THB'
        });
    } catch (error) {
        console.error('Error calculating shipping:', error);
        return NextResponse.json(
            { error: 'Failed to calculate shipping' },
            { status: 500 }
        );
    }
}

// GET /api/shipping/calculate?country=XX - Get shipping rates for a country
export async function GET(request: NextRequest) {
    try {
        const prisma = getPrisma();
        const { searchParams } = new URL(request.url);
        const country = searchParams.get('country');

        if (!country) {
            // Return all zones
            const zones = await prisma.shippingZone.findMany({
                where: { isActive: true },
                orderBy: { baseRate: 'asc' }
            });

            return NextResponse.json({
                zones: zones.map(zone => ({
                    id: zone.id,
                    name: zone.name,
                    countries: zone.countries,
                    baseRate: zone.baseRate,
                    perKgRate: zone.perKgRate,
                    freeShippingThreshold: zone.freeShippingThreshold,
                    estimatedDays: zone.estimatedDays
                }))
            });
        }

        // Find zone for specific country
        const zones = await prisma.shippingZone.findMany({
            where: { isActive: true }
        });

        const zone = zones.find(z => z.countries.includes(country.toUpperCase()));

        if (!zone) {
            return NextResponse.json({
                available: false,
                message: 'Shipping is not available to this country'
            });
        }

        return NextResponse.json({
            available: true,
            zone: zone.name,
            baseRate: zone.baseRate,
            perKgRate: zone.perKgRate,
            freeShippingThreshold: zone.freeShippingThreshold,
            estimatedDays: zone.estimatedDays,
            currency: 'THB'
        });
    } catch (error) {
        console.error('Error fetching shipping info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shipping info' },
            { status: 500 }
        );
    }
}
