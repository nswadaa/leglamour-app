import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  // ⬅️ WAJIB await
  const { id } = await context.params;
  const reviewId = Number(id);

  if (isNaN(reviewId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1);

  if (!existing.length) {
    return NextResponse.json(
      { message: "Review tidak ditemukan" },
      { status: 404 },
    );
  }

  await db
    .update(reviews)
    .set({ isVisible: !existing[0].isVisible })
    .where(eq(reviews.id, reviewId));

  return NextResponse.json({ success: true });
}
