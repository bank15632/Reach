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

export async function GET(request: NextRequest) {
  try {
    await requireAdminPermission("MANAGE_ARTICLES");

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { titleTh: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "published") where.published = true;
    if (status === "draft") where.published = false;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin articles:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminPermission("MANAGE_ARTICLES");

    const body = await request.json();

    if (!body.slug || !body.title || !body.titleTh) {
      return NextResponse.json(
        { error: "slug, title, and titleTh are required" },
        { status: 400 }
      );
    }

    const tags = parseStringArray(body.tags);
    const sections = parseJsonField(body.sections, "sections");

    const published = Boolean(body.published);
    const publishedAt = published ? new Date() : null;

    const article = await prisma.article.create({
      data: {
        slug: body.slug,
        title: body.title,
        titleTh: body.titleTh,
        excerpt: body.excerpt || null,
        excerptTh: body.excerptTh || null,
        coverImage: body.coverImage || null,
        heroImage: body.heroImage || null,
        image: body.image || null,
        category: body.category || "General",
        categoryTh: body.categoryTh || body.category || "ทั่วไป",
        sections,
        content: body.content || null,
        contentTh: body.contentTh || null,
        tags,
        authorName: body.authorName || "REACH",
        authorPhoto: body.authorPhoto || null,
        published,
        publishedAt,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error creating article:", error);

    if (error instanceof Error && error.message.startsWith("Invalid JSON")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
