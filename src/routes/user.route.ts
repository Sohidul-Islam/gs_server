import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
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

router.post("/update/:id", (req, res, next) => {
  updateUser(req, res).catch(next);
});

router.post("/delete/:id", (req, res, next) => {
  deleteUser(req, res).catch(next);
});

export default router;
