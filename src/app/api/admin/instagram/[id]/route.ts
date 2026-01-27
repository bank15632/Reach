import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAdminPermission } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
    try {
        await requireAdminPermission("MANAGE_ARTICLES");
        const { id } = await params;

        const post = await prisma.instagramPost.findUnique({ where: { id } });
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin get instagram post error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to fetch instagram post" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
    try {
        await requireAdminPermission("MANAGE_ARTICLES");
        const { id } = await params;
        const body = await request.json();

        const data: Record<string, unknown> = {};
        if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl.trim();
        if (typeof body.handle === "string") data.handle = body.handle.trim() || null;
        if (typeof body.link === "string") data.link = body.link.trim() || null;
        if (typeof body.isActive === "boolean") data.isActive = body.isActive;
        if (Number.isFinite(body.sortOrder)) data.sortOrder = Number(body.sortOrder);

        const post = await prisma.instagramPost.update({
            where: { id },
            data,
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Admin update instagram post error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to update instagram post" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
    try {
        await requireAdminPermission("MANAGE_ARTICLES");
        const { id } = await params;

        await prisma.instagramPost.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin delete instagram post error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error instanceof Error && error.message === "Forbidden") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to delete instagram post" }, { status: 500 });
    }
}
