import { Router } from "express";
import {
  getActiveAnnouncement,
  getActivePopup,
  getPublicActiveBannerImages,
  getPublicPromotionList,
} from "../controllers/public.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/promotions", asyncHandler(getPublicPromotionList));
router.get("/banners-list", asyncHandler(getPublicActiveBannerImages));
router.get("/announcement", asyncHandler(getActiveAnnouncement));
router.get("/popup", asyncHandler(getActivePopup));

export default router;
