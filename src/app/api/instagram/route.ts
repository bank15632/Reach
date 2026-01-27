import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get("limit") || 12);

        const posts = await prisma.instagramPost.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            take: limit,
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Get instagram posts error:", error);
        return NextResponse.json({ error: "Failed to fetch instagram posts" }, { status: 500 });
    }
}
