import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingCarts, bookingCartItems } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { services, staff } from "@/drizzle/schema";
import { timeSlots } from "@/drizzle/schema";
import { and, lt, or, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Await expired
async function clearExpiredHolds() {
  await db
    .update(bookingCartItems)
    .set({ status: "EXPIRED" })
    .where(
      and(
        eq(bookingCartItems.status, "HOLD"),
        lt(bookingCartItems.expiresAt, new Date())
      )
    );
}

// GET: ambil isi cart
// GET: ambil isi cart
export async function GET() {
  try {
    await clearExpiredHolds();

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const cart = await db
      .select()
      .from(bookingCarts)
      .where(eq(bookingCarts.userId, user.id))
      .limit(1);

    if (!cart.length) {
      return NextResponse.json({ items: [] });
    }

    const items = await db
      .select({
        id: bookingCartItems.id,
        date: bookingCartItems.date,
        time: bookingCartItems.time,
        expiresAt: bookingCartItems.expiresAt,
        serviceName: services.name,
        staffName: staff.name ?? null,
      })
      .from(bookingCartItems)
      .leftJoin(services, eq(services.id, bookingCartItems.treatmentId))
      .leftJoin(staff, eq(staff.id, bookingCartItems.staffId))
      .where(
        and(
          eq(bookingCartItems.cartId, cart[0].id),
          eq(bookingCartItems.status, "HOLD") // 🔥 FIX
        )
      );

    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

// POST: tambah ke cart (MAX 3)
export async function POST(req: Request) {
  try {
    await clearExpiredHolds();

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { treatmentId, staffId, date, time } = await req.json();
    if (!treatmentId || !staffId || !date || !time) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // ambil / buat cart
    const existingCart = await db
      .select()
      .from(bookingCarts)
      .where(eq(bookingCarts.userId, user.id))
      .limit(1);

    let cartId: number;

    if (!existingCart.length) {
      const result = await db.insert(bookingCarts).values({
        userId: user.id,
      });
      cartId = result.insertId as number;
    } else {
      cartId = existingCart[0].id;
    }

    // cek max 3
    const items = await db
      .select()
      .from(bookingCartItems)
      .where(eq(bookingCartItems.cartId, cartId));

    if (items.length >= 3) {
      return NextResponse.json(
        { message: "Maksimal 3 booking" },
        { status: 400 }
      );
    }

    const HOLD_MINUTES = 10;

    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    console.log("ADD CART PAYLOAD:", {
      treatmentId,
      staffId,
      date,
      time,
    });

    // ================================
    // VALIDASI TIME SLOT (ANTI BYPASS)
    // ================================

    // 1️⃣ ambil time slot dari DB
    const slot = await db
      .select()
      .from(timeSlots)
      .where(sql`${timeSlots.time} LIKE ${time + "%"}`)
      .limit(1);

    if (!slot.length || slot[0].isActive === 0) {
      return NextResponse.json(
        { message: "Jam tidak tersedia" },
        { status: 400 }
      );
    }

    console.log("SLOT RESULT:", slot);

    // ================================
    // HARD TIME VALIDATION (FINAL)
    // ================================

    // parse tanggal
    const [day, month, year] = date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    // parse jam
    const [hour, minute] = time.split(":").map(Number);
    const startMinutes = hour * 60 + minute;

    // ambil durasi service
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, treatmentId))
      .limit(1);

    if (!service.length) {
      return NextResponse.json(
        { message: "Service tidak valid" },
        { status: 400 }
      );
    }

    const duration = service[0].duration;
    const endMinutes = startMinutes + duration;

    // ❌ melewati jam tutup
    if (endMinutes > 22 * 60) {
      return NextResponse.json(
        { message: "Booking selesai melewati jam tutup (22:00)" },
        { status: 400 }
      );
    }

    // ❌ jam sudah lewat (hari ini)
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      if (startMinutes <= nowMinutes) {
        return NextResponse.json(
          { message: "Jam booking sudah lewat" },
          { status: 400 }
        );
      }
    }

    // ================================
    // ❌ CEK BENTROK BOOKING (HOLD + CONFIRMED)
    // ================================

    const existingBookings = await db
      .select({
        time: bookingCartItems.time,
        duration: services.duration,
      })
      .from(bookingCartItems)
      .leftJoin(services, eq(services.id, bookingCartItems.treatmentId))
      .where(
        and(
          eq(bookingCartItems.staffId, staffId),
          eq(bookingCartItems.date, date),
          or(
            eq(bookingCartItems.status, "CONFIRMED"),
            and(
              eq(bookingCartItems.status, "HOLD"),
              gt(bookingCartItems.expiresAt, new Date())
            )
          )
        )
      );

    for (const b of existingBookings) {
      const [bh, bm] = b.time.split(":").map(Number);
      const bStart = bh * 60 + bm;
      const bEnd = bStart + b.duration; // ✅ BENAR

      if (startMinutes < bEnd && endMinutes > bStart) {
        return NextResponse.json(
          { message: "Jam masih dalam durasi booking lain" },
          { status: 400 }
        );
      }
    }

    if (!expiresAt) {
      throw new Error("expiresAt is undefined");
    }

    await db.insert(bookingCartItems).values({
      cartId,
      treatmentId,
      staffId,
      date,
      time,
      status: "HOLD",
      expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("ADD CART ERROR:", e);
    return NextResponse.json(
      { message: "Gagal menambahkan ke cart" },
      { status: 500 }
    );
  }
}

// DELETE: hapus item cart
export async function DELETE(req: Request) {
  const user = await getSessionUser(); // ✅ FIX
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  await db.delete(bookingCartItems).where(eq(bookingCartItems.id, id));

  return NextResponse.json({ success: true });
}
