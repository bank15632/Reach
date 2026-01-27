-- Add SUPER_ADMIN role
DO $$ BEGIN
    ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin permissions enum
DO $$ BEGIN
    CREATE TYPE "AdminPermission" AS ENUM (
        'VIEW_DASHBOARD',
        'MANAGE_PRODUCTS',
        'MANAGE_ORDERS',
        'MANAGE_USERS',
        'MANAGE_PARTNERS',
        'MANAGE_ARTICLES',
        'MANAGE_AUCTIONS'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add permissions column to users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "adminPermissions" "AdminPermission"[] DEFAULT '{}'::"AdminPermission"[];

