import {
  mysqlTable,
  serial,
  varchar,
  int,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const countries = mysqlTable("countries", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  flagUrl: varchar("flag_url", { length: 255 }),
  currencyId: int("currency_id").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
});
