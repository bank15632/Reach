-- Remove old tournament tables
DROP TABLE IF EXISTS "tournament_matches" CASCADE;
DROP TABLE IF EXISTS "tournaments" CASCADE;
DROP TYPE IF EXISTS "TournamentStatus" CASCADE;
DROP TYPE IF EXISTS "MatchStatus" CASCADE;

-- Add weight to products for shipping calculation
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "weight" DOUBLE PRECISION;

-- Update addresses for international support
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "address2" TEXT;
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'TH';

-- Make Thai-specific fields nullable for international addresses
ALTER TABLE "addresses" ALTER COLUMN "subDistrict" DROP NOT NULL;
ALTER TABLE "addresses" ALTER COLUMN "district" DROP NOT NULL;
ALTER TABLE "addresses" ALTER COLUMN "province" DROP NOT NULL;

-- Auction Status Enum
DO $$ BEGIN
    CREATE TYPE "AuctionStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED', 'COMPLETED', 'CANCELLED', 'NO_BIDS', 'UNPAID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Auction Payment Status Enum
DO $$ BEGIN
    CREATE TYPE "AuctionPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment Provider Enum
DO $$ BEGIN
    CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER', 'PROMPTPAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Email Type Enum
DO $$ BEGIN
    CREATE TYPE "EmailType" AS ENUM ('ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'AUCTION_OUTBID', 'AUCTION_WON', 'AUCTION_PAYMENT_REMINDER', 'PASSWORD_RESET', 'WELCOME');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Email Status Enum
DO $$ BEGIN
    CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Auctions Table
CREATE TABLE IF NOT EXISTS "auctions" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "title" TEXT NOT NULL,
    "titleTh" TEXT NOT NULL,
    "description" TEXT,
    "descriptionTh" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startPrice" DOUBLE PRECISION NOT NULL,
    "reservePrice" DOUBLE PRECISION,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "bidIncrement" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "winnerId" TEXT,
    "winningBid" DOUBLE PRECISION,
    "paymentDeadline" TIMESTAMP(3),
    "paymentStatus" "AuctionPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- Bids Table
CREATE TABLE IF NOT EXISTS "bids" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isWinning" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- Bidder Blacklist Table
CREATE TABLE IF NOT EXISTS "bidder_blacklist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "unpaidAuctions" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "bidder_blacklist_pkey" PRIMARY KEY ("id")
);

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS "shipping_zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "baseRate" DOUBLE PRECISION NOT NULL,
    "perKgRate" DOUBLE PRECISION NOT NULL,
    "freeShippingThreshold" DOUBLE PRECISION,
    "estimatedDays" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_zones_pkey" PRIMARY KEY ("id")
);

-- Payments Table
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "auctionId" TEXT,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "amountUsd" DOUBLE PRECISION,
    "exchangeRate" DOUBLE PRECISION,
    "provider" "PaymentProvider" NOT NULL,
    "providerId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS "email_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Keys
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "bids" ADD CONSTRAINT "bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bids" ADD CONSTRAINT "bids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bidder_blacklist" ADD CONSTRAINT "bidder_blacklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Unique constraint on blacklist
CREATE UNIQUE INDEX IF NOT EXISTS "bidder_blacklist_userId_key" ON "bidder_blacklist"("userId");

-- Insert default shipping zones
INSERT INTO "shipping_zones" ("id", "name", "countries", "baseRate", "perKgRate", "freeShippingThreshold", "estimatedDays", "isActive", "createdAt", "updatedAt")
VALUES 
    ('zone_domestic', 'Thailand (Domestic)', ARRAY['TH'], 50, 20, 1500, '1-3 business days', true, NOW(), NOW()),
    ('zone_asean', 'ASEAN', ARRAY['SG', 'MY', 'ID', 'PH', 'VN', 'MM', 'KH', 'LA', 'BN'], 350, 150, 5000, '5-7 business days', true, NOW(), NOW()),
    ('zone_asia', 'Asia Pacific', ARRAY['JP', 'KR', 'CN', 'HK', 'TW', 'AU', 'NZ', 'IN'], 500, 200, 8000, '7-10 business days', true, NOW(), NOW()),
    ('zone_europe', 'Europe', ARRAY['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'AT', 'CH', 'PL', 'CZ', 'PT', 'IE'], 800, 300, 10000, '10-14 business days', true, NOW(), NOW()),
    ('zone_americas', 'Americas', ARRAY['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE'], 900, 350, 12000, '10-14 business days', true, NOW(), NOW()),
    ('zone_middle_east', 'Middle East', ARRAY['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IL', 'TR'], 600, 250, 8000, '7-10 business days', true, NOW(), NOW())
ON CONFLICT DO NOTHING;
