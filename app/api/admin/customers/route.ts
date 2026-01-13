import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

// GET customers dari database
export async function GET() {
  try {
    const allCustomers = await db
      .select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "user"))
      .orderBy(desc(users.id));

    const newCustomers = allCustomers.slice(0, 3);

    return NextResponse.json({
      total: allCustomers.length,
      customers: allCustomers,
      newCustomers,
    });
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data customers" },
      { status: 500 }
    );
  }
}

// DELETE customer dari database
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE CUSTOMER ERROR:", error);
    return NextResponse.json(
      { message: "Gagal menghapus customer" },
      { status: 500 }
    );
  }
}
