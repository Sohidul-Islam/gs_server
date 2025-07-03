import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  int,
  boolean,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { currency } from "./currency";
import { adminUsers } from "./AdminUsers";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }),
  fullname: varchar("fullname", { length: 100 }),
  phone: varchar("phone", { length: 20 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  currency_id: int("currency_id"),
  refer_code: varchar("refer_code", { length: 50 }),
  created_by: int("created_by"),
  status: mysqlEnum("status", ["active", "inactive"]),
  isAgreeWithTerms: boolean("isAgreeWithTerms"),
  isLoggedIn: boolean("is_logged_in").default(false),
  isVerified: boolean("is_verified").default(false),
  lastIp: varchar("last_ip", { length: 120 }),
  lastLogin: datetime("last_login"),

  // ✅ Device info fields
  device_type: varchar("device_type", { length: 50 }),
  device_name: varchar("device_name", { length: 100 }),
  os_version: varchar("os_version", { length: 50 }),
  browser: varchar("browser", { length: 50 }),
  browser_version: varchar("browser_version", { length: 50 }),
  ip_address: varchar("ip_address", { length: 45 }),
  device_token: text("device_token"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one }) => ({
  currency: one(currency, {
    fields: [users.currency_id],
    references: [currency.id],
  }),
  createdByUser: one(adminUsers, {
    fields: [users.created_by],
    references: [adminUsers.id],
  }),
}));
