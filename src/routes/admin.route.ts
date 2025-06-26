import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";

import {
  adminLogin,
  adminRegistration,
  adminProfile,
  adminLogout,
  getPlayers,
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", asyncHandler(adminLogin));
router.post("/registration", asyncHandler(adminRegistration));
router.post("/logout", asyncHandler(verifyToken, adminLogout));
router.get("/profile", asyncHandler(verifyToken, adminProfile));
router.get("/players", asyncHandler(verifyToken, getPlayers));

export default router;
