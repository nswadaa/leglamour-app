import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies(); // ← WAJIB pakai await
  const session = cookieStore.get("session_user");

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = JSON.parse(session.value);

  if (user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  return Response.json({ user });
}
