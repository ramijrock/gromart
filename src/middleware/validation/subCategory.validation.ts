import { body, query } from "express-validator";

export const validateAddSubCategory = [
    body('subCategoryName')
        .trim()
        .notEmpty()
        .withMessage('Sub-Category name is required!'),
    body('parentCategory')
        .trim()
        .notEmpty()
        .isMongoId()
        .withMessage('Category ID must be a valid Mongo ID'),
    body('isactive')
        .optional()
        .isBoolean()
        .withMessage('isactive must be a boolean'),
    body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer'),
    body('vendor')
        .optional()
        .isMongoId()
        .withMessage('Vendor must be a valid Mongo ID'),
];

export const validateSubCategoryQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive number'),

    query('categoryId')
        .optional()
        .isMongoId()
        .withMessage('Category ID must be a valid Mongo ID'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search term must be less than 100 characters'),
    
    query('vendor')
        .optional()
        .isMongoId()
        .withMessage('Vendor must be a valid MongoDB ObjectId')
]; 

