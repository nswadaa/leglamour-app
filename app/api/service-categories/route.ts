import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceCategory } from "@/drizzle/schema";

export async function GET() {
  const data = await db
    .select({
      id: serviceCategory.id,
      name: serviceCategory.name,
    })
    .from(serviceCategory);

  return NextResponse.json(data);
}
