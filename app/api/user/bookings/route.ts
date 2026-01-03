import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, services, staff, payments } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const rows = await db
    .select({
      id: bookings.id,
      date: bookings.date,
      time: bookings.time,
      status: bookings.status,
      serviceName: services.name,
      staffName: staff.name,
      amount: payments.amount,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId
    })
    .from(bookings)
    .leftJoin(services, eq(services.id, bookings.serviceId))
    .leftJoin(staff, eq(staff.id, bookings.staffId))
    .leftJoin(payments, eq(payments.bookingId, bookings.id))
    .where(eq(bookings.userId, Number(userId)))
    .orderBy(bookings.date);

  return NextResponse.json({ bookings: rows });
}
