import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { addBanner } from "../controllers/banner.controller";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/add-banner",
  authenticateJWT,
  authorizeRoles(["vendor"]),
  addBanner
);


export default router;