import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/lib/schema";

/* ===== GET ALL ===== */
export async function GET() {
  try {
    const data = await db.select().from(staff);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/staff error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* ===== CREATE ===== */
export async function POST(req: Request) {
  try {
    const { name, role, is_active } = await req.json();

    await db.insert(staff).values({
      name,
      role,
      isActive: is_active ?? 1,
    });

    return NextResponse.json({ message: "Staff added" });
  } catch (error) {
    console.error("POST /api/staff error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
