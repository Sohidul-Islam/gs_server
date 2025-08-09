import { Router } from "express";
import { createDeposit, getTransactions } from "../controllers/transactions.controller";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

router.post("/deposit", asyncHandler(createDeposit));
router.get("/", asyncHandler(getTransactions));

export default router;
