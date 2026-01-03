import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, services, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, booking.serviceId));

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const amount = service.price;

    const trxId = "QR-" + Date.now();

    await db.insert(payments).values({
      bookingId,
      method: "qris",
      amount,
      transactionId: trxId,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      qrLink: `/qris/${trxId}`,
      transactionId: trxId,
      amount,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
