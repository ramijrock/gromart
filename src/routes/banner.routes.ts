import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { addBanner } from "../controllers/banner.controller";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/add-banner",
  authenticateJWT,
  addBanner
);


export default router;