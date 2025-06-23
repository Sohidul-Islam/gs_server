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

export const users = mysqlTable("users", {
  id: serial("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }),
  fullname: varchar("fullname", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  currency_id: int("currency_id"),
  refer_code: varchar("refer_code", { length: 50 }),
  isAgreeWithTerms: boolean("isAgreeWithTerms"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one }) => ({
  currency: one(currency, {
    fields: [users.currency_id],
    references: [currency.id],
  }),
}));
