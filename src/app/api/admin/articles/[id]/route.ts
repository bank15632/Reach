import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/auth";
import prisma from "@/lib/db/prisma";

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter((item) => item.trim().length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseJsonField(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid JSON for ${fieldName}`);
    }
  }
  return value;
}

type Params = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await requireAdminPermission("MANAGE_ARTICLES");
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await requireAdminPermission("MANAGE_ARTICLES");
    const { id } = await params;

    const body = await request.json();

    const tags = body.tags !== undefined ? parseStringArray(body.tags) : undefined;
    const sections = body.sections !== undefined ? parseJsonField(body.sections, "sections") : undefined;
    const published = body.published !== undefined ? Boolean(body.published) : undefined;

    const article = await prisma.article.findUnique({
      where: { id },
      select: { publishedAt: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const publishedAt =
      published === undefined
        ? undefined
        : published
          ? article.publishedAt || new Date()
          : null;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        titleTh: body.titleTh,
        excerpt: body.excerpt,
        excerptTh: body.excerptTh,
        coverImage: body.coverImage,
        heroImage: body.heroImage,
        image: body.image,
        category: body.category,
        categoryTh: body.categoryTh,
        sections,
        content: body.content,
        contentTh: body.contentTh,
        tags,
        authorName: body.authorName,
        authorPhoto: body.authorPhoto,
        published,
        publishedAt,
      },
    });

    return NextResponse.json({ article: updated });
  } catch (error) {
    console.error("Error updating article:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith("Invalid JSON")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await requireAdminPermission("MANAGE_ARTICLES");

    const { id } = await params;
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
