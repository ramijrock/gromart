import express from "express";
import {
  createVendor,
  getVendorById,
  getVendorByUserId,
  getAllVendors,
  updateVendor,
  updateVendorApproval,
  getVendorStats,
  deleteVendor,
  searchVendorsByLocation,
} from "../controllers/vendor.controller";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { validateRequest } from "../middleware/validate.request";
import {
  createVendorValidation,
  updateVendorValidation,
  updateVendorApprovalValidation,
  getVendorByIdValidation,
  getVendorByUserIdValidation,
  getAllVendorsValidation,
  searchVendorsByLocationValidation,
} from "../middleware/validation/vendor.validation";

const router = express.Router();

// Public routes (for customer search)
router.get("/search", searchVendorsByLocationValidation, validateRequest, searchVendorsByLocation);
router.get("/details/:id", getVendorByIdValidation, validateRequest, getVendorById);

// Protected routes - require authentication
router.use(authenticateJWT);

// Vendor management routes
router.post("/create", createVendorValidation, validateRequest, createVendor);
router.get("/user/:userId", getVendorByUserIdValidation, validateRequest, getVendorByUserId);
router.patch("/update/:id", updateVendorValidation, validateRequest, updateVendor);
router.get("/stats/:id", getVendorByIdValidation, validateRequest, getVendorStats);

// Admin only routes
router.get("/list", authorizeRoles(["admin"]), getAllVendorsValidation, validateRequest, getAllVendors);
router.patch("/:id/approval", authorizeRoles(["admin"]), updateVendorApprovalValidation, validateRequest, updateVendorApproval);
router.delete("/delete/:id", authorizeRoles(["admin"]), getVendorByIdValidation, validateRequest, deleteVendor);

export default router; 