import { Router } from "express";
import { PaymentProviderController } from "../controllers/paymentProvider.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// GET /api/payment-providers - Get all payment providers
router.get("/", PaymentProviderController.getAll);

// GET /api/payment-providers/:id - Get payment provider by ID
router.get("/:id", PaymentProviderController.getById);

// POST /api/payment-providers - Create new payment provider
router.post("/", PaymentProviderController.create);

// PUT /api/payment-providers/:id - Update payment provider
router.put("/:id", PaymentProviderController.update);

// DELETE /api/payment-providers/:id - Delete payment provider
router.delete("/:id", PaymentProviderController.delete);

export default router;
