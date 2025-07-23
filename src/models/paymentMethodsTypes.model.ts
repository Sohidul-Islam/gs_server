import { db } from "../db/connection";
import { sql } from "drizzle-orm";
import { paymentMethodTypes } from "../db/schema";

export const PaymentMethodTypesModel = {
  async getAll() {
    return db.select().from(paymentMethodTypes);
  },
  async getById(id: number) {
    return db.select().from(paymentMethodTypes).where(sql`${paymentMethodTypes.id} = ${id}`);
  },
  async create(data: { name: string, paymentMethodId: number }) {
    return db.insert(paymentMethodTypes).values(data);
  },
  async update(id: number, data: { name: string }) {
    return db.update(paymentMethodTypes).set(data).where(sql`${paymentMethodTypes.id} = ${id}`);
  },
  async delete(id: number) {
    return db.delete(paymentMethodTypes).where(sql`${paymentMethodTypes.id} = ${id}`);
  },
}; 