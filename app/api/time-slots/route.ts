import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timeSlots } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const slots = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.isActive, true));

  return NextResponse.json(slots);
}
