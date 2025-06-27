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
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", asyncHandler(adminLogin));
router.post("/registration", asyncHandler(adminRegistration));
router.post("/logout", asyncHandler(adminLogout));
router.get("/profile", asyncHandler(adminProfile));
router.get("/players", asyncHandler(getPlayers));
router.get("/admins", asyncHandler(getAdmins));

export default router;
