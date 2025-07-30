import { db } from "../db/connection";
import { paymentMethods } from "../db/schema/paymentMethods";
import { eq, sql } from "drizzle-orm";

export const PaymentMethodModel = {
  async getAll(filter: { status?: "active" | "inactive" }) {
    return db
      .select()
      .from(paymentMethods)
      .where(
        filter.status ? eq(paymentMethods.status, filter.status) : undefined
      );
  },
  async getById(id: number) {
    return db
      .select()
      .from(paymentMethods)
      .where(sql`${paymentMethods.id} = ${id}`);
  },
  async create(data: { name: string }) {
    return db.insert(paymentMethods).values(data);
  },
  async update(
    id: number,
    data: { name: string; status: "active" | "inactive" }
  ) {
    return db
      .update(paymentMethods)
      .set(data)
      .where(sql`${paymentMethods.id} = ${id}`);
  },
  async delete(id: number) {
    return db.delete(paymentMethods).where(sql`${paymentMethods.id} = ${id}`);
  },
};
