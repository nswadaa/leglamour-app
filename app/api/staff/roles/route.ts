import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "../../../../lib/schema";

export async function GET() {
  try {
    const roles = await db
      .select({ role: staff.role })
      .from(staff)
      .groupBy(staff.role);

    return NextResponse.json(roles);
  } catch (error) {
    console.error("GET ROLES ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
