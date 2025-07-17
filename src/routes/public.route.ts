import { Router } from "express";
import {
  getPublicActiveBannerImages,
  getPublicPromotionList,
} from "../controllers/public.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/promotions", asyncHandler(getPublicPromotionList));
router.get("/banners-list", asyncHandler(getPublicActiveBannerImages));

export default router;
