import { Request, Response } from "express";
import {
  getPublicPaginatedPromotions,
  getPublicPromotionById,
} from "../models/public.model";
import { db } from "../db/connection";
import { announcements, banners, website_popups } from "../db/schema";
import { desc, eq } from "drizzle-orm";

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

// her banner public api
export const getPublicActiveBannerImages = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await db
      .select()
      .from(banners)
      .where(eq(banners.status, "active"))
      .orderBy(desc(banners.id));

    const allImages = result.flatMap((banner) => {
      try {
        const images = JSON.parse(banner.images);
        return Array.isArray(images) ? images : [];
      } catch {
        return [];
      }
    });

    return res.status(200).json({
      status: true,
      data: allImages, // just the images
      message: "Active banner images fetched successfully.",
    });
  } catch (error) {
    console.error("getActiveBannerImages error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error.",
    });
  }
};
export const getActiveAnnouncement = async (req: Request, res: Response) => {
  try {
    const activeAnnouncement = await db
      .select()
      .from(announcements)
      .where(eq(announcements.status, "active"))
      .limit(1);

    if (activeAnnouncement.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No active announcement found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Active announcement fetched successfully.",
      data: activeAnnouncement[0],
    });
  } catch (error) {
    console.error("Error fetching active announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error.",
    });
  }
};
export const getActivePopup = async (req: Request, res: Response) => {
  try {
    const activePopup = await db
      .select()
      .from(website_popups)
      .where(eq(website_popups.status, "active"))
      .limit(1);

    if (activePopup.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No active popup found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Active popup fetched successfully.",
      data: activePopup[0],
    });
  } catch (error) {
    console.error("Error fetching active popup:", error);
    return res.status(500).json({
      status: false,
      message: "Server error.",
    });
  }
};
