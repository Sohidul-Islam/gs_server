import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  int,
  boolean,
  decimal,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { currency } from "./currency";

// export const adminUsersRoles = mysqlEnum("admin_users_roles", [
//   "admin",
//   "superAgent",
//   "agent",
//   "superAffiliate",
//   "affiliate",
// ]);

export const adminUsers = mysqlTable("admin_users", {
  id: serial("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }),
  fullname: varchar("fullname", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  country: varchar("country", { length: 255 }),
  city: varchar("city", { length: 255 }),
  street: varchar("street", { length: 255 }),
  minTrx: decimal("minimum_trx"),
  maxTrx: decimal("maximum_trx"),
  currency: int("currency"),
  role: mysqlEnum("role", [
    "admin",
    "superAgent",
    "agent",
    "superAffiliate",
    "affiliate",
  ]),
  status: varchar("status", { length: 50 }).$type<"active" | "inactive">(),
  createdBy: int("created_by"),
  lastIp: varchar("last_ip", { length: 255 }),
  lastLogin: datetime("last_login"),
  isLoggedIn: boolean("is_logged_in").default(false),
  isVerified: boolean("is_verified").default(false),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  createdByUser: one(adminUsers, {
    fields: [adminUsers.createdBy],
    references: [adminUsers.id],
  }),
}));
