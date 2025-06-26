import { Router } from "express";

import {
  adminLogin,
  adminRegistration,
  adminProfile,
  adminLogout,
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

router.post("/logout", (req, res, next) => {
  adminLogout(req, res).catch(next);
});

export default router;
