import {
  mysqlTable,
  serial,
  varchar,
  datetime,
  int,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { currency } from "./currency";
import { adminUsers } from "./AdminUsers";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }),
  fullname: varchar("fullname", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  currency_id: int("currency_id"),
  refer_code: varchar("refer_code", { length: 50 }),
  created_by: int("created_by"),
  status: varchar("status", { length: 50 }).$type<"active" | "inactive">(),
  isAgreeWithTerms: boolean("isAgreeWithTerms"),
  isLoggedIn: boolean("is_logged_in").default(false),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one }) => ({
  currency: one(currency, {
    fields: [users.currency_id],
    references: [currency.id],
  }),
  created_by: one(adminUsers, {
    fields: [users.created_by],
    references: [adminUsers.id],
  }),
}));
