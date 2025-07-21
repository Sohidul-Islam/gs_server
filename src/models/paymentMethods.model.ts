import { db } from "../db/connection";
import { paymentMethods } from "../db/schema/paymentMethods";
import { sql } from "drizzle-orm";

export const PaymentMethodTypeModel = {
  async getAll() {
    return db.select().from(paymentMethods);
  },
  async getById(id: number) {
    return db.select().from(paymentMethods).where(sql`${paymentMethods.id} = ${id}`);
  },
  async create(data: { name: string }) {
    return db.insert(paymentMethods).values(data);
  },
  async update(id: number, data: { name: string }) {
    return db.update(paymentMethods).set(data).where(sql`${paymentMethods.id} = ${id}`);
  },
  async delete(id: number) {
    return db.delete(paymentMethods).where(sql`${paymentMethods.id} = ${id}`);
  },
}; 