import { body, param, query } from "express-validator";

// Validation for adding item to cart
export const addToCartValidation = [
  body("productId")
    .isMongoId()
    .withMessage("Valid product ID is required"),
  
  body("quantity")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
];

// Validation for updating cart item quantity
export const updateCartItemQuantityValidation = [
  body("productId")
    .isMongoId()
    .withMessage("Valid product ID is required"),
  
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
];

// Validation for removing item from cart
export const removeFromCartValidation = [
  param("productId")
    .isMongoId()
    .withMessage("Valid product ID is required"),
];

// Validation for cart analytics
export const getCartAnalyticsValidation = [
  query("period")
    .optional()
    .isIn(["7d", "30d", "90d"])
    .withMessage("Period must be one of: 7d, 30d, 90d"),
];

// Validation for abandoned carts
export const getAbandonedCartsValidation = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Validation for cart summary (no additional validation needed as it only uses user ID from token)
export const getCartSummaryValidation = [];

// Validation for getting cart (no additional validation needed as it only uses user ID from token)
export const getCartValidation = [];

// Validation for clearing cart (no additional validation needed as it only uses user ID from token)
export const clearCartValidation = []; 