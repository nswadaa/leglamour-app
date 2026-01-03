import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { bookingId, reason } = await req.json();

  // Set payment failed
  await db.update(payments)
    .set({
      paymentStatus: "failed"
    })
    .where(eq(payments.bookingId, bookingId));

  // Set booking cancelled → SLOT KEMBALI TERBUKA
  await db.update(bookings)
    .set({
      status: "cancelled"
    })
    .where(eq(bookings.id, bookingId));

  return NextResponse.json({
    message: "Pembayaran dibatalkan",
    reason
  });
}
