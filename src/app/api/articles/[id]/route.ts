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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        published: true,
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ article: mapArticle(article) });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
