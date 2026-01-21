import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, serviceCategory } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

/* ================= GET (USER + ADMIN) ================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  // === USER MODE (FILTER BY CATEGORY) ===
  if (category) {
    const data = await db
      .select({
        id: services.id,
        name: services.name,
        price: services.price,
        categoryId: services.categoryId,
        duration: services.duration,
        isActive: services.isActive,
      })
      .from(services)
      .leftJoin(serviceCategory, eq(services.categoryId, serviceCategory.id))
      .where(and(eq(serviceCategory.name, category), eq(services.isActive, 1)));

    return NextResponse.json(data);
  }

  // === ADMIN MODE (ALL SERVICES) ===
  const all = await db
    .select({
      id: services.id,
      name: services.name,
      price: services.price,
      categoryId: services.categoryId,
      duration: services.duration,
      isActive: services.isActive,
    })
    .from(services);

  return NextResponse.json(all);
}

/* ================= CREATE (ADMIN) ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.insert(services).values({
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
      duration: body.duration,
      isActive: 1,
    });

    return NextResponse.json({ message: "Created" });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
