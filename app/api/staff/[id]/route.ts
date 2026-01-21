import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staff } from "@/lib/schema";
import { eq } from "drizzle-orm";

/* ===== GET STAFF BY ID ===== */
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const staffId = Number(id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { message: "Invalid staff ID" },
        { status: 400 },
      );
    }

    const data = await db
      .select({
        id: staff.id,
        name: staff.name,
        role: staff.role,
        isActive: staff.isActive,
      })
      .from(staff)
      .where(eq(staff.id, staffId))
      .limit(1);

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Staff tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("GET /api/staff/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ===== UPDATE ===== */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const staffId = Number(id);

    const { name, role, is_active } = await req.json();

    await db
      .update(staff)
      .set({
        name,
        role,
        isActive: is_active,
      })
      .where(eq(staff.id, staffId));

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ===== DELETE ===== */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const staffId = Number(id);

    await db.delete(staff).where(eq(staff.id, staffId));
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
