import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdminPermission } from "@/lib/auth";

export async function GET() {
    try {
        await requireAdminPermission("MANAGE_ARTICLES");

        const posts = await prisma.instagramPost.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Admin get instagram posts error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to fetch instagram posts" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdminPermission("MANAGE_ARTICLES");

        const body = await request.json();
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
        const handle = typeof body.handle === "string" ? body.handle.trim() : null;
        const link = typeof body.link === "string" ? body.link.trim() : null;
        const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
        const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const post = await prisma.instagramPost.create({
            data: {
                imageUrl,
                handle: handle || null,
                link: link || null,
                isActive,
                sortOrder,
            },
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin create instagram post error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to create instagram post" }, { status: 500 });
    }
}
