import { body, query } from "express-validator";

export const validateCategory = [
    body('categoryName')
        .trim()
        .isEmpty()
        .withMessage('Category name is required!'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    
    body('parentCategory')
        .optional()
        .isMongoId()
        .withMessage('Parent category must be a valid MongoDB ObjectId'),
    
    body('isGlobal')
        .optional()
        .isBoolean()
        .withMessage('isGlobal must be a boolean value'),
    
    body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Sort order must be a non-negative integer'),
    
    body('metaTitle')
        .optional()
        .trim()
        .isLength({ max: 60 })
        .withMessage('Meta title must be less than 60 characters'),
    
    body('metaDescription')
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage('Meta description must be less than 160 characters')
];

export const validateCategoryQuery = [
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
    
    query('parentCategory')
        .optional()
        .isMongoId()
        .withMessage('Parent category must be a valid MongoDB ObjectId'),
    
    query('isGlobal')
        .optional()
        .isBoolean()
        .withMessage('isGlobal must be a boolean value'),
    
    query('vendor')
        .optional()
        .isMongoId()
        .withMessage('Vendor must be a valid MongoDB ObjectId')
]; 