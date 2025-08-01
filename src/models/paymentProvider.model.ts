import { db } from "../db/connection";
import {
  NewPaymentProvider,
  PaymentProvider,
  paymentProvider,
} from "../db/schema/paymentProvider";
import { eq, sql, and, like } from "drizzle-orm";

export const PaymentProviderModel = {
  async getAll(filter: any = {}) {
    const whereCondition = [];
    if (filter.status)
      whereCondition.push(eq(paymentProvider.status, filter.status));
    if (filter.name)
      whereCondition.push(like(paymentProvider.name, `%${filter.name}%`));

    return db
      .select()
      .from(paymentProvider)
      .where(whereCondition.length ? and(...whereCondition) : undefined);
  },

  async getById(id: number) {
    return db
      .select()
      .from(paymentProvider)
      .where(sql`${paymentProvider.id} = ${id}`);
  },

  async create(data: typeof NewPaymentProvider) {
    return db.insert(paymentProvider).values(data);
  },

  async update(id: number, data: any) {
    return db
      .update(paymentProvider)
      .set(data)
      .where(sql`${paymentProvider.id} = ${id}`);
  },

  async delete(id: number) {
    return db.delete(paymentProvider).where(sql`${paymentProvider.id} = ${id}`);
  },
};
