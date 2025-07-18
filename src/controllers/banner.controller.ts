import { NextFunction, Request, Response } from "express";

// Add Banner Controller
export const addBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    res.status(201).json({
      success: true,
      message: "Banner added successfully.",
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    next(error);
  }
};






