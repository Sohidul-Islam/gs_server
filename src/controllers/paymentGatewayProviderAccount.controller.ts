import { Request, Response } from "express";
import { PaymentGatewayProviderAccountModel } from "../models/paymentGatewayProviderAccount.model";
import { asyncHandler } from "../utils/asyncHandler";

export const PaymentGatewayProviderAccountController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query;
    const result = await PaymentGatewayProviderAccountModel.getAll(filters);
    res.status(200).json({
      status: true,
      data: result.data,
      message: "Payment Gateway Provider Accounts fetched successfully",
      pagination: result.pagination,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await PaymentGatewayProviderAccountModel.getById(Number(id));
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Account not found" });
    }
    res.status(200).json({
      status: true,
      message: "Payment Gateway Provider Account fetched successfully",
      data: data[0],
    });
  }),

  getByProviderId: asyncHandler(async (req: Request, res: Response) => {
    const { paymentGatewayProviderId } = req.params;
    console.log({ paymentGatewayProviderId });
    const data = await PaymentGatewayProviderAccountModel.getByProviderId(
      Number(paymentGatewayProviderId)
    );

    console.log({ data });
    res.status(200).json({
      status: true,
      message: "Payment Gateway Provider Accounts fetched successfully",
      data,
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const created = await PaymentGatewayProviderAccountModel.create(req.body);
    res.status(201).json({
      status: true,
      message: "Payment Gateway Provider Account created successfully",
      data: created,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await PaymentGatewayProviderAccountModel.update(
      Number(id),
      req.body
    );
    res.status(200).json({
      status: true,
      message: "Payment Gateway Provider Account updated successfully",
      data: updated,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await PaymentGatewayProviderAccountModel.delete(Number(id));
    res.status(200).json({
      status: true,
      message: "Payment Gateway Provider Account deleted successfully",
    });
  }),
};
