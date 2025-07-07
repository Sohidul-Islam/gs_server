import { mysqlTable, int, mysqlEnum } from "drizzle-orm/mysql-core";

export const countryLanguages = mysqlTable(
  "country_languages",
  {
    countryId: int("country_id").notNull(),
    languageId: int("language_id").notNull(),
    status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  },
  (table) => ({
    pk: [table.countryId, table.languageId],
  })
);
