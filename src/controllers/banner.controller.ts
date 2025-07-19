import { NextFunction, Request, Response } from "express";
import Banner from "../models/banner.model";
import mongoose from "mongoose";

// Add Banner Controller
export const addBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract fields from request
    const { title, link, deviceType, isactive, startDate, endDate } = req.body;
    const file = req.file;
    const user = (req as any).user; // JWT payload

    if (!file) {
      res.status(400).json({ success: false, message: "Image file is required." });
      return;
    }
    if (!user || !user._id) {
      res.status(401).json({ success: false, message: "Unauthorized: user not found." });
      return;
    }

    // Create banner document
    const banner = await Banner.create({
      title,
      image: file.path, // Use Cloudinary URL
      link,
      deviceType,
      isactive: isactive !== undefined ? isactive : true,
      vendorId: new mongoose.Types.ObjectId(String(user._id)),
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Banner added successfully.",
      banner,
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    next(error);
  }
};

export const getBannerList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const titleSearch = req.query.q?.toString().trim() || "";
    const sectionFilter = req.query.section?.toString().trim() || "";
    const deviceType = req.query.deviceType?.toString().trim();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit as string) || 10), 50); // Max 50 items per page
    const skip = (page - 1) * limit;

    // Build search criteria with sanitized inputs
    const now = new Date();
    const searchCriteria: any = {
      isactive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    if (deviceType) {
      searchCriteria.deviceType = deviceType;
    }

    // Add search conditions if provided
    if (titleSearch || sectionFilter) {
      searchCriteria.$and = [];
      
      if (titleSearch) {
        searchCriteria.$and.push({ 
          title: { $regex: titleSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: "i" } 
        });
      }
      
      if (sectionFilter) {
        searchCriteria.$and.push({ 
          section: { $regex: sectionFilter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: "i" } 
        });
      }
    }

    const [bannerList, totalBanner] = await Promise.all([
      Banner.find(searchCriteria)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Banner.countDocuments(searchCriteria)
    ]);

    res.status(200).json({
      success: true,
      message: "Banner list fetch successfully",
      data: {
        banners: bannerList,
        pagination: {
          total: totalBanner,
          page,
          limit,
          pages: Math.ceil(totalBanner / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

