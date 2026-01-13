import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  bookingCarts,
  bookingCartItems,
  bookings,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ambil cart
  const cart = await db
    .select()
    .from(bookingCarts)
    .where(eq(bookingCarts.userId, user.id))
    .limit(1);

  if (!cart.length) {
    return NextResponse.json({ message: "Cart kosong" }, { status: 400 });
  }

  // ambil item cart
  const items = await db
    .select()
    .from(bookingCartItems)
    .where(eq(bookingCartItems.cartId, cart[0].id));

  if (!items.length) {
    return NextResponse.json({ message: "Cart kosong" }, { status: 400 });
  }

  // insert ke bookings
for (const item of items) {
  await db.insert(bookings).values({
    userId: user.id,
    staffId: 1,
    serviceId: item.treatmentId,

    // 🔥 FIX UTAMA DI SINI
    date: new Date(item.date), // string → Date
    time: item.time,           // TIME boleh string "HH:mm:ss" / "HH:mm"

    status: "waiting_payment",
  });
}


  // bersihkan cart
  await db
    .delete(bookingCartItems)
    .where(eq(bookingCartItems.cartId, cart[0].id));

  return NextResponse.json({ success: true });
}
