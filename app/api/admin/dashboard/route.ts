import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getSessionUser();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [customersRows] = await db.execute(
      sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`
    );
    const customers = Number(customersRows[0].count);

    const [appointmentsRows] = await db.execute(
      sql`SELECT COUNT(*) as count FROM bookings`
    );
    const appointments = Number(appointmentsRows[0].count);

    const [transactionsRows] = await db.execute(
      sql`SELECT COUNT(*) as count FROM payments`
    );
    const transactions = Number(transactionsRows[0].count);

    const [todayAppointments] = await db.execute(sql`
      SELECT 
        u.name AS username,
        s.name AS treatment,
        DATE_FORMAT(b.time, '%H:%i') AS time,
        st.name AS staff
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      JOIN services s ON s.id = b.service_id
      JOIN staff st ON st.id = b.staff_id
      WHERE DATE(b.date) = CURDATE()
      ORDER BY b.time ASC
      LIMIT 6
    `);

    return NextResponse.json({
      stats: {
        customers,
        appointments,
        transactions,
      },
      todayAppointments,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
