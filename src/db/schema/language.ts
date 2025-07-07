import { mysqlTable, serial, varchar, mysqlEnum } from "drizzle-orm/mysql-core";

export const languages = mysqlTable("languages", {
  id: serial("id").primaryKey().autoincrement(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
});
