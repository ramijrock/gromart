import { NextFunction, Request, Response } from 'express';
import SubCategory from '../models/subcategory.model';
import mongoose from 'mongoose';

export const addSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      subCategoryName,
      parentCategory,
      vendor,
      isactive,
      sortOrder
    } = req.body;
    
    const image = (req.file as any)?.location || (req.file as any)?.path;

    // Check if subcategory with same name already exists
    const existingSubCategory = await SubCategory.findOne({ 
      subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`, 'i') } 
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: 'Sub-Category with this name already exists!'
      });
    }

    // Create new subcategory
    const subcategory = new SubCategory({
      subCategoryName,
      parentCategory,
      vendor: vendor || null,
      isactive: typeof isactive === 'boolean' ? isactive : true,
      image,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0
    });

    await subcategory.save();
    res.status(201).json({
      success: true,
      message: 'Sub-Category added successfully.',
      data: subcategory
    });
  } catch (error) {
    next(error);
  }
}; 

export const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      vendor
    } = req.query;

    const user = (req as any)?.user;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = { isactive: true };

    // Add search filter
    if (search) {
      filter.subCategoryName = { $regex: search, $options: 'i' };
    }

    // Add vendor filter
    if (vendor) {
      filter.vendor = vendor;
    } else if (user?.role === 'vendor') {
      // If user is vendor, show their categories + global categories
      filter.$or = [
        { vendor: user._id },
        { isGlobal: true }
      ];
    }

    const subCategories = await SubCategory.find(filter)
      .populate('vendor', 'name email')
      .sort({ sortOrder: 1, categoryname: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await SubCategory.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Sub-Categories list fetch successfully",
      data: subCategories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};