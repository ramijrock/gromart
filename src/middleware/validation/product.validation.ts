import { body, query, param } from "express-validator";

export const validateProduct = [
    body('name')
        .notEmpty()
        .withMessage('Product name is required!')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .custom((value) => {
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        })
        .withMessage('Price must be a positive number'),
    
    body('discount')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          const num = Number(value);
          return !isNaN(num) && num >= 0 && num <= 100;
        })
        .withMessage('Discount must be between 0 and 100'),
    
    body('categoryId')
        .notEmpty()
        .withMessage('Category ID is required')
        .bail()
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    
    body('subCategoryId')
        .optional()
        .isMongoId()
        .withMessage('SubCategory ID must be a valid MongoDB ObjectId'),
    
    body('stockQty')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (value === null) return true;
          const num = Number(value);
          const isValid = !isNaN(num) && Number.isInteger(num) && num >= 0;
          console.log('stockQty validation - num:', num, 'isValid:', isValid);
          return isValid;
        })
        .withMessage('Stock quantity must be a non-negative integer'),
    
    body('unit')
        .notEmpty()
        .withMessage('Unit is required')
        .isIn(['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet'])
        .withMessage('Unit must be one of: kg, g, liter, ml, pcs, box, packet'),
    
    body('isAvailable')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          return value === 'true' || value === 'false' || value === true || value === false;
        })
        .withMessage('isAvailable must be a boolean value'),
    
    body('tags')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed);
            } catch {
              return false;
            }
          }
          return Array.isArray(value);
        })
        .withMessage('Tags must be an array'),
    
    body('variants')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed);
            } catch {
              return false;
            }
          }
          return Array.isArray(value);
        })
        .withMessage('Variants must be an array'),
    
    body('isFeatured')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          return value === 'true' || value === 'false' || value === true || value === false;
        })
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
        .custom((value) => {
          const num = Number(value);
          return !isNaN(num) && num >= 0;
        })
        .withMessage('Price must be a positive number'),
    
    body('discount')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          const num = Number(value);
          return !isNaN(num) && num >= 0 && num <= 100;
        })
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
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (value === null) return true;
          const num = Number(value);
          const isValid = !isNaN(num) && Number.isInteger(num) && num >= 0;
          console.log('stockQty update validation - num:', num, 'isValid:', isValid);
          return isValid;
        })
        .withMessage('Stock quantity must be a non-negative integer'),
    
    body('unit')
        .optional()
        .isIn(['kg', 'g', 'liter', 'ml', 'pcs', 'box', 'packet'])
        .withMessage('Unit must be one of: kg, g, liter, ml, pcs, box, packet'),
    
    body('isAvailable')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          return value === 'true' || value === 'false' || value === true || value === false;
        })
        .withMessage('isAvailable must be a boolean value'),
    
    body('tags')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed);
            } catch {
              return false;
            }
          }
          return Array.isArray(value);
        })
        .withMessage('Tags must be an array'),
    
    body('variants')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed);
            } catch {
              return false;
            }
          }
          return Array.isArray(value);
        })
        .withMessage('Variants must be an array'),
    
    body('isFeatured')
        .optional()
        .custom((value) => {
          if (value === undefined || value === '') return true;
          return value === 'true' || value === 'false' || value === true || value === false;
        })
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
        .notEmpty()
        .withMessage('Stock quantity is required')
        .custom((value) => {
          const num = Number(value);
          const isValid = !isNaN(num) && Number.isInteger(num) && num >= 0;
          console.log('stockQty update validation - num:', num, 'isValid:', isValid);
          return isValid;
        })
        .withMessage('Stock quantity must be a non-negative integer')
]; 