import { NextFunction, Request, Response } from 'express';
import SubCategory from '../models/subcategory.model';
import mongoose from 'mongoose';

export const addSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      subCategoryName,
      parentCategory,
      vendor,
      isGlobal,
      isactive,
      image,
      sortOrder
    } = req.body;

    // Create new subcategory
    const subcategory = new SubCategory({
      subCategoryName,
      parentCategory,
      vendor: vendor || null,
      isGlobal: typeof isGlobal === 'boolean' ? isGlobal : true,
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