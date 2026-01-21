import "dotenv/config";
import { db } from "../lib/db.ts";
import { users } from "../drizzle/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  const phone = "081270742131";
  const password = "admin123";

  const exist = await db.select().from(users).where(eq(users.phone, phone));
  if (exist.length > 0) {
    console.log("Admin sudah ada ✓");
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name: "Admin",
    phone,
    password: hash,
    role: "admin",
  });

  console.log("Admin berhasil dibuat ✓");
}

main();
