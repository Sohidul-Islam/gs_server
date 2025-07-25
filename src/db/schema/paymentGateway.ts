import {
  mysqlTable,
  int,
  varchar,
  double,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";
import { ActivityStatus } from "./users";

export const paymentGateway = mysqlTable("payment_gateway", {
  id: int("id").primaryKey().autoincrement(),
  methodId: int("method_id").notNull(),
  paymentMethodTypeIds: json("payment_method_type_ids").notNull(), // array of numbers
  iconUrl: varchar("icon_url", { length: 255 }),
  minDeposit: double("min_deposit"),
  maxDeposit: double("max_deposit"),
  minWithdraw: double("min_withdraw"),
  maxWithdraw: double("max_withdraw"),
  status: ActivityStatus.default("active"),
  countryCode: varchar("country_code", { length: 10 }),
  network: varchar("network", { length: 100 }),
  currencyConversionRate: double("currency_conversion_rate"),
  name: varchar("name", { length: 100 }).notNull(),
});

export const PaymentGateway = paymentGateway.$inferInsert;
