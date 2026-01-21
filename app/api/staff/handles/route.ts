import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const data = await db
    .select({
      role: staff.role,
    })
    .from(staff)
    .where(eq(staff.isActive, true))
    .groupBy(staff.role);

  return NextResponse.json(data);
}
