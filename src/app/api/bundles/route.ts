import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const active = searchParams.get("active");

        const where: Record<string, unknown> = {};
        if (active !== "false") {
            where.isActive = true;
        }

        const total = await prisma.bundle.count({ where });
        const bundles = await prisma.bundle.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({
            bundles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get bundles error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
