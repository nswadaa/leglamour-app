import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout berhasil" });

  // 🔥 HAPUS SEMUA COOKIE AUTH
  res.cookies.set("session_user", "", {
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("session_admin", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
