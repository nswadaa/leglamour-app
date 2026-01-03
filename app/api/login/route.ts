import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    const user = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!user.length) {
      return new Response(
        JSON.stringify({ message: "Akun tidak ditemukan!" }),
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) {
      return new Response(
        JSON.stringify({ message: "Password salah!" }),
        { status: 401 }
      );
    }

    // ==== SET COOKIE LOGIN tanpa cookies() ====
    const userSession = JSON.stringify({
      id: user[0].id,
      name: user[0].name,
      phone: user[0].phone,
      role: user[0].role,
    });

    return new Response(
      JSON.stringify({
        message: "Login berhasil!",
        role: user[0].role,
      }),
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
    console.error("LOGIN ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
