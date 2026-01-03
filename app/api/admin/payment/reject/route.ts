import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { bookingId, reason } = body;
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  await db.update(payments).set({ paymentStatus: "failed" })
    .where(eq(payments.bookingId, bookingId));

  await db.update(bookings).set({ status: "cancelled" })
    .where(eq(bookings.id, bookingId));

  return NextResponse.json({ message: "Payment rejected and booking cancelled", reason });
}
