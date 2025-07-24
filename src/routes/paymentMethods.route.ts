import { Router } from "express";
import {
  getAllPaymentMethod,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethods.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getAllPaymentMethod));
router.get("/:id", asyncHandler(getPaymentMethodById));
router.post("/", asyncHandler(createPaymentMethod));
router.put("/:id", asyncHandler(updatePaymentMethod));
router.delete("/:id", asyncHandler(deletePaymentMethod));

export default router;
