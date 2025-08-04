import express from "express";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCart,
  getCartSummary,
  getCartAnalytics,
  getAbandonedCarts,
} from "../controllers/cart.controller";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { validateRequest } from "../middleware/validate.request";
import {
  addToCartValidation,
  updateCartItemQuantityValidation,
  removeFromCartValidation,
  clearCartValidation,
  getCartValidation,
  getCartSummaryValidation,
  getCartAnalyticsValidation,
  getAbandonedCartsValidation,
} from "../middleware/validation/cart.validation";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateJWT);

// Customer cart management routes
router.post("/add", addToCartValidation, validateRequest, addToCart);
router.patch("/update-quantity", updateCartItemQuantityValidation, validateRequest, updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCartValidation, validateRequest, removeFromCart);
router.delete("/clear", clearCartValidation, validateRequest, clearCart);
router.get("/", getCartValidation, validateRequest, getCart);
router.get("/summary", getCartSummaryValidation, validateRequest, getCartSummary);

// Analytics routes (admin and vendor only)
router.get("/analytics", authorizeRoles(["admin", "vendor"]), getCartAnalyticsValidation, validateRequest, getCartAnalytics);
router.get("/abandoned", authorizeRoles(["admin", "vendor"]), getAbandonedCartsValidation, validateRequest, getAbandonedCarts);

export default router; 