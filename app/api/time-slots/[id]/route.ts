import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timeSlots } from "@/drizzle/schema";
import { eq, and, ne } from "drizzle-orm";

/* ================= UPDATE ================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const slotId = Number(id);
    const body = await req.json();

    if (isNaN(slotId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // 🔥 VALIDASI DUPLIKAT SAAT EDIT
    if (body.time) {
      const duplicate = await db
        .select()
        .from(timeSlots)
        .where(
          and(
            eq(timeSlots.time, body.time),
            ne(timeSlots.id, slotId), // ⬅️ KECUALI DIRINYA SENDIRI
          ),
        )
        .limit(1);

      if (duplicate.length > 0) {
        return NextResponse.json(
          { message: "Jam sudah digunakan" },
          { status: 409 },
        );
      }
    }

    await db
      .update(timeSlots)
      .set({
        ...(body.time && { time: body.time }), // 🔥 INI PENTING
        ...(body.is_active !== undefined && {
          isActive: body.is_active,
        }),
      })
      .where(eq(timeSlots.id, slotId));

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await db.delete(timeSlots).where(eq(timeSlots.id, Number(id)));
  return NextResponse.json({ message: "Deleted" });
}
