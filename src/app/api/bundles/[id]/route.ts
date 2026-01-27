import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
    try {
        const { id } = await params;

        const bundle = await prisma.bundle.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!bundle) {
            return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
        }

        return NextResponse.json({ bundle });
    } catch (error) {
        console.error("Get bundle error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
