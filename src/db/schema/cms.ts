import {
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const banners = mysqlTable("hero_banners", {
  id: serial("id").primaryKey().autoincrement(),
  dateRange: varchar("date_range", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("inactive"),
  images: text("banner_images").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
});
