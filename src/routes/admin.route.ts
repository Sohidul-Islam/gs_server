import { Router } from "express";

import {
  adminLogin,
  adminRegistration,
  adminProfile,
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", (req, res, next) => {
  adminLogin(req, res).catch(next);
});
router.post("/registration", (req, res, next) => {
  adminRegistration(req, res).catch(next);
});
router.get("/profile", (req, res, next) => {
  adminProfile(req, res).catch(next);
});

export default router;
