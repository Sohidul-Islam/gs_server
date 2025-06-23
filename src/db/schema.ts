import { mysqlTable, serial, varchar, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});
