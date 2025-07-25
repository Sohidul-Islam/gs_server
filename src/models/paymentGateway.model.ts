import { db } from "../db/connection";
import { paymentGateway } from "../db/schema/paymentGateway";
import { eq, sql, and, like } from "drizzle-orm";

export const PaymentGatewayModel = {
  async getAll(filter: any = {}) {
    const whereCondition = [];
    if (filter.status)
      whereCondition.push(eq(paymentGateway.status, filter.status));
    if (filter.countryCode)
      whereCondition.push(eq(paymentGateway.countryCode, filter.countryCode));
    if (filter.methodId)
      whereCondition.push(eq(paymentGateway.methodId, Number(filter.methodId)));
    if (filter.name)
      whereCondition.push(like(paymentGateway.name, `%${filter.name}%`));
    if (filter.network)
      whereCondition.push(like(paymentGateway.network, `%${filter.network}%`));
    return db
      .select()
      .from(paymentGateway)
      .where(whereCondition.length ? and(...whereCondition) : undefined);
  },
  async getById(id: number) {
    return db
      .select()
      .from(paymentGateway)
      .where(sql`${paymentGateway.id} = ${id}`);
  },
  async create(data: any) {
    return db.insert(paymentGateway).values(data);
  },
  async update(id: number, data: any) {
    return db
      .update(paymentGateway)
      .set(data)
      .where(sql`${paymentGateway.id} = ${id}`);
  },
  async delete(id: number) {
    return db.delete(paymentGateway).where(sql`${paymentGateway.id} = ${id}`);
  },
};
