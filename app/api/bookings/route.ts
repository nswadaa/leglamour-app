// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, payments, services, dpConfig } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, staffId, serviceId, date, time } = body;

    if (!userId || !staffId || !serviceId || !date || !time) {
      return NextResponse.json({ success: false, error: "missing fields" }, { status: 400 });
    }

    // cek slot sudah dipakai (status != cancelled)
    const existing = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.staffId, Number(staffId)),
          eq(bookings.date, date),
          eq(bookings.time, time)
        )
      );

    if (existing.some((e) => e.status !== "cancelled")) {
      return NextResponse.json({ success: false, error: "Slot already booked" }, { status: 409 });
    }

    // Ambil service
    const svc = await db.select().from(services).where(eq(services.id, Number(serviceId)));
    if (!svc.length) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    // Ambil DP config
    const cfg = await db.select().from(dpConfig).limit(1);
    const dpAmount = cfg.length ? cfg[0].amount : 20000;

    // Insert booking
    const [bk] = await db.insert(bookings).values({
      userId: Number(userId),
      staffId: Number(staffId),
      serviceId: Number(serviceId),
      date,
      time,
      dpAmount,
      status: "waiting_payment",
    }).returning({ id: bookings.id });

    // Insert payment
    await db.insert(payments).values({
      bookingId: bk.id,
      method: "qris",
      amount: dpAmount,
      paymentStatus: "pending",
      transactionId: null,
    });

    return NextResponse.json({
      success: true,
      message: "Booking created",
      bookingId: bk.id,
      dpAmount,
      servicePrice: svc[0].price
    });

  } catch (err) {
    console.error("BOOKING POST ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}