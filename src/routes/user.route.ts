import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", (req, res, next) => {
  getAllUsers(req, res).catch(next);
});

router.post("/register", (req, res, next) => {
  registerUser(req, res).catch(next);
});

router.post("/login", (req, res, next) => {
  loginUser(req, res).catch(next);
});

export default router;
