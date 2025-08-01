import { db } from "../db/connection";
import {
  NewPaymentGatewayProvider,
  PaymentGatewayProvider,
  paymentGatewayProvider,
} from "../db/schema/paymentGatewayProvider";
import { paymentGateway } from "../db/schema/paymentGateway";
import { paymentProvider } from "../db/schema/paymentProvider";
import { eq, sql, and, desc, asc } from "drizzle-orm";

export const PaymentGatewayProviderModel = {
  async getAll(filter: any = {}) {
    const whereCondition = [];
    if (filter.gatewayId)
      whereCondition.push(
        eq(paymentGatewayProvider.gatewayId, filter.gatewayId)
      );
    if (filter.providerId)
      whereCondition.push(
        eq(paymentGatewayProvider.providerId, filter.providerId)
      );

    return db
      .select()
      .from(paymentGatewayProvider)
      .where(whereCondition.length ? and(...whereCondition) : undefined)
      .orderBy(
        asc(paymentGatewayProvider.priority),
        desc(paymentGatewayProvider.id)
      );
  },

  async getByGatewayId(gatewayId: number) {
    return db
      .select({
        id: paymentGatewayProvider.id,
        gatewayId: paymentGatewayProvider.gatewayId,
        providerId: paymentGatewayProvider.providerId,
        priority: paymentGatewayProvider.priority,
        provider: {
          id: paymentProvider.id,
          name: paymentProvider.name,
          contactInfo: paymentProvider.contactInfo,
          commissionPercentage: paymentProvider.commissionPercentage,
          status: paymentProvider.status,
        },
      })
      .from(paymentGatewayProvider)
      .innerJoin(
        paymentProvider,
        eq(paymentGatewayProvider.providerId, paymentProvider.id)
      )
      .where(eq(paymentGatewayProvider.gatewayId, gatewayId))
      .orderBy(
        asc(paymentGatewayProvider.priority),
        desc(paymentGatewayProvider.id)
      );
  },

  async getByProviderId(providerId: number) {
    return db
      .select({
        id: paymentGatewayProvider.id,
        gatewayId: paymentGatewayProvider.gatewayId,
        providerId: paymentGatewayProvider.providerId,
        priority: paymentGatewayProvider.priority,
        gateway: {
          id: paymentGateway.id,
          name: paymentGateway.name,
          methodId: paymentGateway.methodId,
          status: paymentGateway.status,
        },
      })
      .from(paymentGatewayProvider)
      .innerJoin(
        paymentGateway,
        eq(paymentGatewayProvider.gatewayId, paymentGateway.id)
      )
      .where(eq(paymentGatewayProvider.providerId, providerId))
      .orderBy(
        asc(paymentGatewayProvider.priority),
        desc(paymentGatewayProvider.id)
      );
  },

  async create(data: typeof NewPaymentGatewayProvider) {
    return db.insert(paymentGatewayProvider).values(data);
  },

  async update(id: number, data: any) {
    return db
      .update(paymentGatewayProvider)
      .set(data)
      .where(sql`${paymentGatewayProvider.id} = ${id}`);
  },

  async delete(id: number) {
    return db
      .delete(paymentGatewayProvider)
      .where(sql`${paymentGatewayProvider.id} = ${id}`);
  },

  async deleteByGatewayAndProvider(gatewayId: number, providerId: number) {
    return db
      .delete(paymentGatewayProvider)
      .where(
        and(
          eq(paymentGatewayProvider.gatewayId, gatewayId),
          eq(paymentGatewayProvider.providerId, providerId)
        )
      );
  },
};
