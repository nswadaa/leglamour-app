import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  users,
  bookings,
  payments,
  reviews,
  services,
} from "@/drizzle/schema";
import { count, eq, sql } from "drizzle-orm";

export async function GET() {
  const [customers] = await db
    .select({ total: count() })
    .from(users);

  const [appointments] = await db
    .select({ total: count() })
    .from(bookings);

  const [transactions] = await db
    .select({ total: count() })
    .from(payments);

  const todayAppointments = await db
    .select({
      id: bookings.id,
      userName: users.name,
      serviceName: services.name,
      time: bookings.time,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(sql`date(bookings.date) = curdate()`);

  const latestReviews = await db
    .select()
    .from(reviews)
    .orderBy(sql`created_at desc`)
    .limit(5);

  return NextResponse.json({
    customers: customers.total,
    appointments: appointments.total,
    transactions: transactions.total,
    todayAppointments,
    latestReviews,
  });
}
