import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, phone, password } = await req.json();

    if (!name || !phone || !password) {
      return new Response(
        JSON.stringify({ message: "Semua field wajib diisi" }),
        { status: 400 }
      );
    }

    const exist = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (exist.length > 0) {
      return new Response(
        JSON.stringify({ message: "Nomor sudah terdaftar!" }),
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      phone,
      password: hash,
      role: "user",
    });

    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    const userSession = JSON.stringify({
      id: newUser[0].id,
      name: newUser[0].name,
      phone: newUser[0].phone,
      role: newUser[0].role,
    });

    return new Response(
      JSON.stringify({ message: "Register berhasil!" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `session_user=${encodeURIComponent(
            userSession
          )}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
        },
      }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
