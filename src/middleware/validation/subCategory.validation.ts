import { body } from "express-validator";

export const validateAddSubCategory = [
    body('subCategoryName')
        .trim()
        .isEmpty()
        .withMessage('Sub-Category name is required!'),
    body('parentCategory')
        .trim()
        .isEmpty()
        .withMessage('Parent category is required'),
    body('isGlobal')
        .optional()
        .isBoolean()
        .withMessage('isGlobal must be a boolean value'),
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

