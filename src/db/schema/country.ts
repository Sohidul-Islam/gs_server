import {
  mysqlTable,
  serial,
  varchar,
  int,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";

export const countries = mysqlTable("countries", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  flagUrl: text("flag_url"),
  currencyId: int("currency_id").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
});
