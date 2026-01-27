import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/auth";
import prisma from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdminPermission("MANAGE_PARTNERS");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const withdrawals = await prisma.partnerWithdrawal.findMany({
      where: { status },
      include: {
        partner: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdminPermission("MANAGE_PARTNERS");

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const processedAt =
      status === "COMPLETED" || status === "REJECTED" ? new Date() : null;

    const withdrawal = await prisma.partnerWithdrawal.update({
      where: { id },
      data: {
        status,
        processedAt,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({ withdrawal });
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update withdrawal" }, { status: 500 });
  }
}
