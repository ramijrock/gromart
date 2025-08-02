import { body, query, param } from "express-validator";

export const validateProduct = [
    body('name')
        .trim()
        .isEmpty()
        .withMessage('Product name is required!'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    
    body('price')
        .isEmpty()
        .withMessage('Price is required'),
    
    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),
    
    body('categoryId')
        .trim()
        .isEmpty()
        .withMessage('Category ID is required')
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    
    body('subCategoryId')
        .optional()
        .isMongoId()
        .withMessage('SubCategory ID must be a valid MongoDB ObjectId'),
    
    body('stockQty')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer'),
    
    body('unit')
        .isEmpty()
        .withMessage('Unit is required')
        .isIn(['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet'])
        .withMessage('Unit must be one of: kg, g, liter, ml, pcs, box, packet'),
    
    body('isAvailable')
        .optional()
        .isBoolean()
        .withMessage('isAvailable must be a boolean value'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    
    body('tags.*')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Each tag must be less than 50 characters'),
    
    body('variants')
        .optional()
        .isArray()
        .withMessage('Variants must be an array'),
    
    body('variants.*.name')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Variant name is required'),
    
    body('variants.*.price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Variant price must be a positive number'),
    
    body('variants.*.stockQty')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Variant stock quantity must be a non-negative integer'),
    
    body('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean value')
];

export const validateProductUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty!')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),
    
    body('categoryId')
        .optional()
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    
    body('subCategoryId')
        .optional()
        .isMongoId()
        .withMessage('SubCategory ID must be a valid MongoDB ObjectId'),
    
    body('stockQty')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer'),
    
    body('unit')
        .optional()
        .isIn(['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet'])
        .withMessage('Unit must be one of: kg, g, liter, ml, pcs, box, packet'),
    
    body('isAvailable')
        .optional()
        .isBoolean()
        .withMessage('isAvailable must be a boolean value'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    
    body('tags.*')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Each tag must be less than 50 characters'),
    
    body('variants')
        .optional()
        .isArray()
        .withMessage('Variants must be an array'),
    
    body('variants.*.name')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Variant name is required'),
    
    body('variants.*.price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Variant price must be a positive number'),
    
    body('variants.*.stockQty')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Variant stock quantity must be a non-negative integer'),
    
    body('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean value')
];

export const validateProductQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive number'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search term must be less than 100 characters'),
    
    query('categoryId')
        .optional()
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    
    query('subCategoryId')
        .optional()
        .isMongoId()
        .withMessage('SubCategory ID must be a valid MongoDB ObjectId'),
    
    query('vendorId')
        .optional()
        .isMongoId()
        .withMessage('Vendor ID must be a valid MongoDB ObjectId'),
    
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Min price must be a positive number'),
    
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Max price must be a positive number'),
    
    query('isAvailable')
        .optional()
        .isBoolean()
        .withMessage('isAvailable must be a boolean value'),
    
    query('isFeatured')
        .optional()
        .isBoolean()
        .withMessage('isFeatured must be a boolean value'),
    
    query('unit')
        .optional()
        .isIn(['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet'])
        .withMessage('Unit must be one of: kg, g, liter, ml, pcs, box, packet'),
    
    query('sortBy')
        .optional()
        .isIn(['name', 'price', 'createdAt', 'totalSold', 'ratings.average'])
        .withMessage('Sort by must be one of: name, price, createdAt, totalSold, ratings.average'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc')
];

export const validateProductId = [
    param('id')
        .isMongoId()
        .withMessage('Product ID must be a valid MongoDB ObjectId')
];

export const validateStockUpdate = [
    param('id')
        .isMongoId()
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
    
    body('stockQty')
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer')
]; 