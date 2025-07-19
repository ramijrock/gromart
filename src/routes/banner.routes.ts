import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { addBanner } from "../controllers/banner.controller";
import { authorizeRoles } from "../middleware/authorizeRoles";
import cloudinaryMulter from "../middleware/cloudinaryMulter";
import { validateAddBanner } from "../middleware/validation/banner.validation";
import { validateRequest } from "../middleware/validate.request";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/add-banner",
  authenticateJWT,
  authorizeRoles(["vendor"]),
  validateAddBanner,
  validateRequest,
  cloudinaryMulter.single("image"),
  // (req, res, next) => {
  //   cloudinaryMulter.single("image")(req, res, function (err) {
  //     if (err) {
  //       console.log("error==========>", JSON.stringify(err));
  //       // This will forward the error to your error handler
  //       return next(err);
  //     }
  //     next();
  //   });
  // },
  addBanner
);


export default router;