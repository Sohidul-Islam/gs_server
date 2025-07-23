import { Router } from "express";
import {
  getAllPaymentMethodTypes,
  getPaymentMethodTypeById,
  createPaymentMethodType,
  updatePaymentMethodType,
  deletePaymentMethodType,
} from "../controllers/paymentMethods.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getAllPaymentMethodTypes));
router.get("/:id", asyncHandler(getPaymentMethodTypeById));
router.post("/", asyncHandler(createPaymentMethodType));
router.put("/:id", asyncHandler(updatePaymentMethodType));
router.delete("/:id", asyncHandler(deletePaymentMethodType));

export default router; 