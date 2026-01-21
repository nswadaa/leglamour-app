import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/drizzle/schema";
import { desc } from "drizzle-orm";

/* ================= GET (ADMIN) ================= */
// admin lihat SEMUA review (true & false)
export async function GET() {
  const data = await db.select().from(reviews).orderBy(desc(reviews.createdAt));

  return NextResponse.json(data);
}
