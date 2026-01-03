import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/drizzle/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.log("REVIEWS GET ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, review } = body;

    if (!name || !email || !review) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(reviews)
      .values({
        name,
        email,
        review,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.log("REVIEWS POST ERROR:", error);
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
