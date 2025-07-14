/**
 * @swagger
 * /api/admin/crete-promotion:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionName
 *               - promotionTypeId
 *               - dateRange
 *               - minimumDepositAmount
 *               - maximumDepositAmount
 *               - turnoverMultiply
 *               - bannerImg
 *               - bonus
 *               - description
 *             properties:
 *               promotionName:
 *                 type: string
 *                 example: "First Deposit Bonus"
 *               promotionTypeId:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *               dateRange:
 *                 type: string
 *                 example: "2025-07-15 to 2025-07-30"
 *               minimumDepositAmount:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *               maximumDepositAmount:
 *                 type: number
 *                 format: float
 *                 example: 1000.00
 *               turnoverMultiply:
 *                 type: integer
 *                 example: 5
 *               bannerImg:
 *                 type: string
 *                 example: "https://yourdomain.com/images/promo-banner.jpg"
 *               bonus:
 *                 type: integer
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "<p>Get a 50% bonus on your first deposit.</p>"
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Promotion created successfully.
 *       400:
 *         description: Bad Request (validation or invalid promotion type)
 *       409:
 *         description: Conflict (duplicate promotion name)
 *       500:
 *         description: Internal Server Error
 */

import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";

import {
  adminLogin,
  adminRegistration,
  adminProfile,
  adminLogout,
  getPlayers,
  getAdmins,
  updateAdminProfile,
  deleteAdmin,
  getAgents,
  getAffiliates,
  addDropdownOption,
  getDropdownsList,
  updateDropdownOptionStatus,
  addPromotion,
} from "../controllers/admin.controller";

const router = Router();

// withtout verification token
router.post("/login", asyncHandler(adminLogin));
router.post("/registration", asyncHandler(adminRegistration));
// with token
router.post("/create-agent", verifyToken, asyncHandler(adminRegistration));
router.post("/create-admin", verifyToken, asyncHandler(adminRegistration));
router.post("/logout", verifyToken, asyncHandler(adminLogout));
router.get("/profile", verifyToken, asyncHandler(adminProfile));
router.get("/players", verifyToken, asyncHandler(getPlayers));
router.get("/admins", verifyToken, asyncHandler(getAdmins));
router.get("/agents", verifyToken, asyncHandler(getAgents));
router.get("/affiliates", verifyToken, asyncHandler(getAffiliates));

// configuration
router.post("/create-dropdowns", verifyToken, asyncHandler(addDropdownOption));
router.get("/get-dropdowns", verifyToken, asyncHandler(getDropdownsList));
router.patch(
  "/update-dropdown-option-status/:id",
  verifyToken,
  asyncHandler(updateDropdownOptionStatus)
);

// promotions
router.post("/crete-promotion", verifyToken, asyncHandler(addPromotion));

// Update admin by id
router.post("/update/:id", verifyToken, asyncHandler(updateAdminProfile));

// Delete admin by id
router.post("/delete/:id", verifyToken, asyncHandler(deleteAdmin));

export default router;
