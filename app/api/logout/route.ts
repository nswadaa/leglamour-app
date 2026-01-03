import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user"); // harus sama seperti cookie login
  return new Response("Logout berhasil", { status: 200 });
}
