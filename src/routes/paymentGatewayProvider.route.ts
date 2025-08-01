import { Router } from "express";
import { PaymentGatewayProviderController } from "../controllers/paymentGatewayProvider.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// GET /api/gateway-providers - Get all gateway-provider relationships
router.get("/", PaymentGatewayProviderController.getAll);

// GET /api/gateway-providers/gateway/:gatewayId - Get providers for a specific gateway
router.get(
  "/gateway/:gatewayId",
  PaymentGatewayProviderController.getProvidersByGateway
);

// GET /api/gateway-providers/provider/:providerId - Get gateways for a specific provider
router.get(
  "/provider/:providerId",
  PaymentGatewayProviderController.getGatewaysByProvider
);

// POST /api/gateway-providers - Assign a provider to a gateway
router.post("/", PaymentGatewayProviderController.assignProviderToGateway);

// PUT /api/gateway-providers/:id/priority - Update relationship priority
router.put("/:id/priority", PaymentGatewayProviderController.updatePriority);

// DELETE /api/gateway-providers/:id - Remove provider from gateway by relationship ID
router.delete(
  "/:id",
  PaymentGatewayProviderController.removeProviderFromGateway
);

// DELETE /api/gateway-providers/:gatewayId/:providerId - Remove provider from gateway by IDs
router.delete(
  "/:gatewayId/:providerId",
  PaymentGatewayProviderController.removeProviderFromGatewayByIds
);

export default router;
