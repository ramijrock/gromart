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