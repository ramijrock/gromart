import { NextFunction, Request, Response } from "express";
import Product, { IProduct } from "../models/product.model";
import Category from "../models/category.model";
import SubCategory from "../models/subcategory.model";

// Create a new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      price,
      discount = 0,
      categoryId,
      subCategoryId,
      stockQty = 0,
      unit,
      isAvailable = true,
      tags = [],
      variants = [],
      isFeatured = false
    } = req.body;

    const user = (req as any).user;

    // Get image URLs from cloudinary upload
    const files = (req as any).files;
    const images = files?.map((file: any) => ({
      url: file.path,
      alt: name
    })) || [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found"
      });
    }

    // Validate subcategory if provided
    if (subCategoryId) {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(400).json({
          success: false,
          message: "SubCategory not found"
        });
      }
    }

    // Check if product name already exists for this vendor
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      vendorId: user._id,
      isDeleted: false
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists"
      });
    }

    // Create product data
    const productData: Partial<IProduct> = {
      name,
      description,
      images,
      price,
      discount,
      categoryId,
      subCategoryId,
      vendorId: user._id,
      stockQty,
      unit,
      isAvailable,
      tags,
      variants,
      isFeatured
    };

    const product = new Product(productData);
    await product.save();

    // Populate category and subcategory details
    await product.populate([
      { path: 'categoryId', select: 'categoryName' },
      { path: 'subCategoryId', select: 'subCategoryName' }
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// Get all products (with filtering and pagination)
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      subCategoryId,
      vendorId,
      minPrice,
      maxPrice,
      isAvailable,
      isFeatured,
      unit,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const user = (req as any)?.user;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = { isDeleted: false };

    // Add search filter
    if (search) {
      const searchString = String(search);
      filter.$or = [
        { name: { $regex: searchString, $options: 'i' } },
        { description: { $regex: searchString, $options: 'i' } },
        { tags: { $in: [new RegExp(searchString, 'i')] } }
      ];
    }

    // Add category filter
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Add subcategory filter
    if (subCategoryId) {
      filter.subCategoryId = subCategoryId;
    }

    // Add vendor filter (vendors can only see their own products, admins can see all)
    if (vendorId) {
      filter.vendorId = vendorId;
    } else if (user?.role === 'vendor') {
      filter.vendorId = user._id;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // Add availability filter
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    // Add featured filter
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Add unit filter
    if (unit) {
      filter.unit = unit;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const products = await Product.find(filter)
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName')
      .populate('vendorId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any)?.user;

    const filter: any = { _id: id, isDeleted: false };

    // Vendors can only see their own products
    if (user?.role === 'vendor') {
      filter.vendorId = user._id;
    }

    const product = await Product.findOne(filter)
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName')
      .populate('vendorId', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Vendors can only update their own products
    if (user.role === 'vendor' && product.vendorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products"
      });
    }

    // Get image URLs from cloudinary upload if new images are provided
    const files = (req as any).files;
    if (files && files.length > 0) {
      const newImages = files.map((file: any) => ({
        url: file.path,
        alt: req.body.name || product.name
      }));
      req.body.images = newImages;
    }

    // Validate category if being updated
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found"
        });
      }
    }

    // Validate subcategory if being updated
    if (req.body.subCategoryId) {
      const subCategory = await SubCategory.findById(req.body.subCategoryId);
      if (!subCategory) {
        return res.status(400).json({
          success: false,
          message: "SubCategory not found"
        });
      }
    }

    // Check for name conflict if name is being updated
    if (req.body.name && req.body.name !== product.name) {
      const existingProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        vendorId: user._id,
        _id: { $ne: id },
        isDeleted: false
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists"
        });
      }
    }

    // Calculate finalPrice if price or discount is being updated
    const updateData = { ...req.body };
    if (updateData.price || updateData.discount !== undefined) {
      const price = updateData.price || product.price;
      const discount = updateData.discount !== undefined ? updateData.discount : product.discount;
      updateData.finalPrice = price - (price * discount) / 100;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'categoryId', select: 'categoryName' },
      { path: 'subCategoryId', select: 'subCategoryName' }
    ]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    next(error);
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Vendors can only delete their own products
    if (user.role === 'vendor' && product.vendorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products"
      });
    }

    // Soft delete
    await Product.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isAvailable: true,
      isDeleted: false
    })
      .populate('categoryId', 'categoryName')
      .populate('subCategoryId', 'subCategoryName')
      .populate('vendorId', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Featured products retrieved successfully",
      data: products
    });

  } catch (error) {
    next(error);
  }
};

// Update product stock
export const updateProductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
    const user = (req as any).user;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Vendors can only update their own products
    if (user.role === 'vendor' && product.vendorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products"
      });
    }

    // Update stock
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stockQty },
      { new: true }
    ).populate([
      { path: 'categoryId', select: 'categoryName' },
      { path: 'subCategoryId', select: 'subCategoryName' }
    ]);

    res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    next(error);
  }
};

// Toggle product availability
export const toggleProductAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Vendors can only update their own products
    if (user.role === 'vendor' && product.vendorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products"
      });
    }

    // Toggle availability
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isAvailable: !product.isAvailable },
      { new: true }
    ).populate([
      { path: 'categoryId', select: 'categoryName' },
      { path: 'subCategoryId', select: 'subCategoryName' }
    ]);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isAvailable ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct
    });

  } catch (error) {
    next(error);
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Only admins can toggle featured status
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can toggle featured status"
      });
    }

    // Find product
    const product = await Product.findOne({ _id: id, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Toggle featured status
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isFeatured: !product.isFeatured },
      { new: true }
    ).populate([
      { path: 'categoryId', select: 'categoryName' },
      { path: 'subCategoryId', select: 'subCategoryName' }
    ]);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isFeatured ? 'marked as featured' : 'unmarked as featured'} successfully`,
      data: updatedProduct
    });

  } catch (error) {
    next(error);
  }
}; 