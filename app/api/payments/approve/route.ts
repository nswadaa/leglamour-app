import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { bookingId } = await req.json();

  // Set payment = success
  await db.update(payments)
    .set({
      paymentStatus: "success"
    })
    .where(eq(payments.bookingId, bookingId));

  // Set booking = paid (TIDAK BISA DIPESAN ORANG LAIN)
  await db.update(bookings)
    .set({
      status: "paid"
    })
    .where(eq(bookings.id, bookingId));

  return NextResponse.json({
    message: "Pembayaran berhasil disetujui"
  });
}
