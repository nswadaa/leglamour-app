import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, serviceCategory } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  // === FILTER BY CATEGORY ===
  if (category) {
    const data = await db
      .select({
        id: services.id,
        name: services.name,
        price: services.price,
        categoryId: services.categoryId,
        duration: services.duration, // 🔥 FIX UTAMA
      })
      .from(services)
      .leftJoin(serviceCategory, eq(services.categoryId, serviceCategory.id))
      .where(eq(serviceCategory.name, category));

    return NextResponse.json(data);
  }

  // === ALL SERVICES ===
  const all = await db
    .select({
      id: services.id,
      name: services.name,
      price: services.price,
      categoryId: services.categoryId,
      duration: services.duration, // 🔥 FIX JUGA
    })
    .from(services);

  return NextResponse.json(all);
}
