import { body, param, query } from "express-validator";

export const createVendorValidation = [
  body("userId")
    .isMongoId()
    .withMessage("Valid user ID is required"),
  
  body("businessName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Business name must be between 2 and 100 characters"),
  
  body("businessType")
    .isIn(["grocery_store", "supermarket", "convenience_store", "specialty_store", "online_grocery"])
    .withMessage("Valid business type is required"),
  
  body("businessDescription")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Business description cannot exceed 500 characters"),
  
  body("contactPerson")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Contact person name must be between 2 and 50 characters"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  
  body("phone")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Valid phone number is required"),
  
  body("street")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Street address must be between 5 and 200 characters"),
  
  body("city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  
  body("state")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),
  
  body("postalCode")
    .matches(/^[0-9]{6}$/)
    .withMessage("Valid 6-digit postal code is required"),
  
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
];

export const updateVendorValidation = [
  param("id")
    .isMongoId()
    .withMessage("Valid vendor ID is required"),
  
  body("businessName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Business name must be between 2 and 100 characters"),
  
  body("businessType")
    .optional()
    .isIn(["grocery_store", "supermarket", "convenience_store", "specialty_store", "online_grocery"])
    .withMessage("Valid business type is required"),
  
  body("businessDescription")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Business description cannot exceed 500 characters"),
  
  body("contactPerson")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Contact person name must be between 2 and 50 characters"),
  
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  
  body("phone")
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Valid phone number is required"),
  
  body("deliverySettings.minimumOrderAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount must be a positive number"),
  
  body("deliverySettings.deliveryFee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Delivery fee must be a positive number"),
  
  body("deliverySettings.maxDeliveryDistance")
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage("Max delivery distance must be between 0 and 50 km"),
  
  body("commissionRate")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Commission rate must be between 0 and 100"),
  
  body("platformFee")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Platform fee must be between 0 and 100"),
];

export const updateVendorApprovalValidation = [
  param("id")
    .isMongoId()
    .withMessage("Valid vendor ID is required"),
  
  body("approvalStatus")
    .isIn(["approved", "rejected", "suspended"])
    .withMessage("Valid approval status is required"),
  
  body("rejectionReason")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Rejection reason must be between 10 and 500 characters"),
];

export const getVendorByIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Valid vendor ID is required"),
];

export const getVendorByUserIdValidation = [
  param("userId")
    .isMongoId()
    .withMessage("Valid user ID is required"),
];

export const getAllVendorsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  
  query("city")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  
  query("state")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),
  
  query("businessType")
    .optional()
    .isIn(["grocery_store", "supermarket", "convenience_store", "specialty_store", "online_grocery"])
    .withMessage("Valid business type is required"),
  
  query("isApproved")
    .optional()
    .isBoolean()
    .withMessage("isApproved must be a boolean"),
  
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  
  query("sortBy")
    .optional()
    .isIn(["createdAt", "businessName", "ratings.average", "totalRevenue"])
    .withMessage("Valid sort field is required"),
  
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
];

export const searchVendorsByLocationValidation = [
  query("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  
  query("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
  
  query("radius")
    .optional()
    .isFloat({ min: 0.1, max: 50 })
    .withMessage("Radius must be between 0.1 and 50 km"),
  
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
]; 