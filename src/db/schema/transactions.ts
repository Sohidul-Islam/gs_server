import {
  mysqlTable,
  int,
  varchar,
  decimal,
  text,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";
import { paymentGatewayProviderAccount } from "./paymentGatewayProviderAccount";
import { currencies } from "./currency";

export const TransactionStatus = mysqlEnum("transaction_status", [
  "approved",
  "pending",
  "rejected",
]);

export const TransactionType = mysqlEnum("transaction_type", [
  "deposit",
  "withdraw",
]);

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: TransactionType.notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currencyId: int("currency_id")
    .notNull()
    .references(() => currencies.id),
  status: TransactionStatus.default("pending"),
  customTransactionId: varchar("custom_transaction_id", {
    length: 100,
  }).unique(),
  givenTransactionId: varchar("given_transaction_id", { length: 100 }),
  attachment: text("attachment"),
  notes: text("notes"),
  paymentGatewayProviderAccountId: int("provider_account_id").references(
    () => paymentGatewayProviderAccount.id,
    {
      onDelete: "set null",
    }
  ),
  // Bank-specific fields
  accountNumber: varchar("account_number", { length: 100 }),
  accountHolderName: varchar("account_holder_name", { length: 100 }),
  bankName: varchar("bank_name", { length: 100 }),
  branchName: varchar("branch_name", { length: 100 }),
  branchAddress: varchar("branch_address", { length: 255 }),
  swiftCode: varchar("swift_code", { length: 50 }),
  iban: varchar("iban", { length: 100 }),
  // Wallet-specific fields
  walletAddress: text("wallet_address"),
  network: varchar("network", { length: 50 }),
  processedBy: int("processed_by"),
  processedAt: datetime("processed_at"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").default(
    sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  ),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  currency: one(currencies, {
    fields: [transactions.currencyId],
    references: [currencies.id],
  }),
  paymentGatewayProviderAccount: one(paymentGatewayProviderAccount, {
    fields: [transactions.paymentGatewayProviderAccountId],
    references: [paymentGatewayProviderAccount.id],
  }),
}));

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
