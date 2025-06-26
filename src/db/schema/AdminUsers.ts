import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  int,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const adminUsers = mysqlTable("admin_users", {
  id: serial("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }),
  fullname: varchar("fullname", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 50 }).$type<
    "admin" | "superAgent" | "agent" | "superAffiliate" | "affiliate"
  >(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({}));
