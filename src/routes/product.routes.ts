import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts,
  updateProductStock,
  toggleProductAvailability,
  toggleFeaturedStatus
} from "../controllers/product.controller";
import { authorizeRoles } from "../middleware/authorizeRoles";
import getCloudinaryMulter from "../middleware/cloudinaryMulter";
import { 
  validateProduct, 
  validateProductUpdate, 
  validateProductQuery, 
  validateProductId,
  validateStockUpdate
} from "../middleware/validation/product.validation";
import { validateRequest } from "../middleware/validate.request";

const router = Router();

// Public routes
router.get("/products-list", validateProductQuery, validateRequest, getProducts);
router.get("/product/:id", validateProductId, validateRequest, getProductById);
router.get("/featured-products", getFeaturedProducts);

// Protected routes (require authentication)
router.post(
  "/add-product",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateProduct,
  validateRequest,
  getCloudinaryMulter("products").array("images", 5), // Allow up to 5 images
  createProduct
);

router.patch(
  "/update-product/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateProductId,
  validateProductUpdate,
  validateRequest,
  getCloudinaryMulter("products").array("images", 5),
  updateProduct
);

router.delete(
  "/delete-product/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateProductId,
  validateRequest,
  deleteProduct
);

// Stock management routes
router.patch(
  "/update-stock/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateStockUpdate,
  validateRequest,
  updateProductStock
);

// Product status management routes
router.patch(
  "/toggle-availability/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateProductId,
  validateRequest,
  toggleProductAvailability
);

// Featured status management (admin only)
router.patch(
  "/toggle-featured/:id",
  authenticateJWT,
  authorizeRoles(["admin"]),
  validateProductId,
  validateRequest,
  toggleFeaturedStatus
);

export default router; 