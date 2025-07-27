import { body } from "express-validator";

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

