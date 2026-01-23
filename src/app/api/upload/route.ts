import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { requireAdmin } from '@/lib/auth';

// Initialize R2 client
const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'reach-images';
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
    try {
        // Require admin authentication
        await requireAdmin();

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type. Allowed: JPEG, PNG, WebP, GIF`);
                continue;
            }

            // Validate file size
            if (file.size > MAX_SIZE) {
                errors.push(`${file.name}: File too large. Max size: 5MB`);
                continue;
            }

            try {
                // Generate unique filename
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 8);
                const extension = file.name.split('.').pop() || 'jpg';
                const filename = `products/${timestamp}-${randomStr}.${extension}`;

                // Convert file to buffer
                const buffer = Buffer.from(await file.arrayBuffer());

                // Upload to R2
                await R2.send(new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    Body: buffer,
                    ContentType: file.type,
                }));

                // Generate public URL
                const publicUrl = `${PUBLIC_URL}/${filename}`;
                uploadedUrls.push(publicUrl);
            } catch (uploadError) {
                console.error(`Error uploading ${file.name}:`, uploadError);
                errors.push(`${file.name}: Upload failed`);
            }
        }

        if (uploadedUrls.length === 0 && errors.length > 0) {
            return NextResponse.json(
                { error: 'All uploads failed', details: errors },
                { status: 400 }
            );
        }

        return NextResponse.json({
            urls: uploadedUrls,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload error:', error);

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
