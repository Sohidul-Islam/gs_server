import { Request, Response } from "express";
import { PaymentMethodModel } from "../models/paymentMethods.model";

export const getAllPaymentMethodTypes = async (req: Request, res: Response) => {
  const types = await PaymentMethodModel.getAll();
  res.json(types);
};

export const getPaymentMethodTypeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const type = await PaymentMethodModel.getById(Number(id));
  if (!type.length) return res.status(404).json({ message: "Not found" });
  res.json(type[0]);
  return;
};

export const createPaymentMethodType = async (req: Request, res: Response) => {
  const { name } = req.body;
  await PaymentMethodModel.create({ name });
  res.status(201).json({ message: "Created" });
};

export const updatePaymentMethodType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  await PaymentMethodModel.update(Number(id), { name });
  res.json({ message: "Updated" });
};

export const deletePaymentMethodType = async (req: Request, res: Response) => {
  const { id } = req.params;
  await PaymentMethodModel.delete(Number(id));
  res.json({ message: "Deleted" });
}; 