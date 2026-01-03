import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, services, staff, users, payments } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      bookingId: bookings.id,
      date: bookings.date,
      time: bookings.time,
      bookingStatus: bookings.status,
      userName: users.name,
      userPhone: users.phone,
      serviceName: services.name,
      staffName: staff.name,
      paymentStatus: payments.paymentStatus,
      paymentTransaction: payments.transactionId,
      proofImage: payments.transactionId // if you saved proof url in transactionId or proofImage column
    })
    .from(bookings)
    .leftJoin(users, eq(users.id, bookings.userId))
    .leftJoin(services, eq(services.id, bookings.serviceId))
    .leftJoin(staff, eq(staff.id, bookings.staffId))
    .leftJoin(payments, eq(payments.bookingId, bookings.id))
    .orderBy(bookings.date);

  return NextResponse.json({ bookings: rows });
}
