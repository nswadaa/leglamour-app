import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();   // ← WAJIB pakai await
  const session = cookieStore.get("session_user");

  if (!session) {
    return Response.json({ user: null });
  }

  return Response.json({ user: JSON.parse(session.value) });
}
  