import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller";
import { authorizeRoles } from "../middleware/authorizeRoles";
import getCloudinaryMulter from "../middleware/cloudinaryMulter";
import { validateCategory, validateCategoryQuery } from "../middleware/validation/category.validation";
import { validateRequest } from "../middleware/validate.request";

const router = Router();

// Public routes
router.get("/categories-list", validateCategoryQuery, validateRequest, getCategories);
router.get("/category/:id", getCategoryById);

// Protected routes (require authentication)
router.post(
  "/add-category",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateCategory,
  validateRequest,
  getCloudinaryMulter("categories").single("image"),
  createCategory
);

router.patch(
  "/update-category/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateCategory,
  validateRequest,
  getCloudinaryMulter("categories").single("image"),
  updateCategory
);

router.delete(
  "/delete-category/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  deleteCategory
);

export default router;

