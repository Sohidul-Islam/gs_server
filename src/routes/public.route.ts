/**
 * @swagger
 * tags:
 *   - name: Public Promotions
 *     description: Public-facing promotion APIs
 *
 * /api/public/promotions:
 *   get:
 *     summary: Get public promotions list or a single promotion by ID
 *     tags: [Public Promotions]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the promotion to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of promotions per page
 *     responses:
 *       200:
 *         description: Successful fetch of promotion(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Promotion fetched successfully.
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Promotion'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Promotion'
 *                 pagination:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Promotion not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error.
 *
 * components:
 *   schemas:
 *     PromotionType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         title:
 *           type: string
 *           example: "Welcome Bonus"
 *         dropdownId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-16T12:00:00Z"
 *
 *     Promotion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         promotionName:
 *           type: string
 *           example: "Super Saver Promo"
 *         promotionTypeId:
 *           type: integer
 *           example: 3
 *         dateRange:
 *           type: string
 *           example: "2025/07/16 00:00:00 ~ 2025/07/20 23:59:59"
 *         minimumDepositAmount:
 *           type: string
 *           example: "100.00"
 *         maximumDepositAmount:
 *           type: string
 *           example: "1000000.00"
 *         turnoverMultiply:
 *           type: integer
 *           example: 10
 *         bannerImg:
 *           type: object
 *           example: { url: "https://example.com/banner.jpg", alt: "Promo banner" }
 *         bonus:
 *           type: integer
 *           example: 20
 *         description:
 *           type: string
 *           example: "Get 20% extra on your first deposit."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-07-16T12:00:00Z"
 *         promotionType:
 *           $ref: '#/components/schemas/PromotionType'
 */

import { Router } from "express";
import { getPublicPromotionList } from "../controllers/public.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/promotions", asyncHandler(getPublicPromotionList));

export default router;
