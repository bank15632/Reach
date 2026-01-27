import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

function mapArticle(article: any) {
  return {
    id: article.slug || article.id,
    title: article.titleTh || article.title,
    titleEn: article.title,
    excerpt: article.excerptTh || article.excerpt || "",
    excerptEn: article.excerpt || "",
    heroImage: article.heroImage || article.coverImage || "",
    image: article.image || article.heroImage || article.coverImage || "",
    category: article.category,
    categoryTh: article.categoryTh || article.category,
    date: article.publishedAt
      ? new Date(article.publishedAt).toISOString().split("T")[0]
      : new Date(article.createdAt).toISOString().split("T")[0],
    sections: article.sections || [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 100);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { published: true };
    if (category) {
      where.OR = [
        { category: { equals: category, mode: "insensitive" } },
        { categoryTh: { equals: category, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles: articles.map(mapArticle),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
