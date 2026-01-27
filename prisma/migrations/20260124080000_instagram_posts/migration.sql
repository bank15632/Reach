-- CreateTable
CREATE TABLE "instagram_posts" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "handle" TEXT,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "instagram_posts_isActive_sortOrder_idx" ON "instagram_posts"("isActive", "sortOrder");
