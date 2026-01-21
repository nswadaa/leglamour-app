import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timeSlots } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";

/* ================= GET ALL ================= */
export async function GET() {
  const slots = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.isActive, true)) // 🔥 FILTER OPEN SAJA
    .orderBy(timeSlots.time);

  return NextResponse.json(slots);
}

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.time) {
      return NextResponse.json(
        { message: "Time is required" },
        { status: 400 },
      );
    }

    // 🔍 CEK DUPLIKAT
    const exist = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.time, body.time))
      .limit(1);

    if (exist.length > 0) {
      return NextResponse.json(
        { message: "Jam sudah ada" },
        { status: 409 }, // Conflict
      );
    }

    await db.insert(timeSlots).values({
      time: body.time,
      isActive: true,
    });

    return NextResponse.json({ message: "Created" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
