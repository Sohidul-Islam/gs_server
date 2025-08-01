import { Request, Response } from "express";
import { PaymentProviderModel } from "../models/paymentProvider.model";
import { asyncHandler } from "../utils/asyncHandler";

export const PaymentProviderController = {
  // Get all payment providers with optional filtering
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = req.query;
    const providers = await PaymentProviderModel.getAll(filters);

    res.status(200).json({
      success: true,
      data: providers,
    });
  }),

  // Get payment provider by ID
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const provider = await PaymentProviderModel.getById(Number(id));

    if (!provider || provider.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment provider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: provider[0],
    });
  }),

  // Create new payment provider
  create: asyncHandler(async (req: Request, res: Response) => {
    const { name, contactInfo, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Provider name is required",
      });
    }

    const newProvider = await PaymentProviderModel.create({
      name,
      contactInfo,
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      data: newProvider,
      message: "Payment provider created successfully",
    });
  }),

  // Update payment provider
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const existingProvider = await PaymentProviderModel.getById(Number(id));
    if (!existingProvider || existingProvider.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment provider not found",
      });
    }

    const updatedProvider = await PaymentProviderModel.update(
      Number(id),
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedProvider,
      message: "Payment provider updated successfully",
    });
  }),

  // Delete payment provider
  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existingProvider = await PaymentProviderModel.getById(Number(id));
    if (!existingProvider || existingProvider.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment provider not found",
      });
    }

    await PaymentProviderModel.delete(Number(id));

    res.status(200).json({
      success: true,
      message: "Payment provider deleted successfully",
    });
  }),
};
