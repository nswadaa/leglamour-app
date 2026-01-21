import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

/* ================= GET (PUBLIC) ================= */
export async function GET() {
  const data = await db
    .select()
    .from(reviews)
    .where(eq(reviews.isVisible, true))
    .orderBy(desc(reviews.createdAt));

  return NextResponse.json(data);
}

/* ================= POST (PUBLIC) ================= */
export async function POST(req: Request) {
  const { name, review } = await req.json();

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 });
  }

  if (!review || review.trim().length < 5) {
    return NextResponse.json(
      { message: "Review terlalu pendek" },
      { status: 400 },
    );
  }

  await db.insert(reviews).values({
    name,
    review,
    isVisible: false, // nunggu admin
  });

  return NextResponse.json({ message: "Review terkirim" });
}
