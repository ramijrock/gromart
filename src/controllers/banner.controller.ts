import { NextFunction, Request, Response } from "express";
import Banner from "../models/banner.model";
import mongoose from "mongoose";

// Add Banner Controller
export const addBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("called");
  try {
    // Extract fields from request
    const { title, link, deviceType, isactive } = req.body;
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
      vendorId: new mongoose.Types.ObjectId(user._id),
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



