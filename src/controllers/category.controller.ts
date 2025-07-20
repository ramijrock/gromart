import { NextFunction, Request, Response } from "express";
import Category, { ICategory } from "../models/category.model";

// Create a new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categoryName,
      description,
      parentCategory,
      isGlobal = true,
      sortOrder = 0,
      metaTitle,
      metaDescription
    } = req.body;

    const user = (req as any).user;

    // Get image URL from cloudinary upload
    const image = (req as any).file?.path;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Category image is required"
      });
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ 
      categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') },
      vendor: user?.role === 'vendor' ? user._id : null
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists"
      });
    }

    // Create category data
    const categoryData: Partial<ICategory> = {
      categoryName,
      description,
      image,
      isGlobal,
      sortOrder,
      metaTitle,
      metaDescription
    };

    // Add parent category if provided
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found"
        });
      }
      categoryData.parentCategory = parentCategory;
    }

    // Add vendor if user is a vendor
    if (user?.role === 'vendor') {
      categoryData.vendor = user._id;
      categoryData.isGlobal = false; // Vendor categories are not global by default
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    next(error);
  }
};

// Get all categories (with filtering)
// export const getCategories = async (req: Request, res: Response) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       parentCategory,
//       isGlobal,
//       vendor
//     } = req.query;

//     const skip = (Number(page) - 1) * Number(limit);
    
//     // Build filter object
//     const filter: any = { isactive: true };

//     // Add search filter
//     if (search) {
//       filter.categoryname = { $regex: search, $options: 'i' };
//     }

//     // Add parent category filter
//     if (parentCategory) {
//       if (parentCategory === 'null') {
//         filter.parentCategory = null;
//       } else {
//         filter.parentCategory = parentCategory;
//       }
//     }

//     // Add global filter
//     if (isGlobal !== undefined) {
//       filter.isGlobal = isGlobal === 'true';
//     }

//     // Add vendor filter
//     if (vendor) {
//       filter.vendor = vendor;
//     } else if (req.user?.role === 'vendor') {
//       // If user is vendor, show their categories + global categories
//       filter.$or = [
//         { vendor: req.user.id },
//         { isGlobal: true }
//       ];
//     }

//     const categories = await Category.find(filter)
//       .populate('parentCategory', 'categoryname')
//       .populate('vendor', 'name email')
//       .sort({ sortOrder: 1, categoryname: 1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Category.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       data: categories,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / Number(limit))
//       }
//     });

//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// Get category by ID
// export const getCategoryById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const category = await Category.findById(id)
//       .populate('parentCategory', 'categoryname')
//       .populate('vendor', 'name email')
//       .populate('subcategories', 'categoryname image isactive');

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: category
//     });

//   } catch (error) {
//     console.error("Error fetching category:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// Update category
// export const updateCategory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Get image URL if new image uploaded
//     if ((req as any).file?.secure_url) {
//       updateData.image = (req as any).file.secure_url;
//     }

//     const category = await Category.findById(id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found"
//       });
//     }

//     // Check if user has permission to update this category
//     if (req.user?.role === 'vendor' && category.vendor?.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to update this category"
//       });
//     }

//     // Check if category name already exists (excluding current category)
//     if (updateData.categoryname) {
//       const existingCategory = await Category.findOne({
//         categoryname: { $regex: new RegExp(`^${updateData.categoryname}$`, 'i') },
//         _id: { $ne: id },
//         vendor: req.user?.role === 'vendor' ? req.user.id : null
//       });

//       if (existingCategory) {
//         return res.status(400).json({
//           success: false,
//           message: "Category with this name already exists"
//         });
//       }
//     }

//     const updatedCategory = await Category.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('parentCategory', 'categoryname')
//      .populate('vendor', 'name email');

//     res.status(200).json({
//       success: true,
//       message: "Category updated successfully",
//       data: updatedCategory
//     });

//   } catch (error) {
//     console.error("Error updating category:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// Delete category
// export const deleteCategory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const category = await Category.findById(id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found"
//       });
//     }

//     // Check if user has permission to delete this category
//     if (req.user?.role === 'vendor' && category.vendor?.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to delete this category"
//       });
//     }

//     // Check if category has subcategories
//     const hasSubcategories = await Category.exists({ parentCategory: id });
//     if (hasSubcategories) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot delete category with subcategories. Please delete subcategories first."
//       });
//     }

//     // Soft delete - set isactive to false
//     await Category.findByIdAndUpdate(id, { isactive: false });

//     res.status(200).json({
//       success: true,
//       message: "Category deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error deleting category:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// }; 