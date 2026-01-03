// app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, services, staff, payments, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = Number(params.id);

    // Ambil booking
    const [bk] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!bk) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ambil service
    const [svc] = await db
      .select()
      .from(services)
      .where(eq(services.id, bk.serviceId));

    // Ambil staff
    const [st] = await db
      .select()
      .from(staff)
      .where(eq(staff.id, bk.staffId));

    // Ambil user
    const [usr] = await db
      .select()
      .from(users)
      .where(eq(users.id, bk.userId));

    // Ambil payment (DP yg sudah dibuat)
    const [pay] = await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingId));

    return NextResponse.json({
      booking: bk,
      service: svc || null,
      staff: st || null,
      user: usr || null,
      payment: pay || null,
    });
  } catch (err) {
    console.error("BOOKING DETAIL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
