import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  timestamp,
  date,
  time,
} from "drizzle-orm/mysql-core";

// ===============================
// USERS
// ===============================
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  role: varchar("role", { length: 20 }).default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===============================
// STAFF
// ===============================
export const staff = mysqlTable("staff", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["owner", "senior", "junior"]).notNull(),
  isActive: int("is_active").default(1),
});

// ===============================
// STAFF AVAILABILITY (CUTI / LIBUR)
// ===============================
export const staffAvailability = mysqlTable("staff_availability", {
  id: int("id").primaryKey().autoincrement(),
  staffId: int("staff_id").notNull(),
  date: date("date").notNull(),
  isAvailable: int("is_available").default(0),
});

// ===============================
// SERVICE CATEGORY
// ===============================
export const serviceCategory = mysqlTable("service_category", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
});

// ===============================
// SERVICES
// duration = menit
// ===============================
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: int("category_id").notNull(),
  duration: int("duration").default(60),
  price: int("price").notNull(),
});

// ===============================
// TIME SLOTS (MASTER JAM)  ⭐ INTI
// ===============================
export const timeSlots = mysqlTable("time_slots", {
  id: int("id").primaryKey().autoincrement(),
  time: time("time").notNull(),       // "09:00:00"
  isActive: int("is_active").default(1),
});

// ===============================
// DP CONFIG
// ===============================
export const dpConfig = mysqlTable("dp_config", {
  id: int("id").primaryKey().autoincrement(),
  amount: int("amount").notNull(),
});

// ===============================
// BOOKINGS
// ===============================
export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  staffId: int("staff_id").notNull(),
  serviceId: int("service_id").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),        // start time
  dpAmount: int("dp_amount").default(20000),
  status: mysqlEnum("status", [
    "pending",
    "waiting_payment",
    "waiting_approval",
    "paid",
    "cancelled",
  ]).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===============================
// PAYMENTS
// ===============================
export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  bookingId: int("booking_id").notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  amount: int("amount").notNull(),
  paymentStatus: mysqlEnum("payment_status", [
    "pending",
    "waiting_approval",
    "success",
    "failed",
  ]).default("pending"),
  transactionId: varchar("transaction_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===============================
// REVIEWS
// ===============================
export const reviews = mysqlTable("reviews", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  review: varchar("review", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


