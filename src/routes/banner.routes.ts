import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { addBanner, getBannerList, updateBanner, deleteBanner } from "../controllers/banner.controller";
import { authorizeRoles } from "../middleware/authorizeRoles";
import cloudinaryMulter from "../middleware/cloudinaryMulter";
import { validateAddBanner, validateListQuery } from "../middleware/validation/banner.validation";
import { validateRequest } from "../middleware/validate.request";
import getCloudinaryMulter from "../middleware/cloudinaryMulter";

const router = Router();

// Public routes
router.get("/banner-list", validateListQuery, getBannerList);

// Protected routes (require authentication)
router.post(
  "/add-banner",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateAddBanner,
  validateRequest,
  getCloudinaryMulter("banners").single("image"),
  addBanner
);

router.patch(
  "/update-banner",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  validateAddBanner,
  validateRequest,
  getCloudinaryMulter("banners").single("image"),
  updateBanner
);

router.delete(
  "/delete-banner/:id",
  authenticateJWT,
  authorizeRoles(["vendor", "admin"]),
  deleteBanner
);


export default router;