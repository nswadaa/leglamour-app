// app/api/services/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services, serviceCategory } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // e.g. "nails"

    let result;

    if (category) {
      result = await db
        .select({
          id: services.id,
          name: services.name,
          price: services.price,
          duration: services.duration,
          categoryId: services.categoryId,
          categoryName: serviceCategory.name,
        })
        .from(services)
        .leftJoin(serviceCategory, eq(services.categoryId, serviceCategory.id))
        .where(eq(serviceCategory.name, category));
    } else {
      result = await db
        .select({
          id: services.id,
          name: services.name,
          price: services.price,
          duration: services.duration,
          categoryId: services.categoryId,
          categoryName: serviceCategory.name,
        })
        .from(services)
        .leftJoin(serviceCategory, eq(services.categoryId, serviceCategory.id));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("SERVICES API ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 });
  }
}
