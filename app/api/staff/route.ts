// app/api/staff/route.ts
import { db } from "@/lib/db";
import { staff } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(staff);
  return NextResponse.json(data);
}
