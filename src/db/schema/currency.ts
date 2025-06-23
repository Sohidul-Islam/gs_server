import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const currency = mysqlTable("currency", {
  id: serial("id").primaryKey().autoincrement(),
  code: varchar("code", { length: 10 }),
  name: varchar("name", { length: 50 }),
  country: varchar("country", { length: 50 }),
  flagUrl: varchar("flag_url", { length: 50 }),
  symbol: varchar("symbol", { length: 10 }),
});
