/**
 * @swagger
 * /api/admin/promotions:
 *   get:
 *     summary: Get promotions list or a single promotion by ID
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the promotion to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of promotions per page
 *     responses:
 *       200:
 *         description: Successful fetch of promotion(s)
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
 *                   example: Promotion fetched successfully.
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Promotion'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Promotion'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Promotion not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         promotionName:
 *           type: string
 *           example: Summer Sale
 *         promotionType:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             title:
 *               type: string
 *               example: Seasonal
 *             dropdownId:
 *               type: integer
 *               example: 1
 *             status:
 *               type: string
 *               example: active
 *             createdBy:
 *               type: string
 *               example: admin
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-07-14T10:00:00Z"
 *         status:
 *           type: string
 *           example: active
 *         dateRange:
 *           type: string
 *           example: "2025-07-01 to 2025-07-31"
 *         minimumDepositAmount:
 *           type: number
 *           format: float
 *           example: 100.00
 *         maximumDepositAmount:
 *           type: number
 *           format: float
 *           example: 1000.00
 *         turnoverMultiply:
 *           type: integer
 *           example: 3
 *         bannerImg:
 *           type: string
 *           example: "https://example.com/banner.jpg"
 *         bonus:
 *           type: integer
 *           example: 50
 *         description:
 *           type: string
 *           example: "Bonus promotion for summer."
 *         createdBy:
 *           type: string
 *           example: admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-14T10:00:00Z"
 */
/**
 * @swagger
 * /api/admin/dropdown-options:
 *   get:
 *     summary: Get a single dropdown option by ID or fetch a paginated list of dropdown options
 *     tags: [Dropdowns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the dropdown option to retrieve (must be active)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of dropdown options per page
 *     responses:
 *       200:
 *         description: Successfully fetched dropdown option(s)
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
 *                   example: Dropdown options fetched successfully.
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         title:
 *                           type: string
 *                           example: "Welcome Bonus"
 *                         dropdown_id:
 *                           type: integer
 *                           example: 2
 *                         status:
 *                           type: string
 *                           example: "active"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-07-14T12:34:56.000Z"
 *                         created_by:
 *                           type: string
 *                           example: "admin"
 *                     - type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           dropdown_id:
 *                             type: integer
 *                           status:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           created_by:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Dropdown option not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Dropdown option not found or inactive.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error.
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
  getPromotionsList,
  getDropdownOptionsList,
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
router.post(
  "/update-dropdown-option-status/:id",
  verifyToken,
  asyncHandler(updateDropdownOptionStatus)
);
router.get("/get-dropdowns", verifyToken, asyncHandler(getDropdownsList));
router.get(
  "/dropdown-options",
  verifyToken,
  asyncHandler(getDropdownOptionsList)
);

// promotions
router.post("/crete-promotion", verifyToken, asyncHandler(addPromotion));
router.get("/promotions", verifyToken, asyncHandler(getPromotionsList));

// Update admin by id
router.post("/update/:id", verifyToken, asyncHandler(updateAdminProfile));

// Delete admin by id
router.post("/delete/:id", verifyToken, asyncHandler(deleteAdmin));

export default router;
