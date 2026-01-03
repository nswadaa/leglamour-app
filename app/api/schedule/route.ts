import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";

const ALL_SLOTS = ["09:00","11:00","13:00","15:00","17:00","19:00","21:00"];

export async function POST(req: Request) {
  const { staffId, date } = await req.json();

  if (!staffId || !date) {
    return NextResponse.json({ error: "staffId and date required" }, { status: 400 });
  }

  // Ambil semua booking untuk staff+date yang status != cancelled
  const taken = await db
    .select({ time: bookings.time, status: bookings.status })
    .from(bookings)
    .where(and(
      eq(bookings.staffId, staffId),
      eq(bookings.date, date),
    ));

  // treat any non-cancelled booking as "taken"
  const takenTimes = taken.filter(t => t.status !== "cancelled").map(t => t.time);

  const available = ALL_SLOTS.filter(s => !takenTimes.includes(s));

  return NextResponse.json({ date, staffId, available, taken: takenTimes });
}
