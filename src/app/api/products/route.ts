import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { Category } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Query parameters
        const category = searchParams.get('category') as Category | null;
        const brand = searchParams.get('brand');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const featured = searchParams.get('featured');
        const inStock = searchParams.get('inStock');
        const search = searchParams.get('search');
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build where clause
        const where: Record<string, unknown> = {};

        if (category) {
            where.category = category;
        }

        if (brand) {
            where.brand = brand;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
            if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
        }

        if (featured === 'true') {
            where.featured = true;
        }

        if (inStock === 'true') {
            where.inStock = true;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { nameTh: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count
        const total = await prisma.product.count({ where });

        // Get products
        const products = await prisma.product.findMany({
            where,
            include: {
                variants: true,
            },
            orderBy: {
                [sort]: order,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Admin: Create product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                sku: body.sku,
                name: body.name,
                nameTh: body.nameTh,
                description: body.description,
                descriptionTh: body.descriptionTh,
                price: body.price,
                salePrice: body.salePrice,
                category: body.category,
                brand: body.brand,
                images: body.images || [],
                inStock: body.inStock ?? true,
                stockCount: body.stockCount || 0,
                featured: body.featured || false,
            },
            include: {
                variants: true,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
