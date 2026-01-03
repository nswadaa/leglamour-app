import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dpConfig } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const res = await db.select().from(dpConfig).limit(1);
    if (!res.length) return NextResponse.json({ dp: 20000 });
    return NextResponse.json({ dp: res[0].amount });
  } catch (err) {
    console.error("DP GET ERROR:", err);
    return NextResponse.json({ message: "Failed to fetch dp" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { dp } = body;
    if (typeof dp !== "number") {
      return NextResponse.json({ message: "dp must be number" }, { status: 400 });
    }

    const existing = await db.select().from(dpConfig).limit(1);

    if (existing.length) {
      await db
        .update(dpConfig)
        .set({ amount: dp })
        .where(eq(dpConfig.id, existing[0].id));
    } else {
      await db.insert(dpConfig).values({ amount: dp });
    }

    return NextResponse.json({ message: "DP updated", dp });
  } catch (err) {
    console.error("DP PATCH ERROR:", err);
    return NextResponse.json({ message: "Failed to update dp" }, { status: 500 });
  }
}
