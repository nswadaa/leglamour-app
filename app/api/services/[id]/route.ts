import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timeSlots } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

/* ================= UPDATE ================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  const body = await req.json();

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  await db
    .update(timeSlots)
    .set({
      ...(body.time && { time: body.time }),
      ...(body.is_active !== undefined && { isActive: body.is_active }),
    })
    .where(eq(timeSlots.id, id));

  return NextResponse.json({ message: "Updated" });
}

/* ================= DELETE ================= */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  await db.delete(timeSlots).where(eq(timeSlots.id, id));

  return NextResponse.json({ message: "Deleted" });
}
