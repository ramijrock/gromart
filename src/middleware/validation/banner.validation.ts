import { body, query } from "express-validator";

export const validateAddBanner = [
    body('title')
        .trim()
        .isEmpty()
        .withMessage('Title is required!'),
    body('link')
        .trim()
        .isEmpty()
        .withMessage('Link is required!'),
    body('deviceType')
        .trim()
        .isEmpty()
        .withMessage('Device type is required!'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
];

export const validateListQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive number'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50'),
    query('deviceType')
        .optional()
        .isIn(['mobile', 'web'])
        .withMessage('Invalid device type'),
    query('q')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search query must be less than 100 characters'),
    query('section')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Section must be less than 50 characters')
];