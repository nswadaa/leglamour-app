import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./drizzle/schema.ts",   // ⬅ UBAH INI
  out: "./drizzle/migrations",     // lebih rapi foldernya
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
