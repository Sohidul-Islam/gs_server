import { Request, Response } from "express";
import { PaymentGatewayModel } from "../models/paymentGateway.model";
import { paymentGateway } from "../db/schema/paymentGateway";
import { eq, and, sql, like } from "drizzle-orm";

// Helper to build where conditions for search/filter
function buildWhereCondition(query: any) {
  const whereCondition = [];
  if (query.status)
    whereCondition.push(eq(paymentGateway.status, query.status));
  if (query.countryId)
    whereCondition.push(eq(paymentGateway.countryId, query.countryCode));
  if (query.methodId)
    whereCondition.push(eq(paymentGateway.methodId, Number(query.methodId)));
  if (query.name)
    whereCondition.push(like(paymentGateway.name, `%${query.name}%`));
  if (query.network)
    whereCondition.push(like(paymentGateway.network, `%${query.network}%`));
  return whereCondition;
}

export const getAllPaymentGateways = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt((req.query.pageSize as string) || "10", 10);
    const page = parseInt((req.query.page as string) || "1", 10);
    const filter = req.query;
    const whereCondition = buildWhereCondition(filter);

    // Get all filtered
    const allRows = await PaymentGatewayModel.getAll(filter);
    const totalCount = allRows.length;
    // Paginate
    const offset = (page - 1) * pageSize;
    const rows = allRows.slice(offset, offset + pageSize);

    res.json({
      data: rows,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch payment gateways", errors: err });
  }
};

export const getPaymentGatewayById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const row = await PaymentGatewayModel.getById(id);
    if (!row.length)
      return res.status(404).json({ error: "Payment gateway not found" });
    res.json(row[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch payment gateway", errors: err });
  }
};

export const createPaymentGateway = async (req: Request, res: Response) => {
  try {
    await PaymentGatewayModel.create(req.body);
    res.status(201).json({ message: "Payment gateway created" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create payment gateway", errors: err });
  }
};

export const updatePaymentGateway = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await PaymentGatewayModel.update(id, req.body);
    if (!result)
      return res.status(404).json({ error: "Payment gateway not found" });
    res.json({ message: "Payment gateway updated" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update payment gateway", errors: err });
  }
};

export const deletePaymentGateway = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await PaymentGatewayModel.delete(id);
    if (!result)
      return res.status(404).json({ error: "Payment gateway not found" });
    res.json({ message: "Payment gateway deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete payment gateway", errors: err });
  }
};
