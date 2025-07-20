/**
 * @swagger
 * /api/admin/create-banner:
 *   post:
 *     summary: Create or update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Banner ID for update (optional)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               dateRange:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               title:
 *                 type: string
 *             required:
 *               - images
 *               - title
 *     responses:
 *       200:
 *         description: Banner updated or created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
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
  getPromotionsList,
  getDropdownOptionsList,
  addOrUpdatePromotion,
  createUpdateBanners,
  getAllBanners,
  createOrUpdateAnnouncement,
  getAllAnnouncements,
  createOrUpdateWebsitePopup,
  getAllWebsitePopups,
  deletePopup,
  deleteAnnouncement,
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
router.post("/promotion", verifyToken, asyncHandler(addOrUpdatePromotion));
router.get("/promotions", verifyToken, asyncHandler(getPromotionsList));

// Update admin by id
router.post("/update/:id", verifyToken, asyncHandler(updateAdminProfile));

// Delete admin by id
router.post("/delete/:id", verifyToken, asyncHandler(deleteAdmin));

// cms
router.post("/banner", verifyToken, asyncHandler(createUpdateBanners));
// banner
router.get("/get-banner", verifyToken, asyncHandler(getAllBanners));

router.post(
  "/announcement",
  verifyToken,
  asyncHandler(createOrUpdateAnnouncement)
);

router.get(
  "/get-announcements",
  verifyToken,
  asyncHandler(getAllAnnouncements)
);
router.post(
  "/delete-announcement/:id",
  verifyToken,
  asyncHandler(deleteAnnouncement)
);

router.post(
  "/website-popup",
  verifyToken,
  asyncHandler(createOrUpdateWebsitePopup)
);
router.get(
  "/get-website-popups",
  verifyToken,
  asyncHandler(getAllWebsitePopups)
);
router.post("/delete-popup/:id", verifyToken, asyncHandler(deletePopup));

export default router;
