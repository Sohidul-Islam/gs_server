import { relations } from "drizzle-orm";
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { paymentMethods } from "./paymentMethods";

export const paymentMethodTypes = mysqlTable("payment_methods_types", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).unique(),
  paymentMethodId: int("payment_method_id").notNull(),
});

export const PaymentMethodRelationships = relations(
  paymentMethodTypes,
  ({ one }) => ({
    paymentMethod: one(paymentMethods, {
      fields: [paymentMethodTypes.paymentMethodId],
      references: [paymentMethods.id],
    }),
  })
);
