import { Request, Response } from "express";
import {
  getPublicPaginatedPromotions,
  getPublicPromotionById,
} from "../models/public.model";

export const getPublicPromotionList = async (req: Request, res: Response) => {
  try {
    const { id, page = 1, pageSize = 10 } = req.query;

    const promotionId = id ? Number(id) : undefined;

    if (promotionId) {
      const promotion = await getPublicPromotionById(promotionId);
      if (!promotion) {
        return res.status(404).json({
          status: false,
          message: "Promotion not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Promotion fetched successfully.",
        data: promotion,
      });
    }

    const result = await getPublicPaginatedPromotions(
      Number(page),
      Number(pageSize)
    );

    return res.status(200).json({
      status: true,
      message: "Promotion fetched successfully.",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return res.status(500).json({
      status: false,
      message: "Server error.",
    });
  }
};
