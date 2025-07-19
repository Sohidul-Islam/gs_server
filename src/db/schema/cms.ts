import { sql } from "drizzle-orm";
import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const banners = mysqlTable("hero_banners", {
  id: int("id").primaryKey().autoincrement(),
  dateRange: varchar("date_range", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("inactive"),
  images: text("banner_images").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const announcements = mysqlTable("announcements", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 1500 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("inactive"),
  dateRange: varchar("date_range", { length: 255 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});
export const website_popups = mysqlTable("website_popups", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 3000 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("inactive"),
  dateRange: varchar("date_range", { length: 255 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});
