import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/drizzle/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Body diterima server:", body);

    const { userId, serviceId, staffId, date, time } = body;

    if (!serviceId || !staffId || !date || !time) {
      return NextResponse.json(
        { error: "Data booking tidak lengkap" },
        { status: 400 }
      );
    }

    console.log("📌 Data siap insert DB:", {
      userId,
      serviceId,
      staffId,
      date,
      time,
    });

    const result = await db.insert(bookings).values({
      userId,
      serviceId,
      staffId,
      date,
      time,
      status: "waiting_payment",
    });

    console.log("✅ INSERT RESULT:", result);

    // PERBAIKAN DI SINI
    const insertId = result[0].insertId;

    return NextResponse.json({
      message: "Booking berhasil dibuat",
      bookingId: insertId,   // <-- sekarang benar
    });

  } catch (err) {
    console.error("❌ BOOKING ERROR:", err);
    return NextResponse.json(
      { error: "Gagal membuat booking" },
      { status: 500 }
    );
  }
}
