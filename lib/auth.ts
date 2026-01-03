import { cookies } from "next/headers";

export async function getSessionUser() {
  const cookie = (await cookies()).get("session_user");
  if (!cookie) return null;

  return JSON.parse(cookie.value);
}
