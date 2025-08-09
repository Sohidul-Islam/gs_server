import { Router } from "express";
import { createDeposit } from "../controllers/transactions.controller";

const router = Router();

router.post("/deposit", createDeposit);

export default router;
