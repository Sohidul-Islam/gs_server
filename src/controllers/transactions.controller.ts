import { Request, Response } from "express";
import { db } from "../db/connection";
import { transactions } from "../db/schema/transactions";
import { promotions } from "../db/schema/promotions";
import { settings } from "../db/schema/settings";
import { turnover } from "../db/schema/turnover";
import { eq } from "drizzle-orm";
import { generateUniqueTransactionId } from "../utils/refCode";

type CreateDepositBody = {
  userId: number;
  amount: number;
  currencyId: number;
  promotionId?: number;
  paymentGatewayProviderAccountId?: number;
  notes?: string;
  attachment?: string;
};

export const createDeposit = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      amount,
      currencyId,
      promotionId,
      paymentGatewayProviderAccountId,
      notes,
      attachment,
    } = req.body as CreateDepositBody;

    if (!userId || !amount || !currencyId) {
      return res.status(400).json({
        status: false,
        message: "userId, amount and currencyId are required",
      });
    }

    const customTransactionId = await generateUniqueTransactionId();

    const result = await db.transaction(async (tx) => {
      // Optional promotion lookup
      let promo: {
        id: number;
        promotionName: string;
        turnoverMultiply: number;
        bonus: number;
      } | null = null;
      if (promotionId) {
        const [p] = await tx
          .select({
            id: promotions.id,
            promotionName: promotions.promotionName,
            turnoverMultiply: promotions.turnoverMultiply,
            bonus: promotions.bonus,
          })
          .from(promotions)
          .where(eq(promotions.id, Number(promotionId)));
        if (p) promo = p as any;
      }

      // Settings lookup for defaultTurnover
      const [settingsRow] = await tx.select().from(settings).limit(1);
      const defaultTurnoverMultiply = Number(
        (settingsRow as any)?.defaultTurnover ?? 1
      );

      // Create transaction
      const [createdTxn] = await tx.insert(transactions).values({
        userId: Number(userId),
        type: "deposit" as any,
        amount: Number(amount) as any,
        currencyId: Number(currencyId),
        promotionId: promo ? promo.id : null,
        status: "pending" as any,
        customTransactionId,
        paymentGatewayProviderAccountId: paymentGatewayProviderAccountId
          ? Number(paymentGatewayProviderAccountId)
          : null,
        notes: notes ?? null,
        attachment: attachment ?? null,
      } as any);

      const transactionId =
        (createdTxn as any).insertId ?? (createdTxn as any)?.id;

      const baseAmount = Number(amount);

      // Always create default turnover for transaction amount
      const defaultTarget = baseAmount * defaultTurnoverMultiply;
      await tx.insert(turnover).values({
        userId: Number(userId),
        transactionId: transactionId,
        type: "default",
        status: "active",
        turnoverName: `Default turnover for TXN ${customTransactionId}`,
        targetTurnover: defaultTarget as any,
        remainingTurnover: defaultTarget as any,
      } as any);

      // If promotion applied, create promotion turnover
      if (promo) {
        const bonusPercentage = Number(promo.bonus || 0);
        const bonusAmount = (baseAmount * bonusPercentage) / 100;
        const promoBase = baseAmount + bonusAmount;
        const promoTarget = promoBase * Number(promo.turnoverMultiply || 1);
        await tx.insert(turnover).values({
          userId: Number(userId),
          transactionId: transactionId,
          type: "promotion",
          status: "active",
          turnoverName: `Promotion: ${promo.promotionName}`,
          targetTurnover: promoTarget as any,
          remainingTurnover: promoTarget as any,
        } as any);
      }

      return { transactionId, customTransactionId };
    });

    return res.status(201).json({
      status: true,
      message: "Deposit created with turnover entries",
      data: result,
    });
  } catch (err) {
    console.error("createDeposit error", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error", errors: err });
  }
};
