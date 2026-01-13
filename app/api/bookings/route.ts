// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, payments, services, dpConfig } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { staffId, serviceId, date, time } = await req.json();

    // ambil service
    const [svc] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));
    if (!svc)
      return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const duration = svc.duration;

    // ambil booking existing
    const existing = await db
      .select({
        time: bookings.time,
        duration: services.duration,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(services, eq(services.id, bookings.serviceId))
      .where(and(eq(bookings.staffId, staffId), eq(bookings.date, date)));

    // cek overlap
    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const start = toMin(time);
    const end = start + duration;

    for (const b of existing) {
      if (b.status === "cancelled") continue;
      const s = toMin(b.time);
      const e = s + b.duration;
      if (start < e && end > s) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 409 }
        );
      }
    }

    // DP
    const [cfg] = await db.select().from(dpConfig).limit(1);
    const dpAmount = cfg?.amount ?? 20000;

    // insert booking
    const [bk] = await db
      .insert(bookings)
      .values({
        userId: user.id,
        staffId,
        serviceId,
        date,
        time,
        dpAmount,
        status: "waiting_payment",
      })
      .returning({ id: bookings.id });

    await db.insert(payments).values({
      bookingId: bk.id,
      method: "qris",
      amount: dpAmount,
      paymentStatus: "pending",
    });

    return NextResponse.json({ success: true, bookingId: bk.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
