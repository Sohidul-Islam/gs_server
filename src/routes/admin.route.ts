import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";

import {
  adminLogin,
  adminRegistration,
  adminProfile,
  adminLogout,
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", asyncHandler(adminLogin));
router.post("/registration", asyncHandler(adminRegistration));
router.post("/logout", asyncHandler(verifyToken, adminLogout));
router.get("/profile", asyncHandler(adminProfile));

export default router;
