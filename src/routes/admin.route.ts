/**
 * @swagger
 * /api/admin/create-dropdowns:
 *   post:
 *     summary: Add a dropdown option
 *     tags: [Dropdowns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dropdownId
 *               - title
 *             properties:
 *               dropdownId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Deposit Bonus"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Dropdown option added successfully
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

// Update admin by id
router.post("/update/:id", verifyToken, asyncHandler(updateAdminProfile));

// Delete admin by id
router.post("/delete/:id", verifyToken, asyncHandler(deleteAdmin));

export default router;
