import { db } from "@/lib/db";
import { bookings, payments, services, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { generateWaLink } from "@/lib/wa";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, staffId, serviceId, date, time } = body;

  // ambil data user
  const user = await db.select().from(users).where(eq(users.id, userId));
  const service = await db.select().from(services).where(eq(services.id, serviceId));

  if (!user[0] || !service[0]) {
    return Response.json({ error: "User atau service tidak valid" }, { status: 400 });
  }

  // buat booking
  const booking = await db.insert(bookings).values({
    userId,
    staffId,
    serviceId,
    date,
    time,
    status: "waiting_payment",
  });

  // bookingId versi drizzle mysql
  const bookingId = booking.insertId;

  // buat payment
  await db.insert(payments).values({
    bookingId,
    method: "qris",
    amount: service[0].price,
    paymentStatus: "pending",
  });

  // generate WA link
  const waLink = generateWaLink({
    phone: "877-6522-1804", // nomor admin
    userName: user[0].name,
    date,
    time,
    serviceName: service[0].name,
  });

  return Response.json({
    message: "Booking created",
    bookingId,
    waLink,
  });
}
