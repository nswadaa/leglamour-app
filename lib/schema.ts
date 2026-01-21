import {
  mysqlTable,
  int,
  varchar,
  tinyint,
  boolean,
  time,
} from "drizzle-orm/mysql-core";

//STAFF
export const staff = mysqlTable("staff", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  isActive: tinyint("is_active").notNull(),
});

// TREATMENT
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  price: int("price").notNull(),
  categoryId: int("category_id").notNull(),
  duration: int("duration").notNull(),
  isActive: tinyint("is_active").notNull(), // ⬅️ BARU
});

// Time
// drizzle/schema.ts
export const timeSlots = mysqlTable("time_slots", {
  id: int("id").primaryKey().autoincrement(),
  time: time("time").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});
