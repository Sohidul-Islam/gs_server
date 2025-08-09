import { Router } from "express";
import { createDeposit } from "../controllers/transactions.controller";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

router.post("/deposit", asyncHandler(createDeposit));

export default router;
