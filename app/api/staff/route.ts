import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");

    let result;

    if (active === "1") {
      result = await db
        .select()
        .from(staff)
        .where(eq(staff.isActive, 1));
    } else {
      result = await db.select().from(staff);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("STAFF API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}
