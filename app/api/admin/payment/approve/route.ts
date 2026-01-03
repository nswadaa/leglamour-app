import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { bookingId } = body;
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  await db.update(payments).set({ paymentStatus: "success" })
    .where(eq(payments.bookingId, bookingId));

  await db.update(bookings).set({ status: "paid" })
    .where(eq(bookings.id, bookingId));

  return NextResponse.json({ message: "Payment approved and booking marked as paid" });
}
