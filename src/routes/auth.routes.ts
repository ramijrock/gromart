import { Router } from "express";
import { validateRequest } from "../middleware/validate.request";
import { validateSignup } from "../middleware/validation/auth.validation";
import { signUp } from "../controllers/auth.controller";

const router = Router();

router.post("/signup",
    validateSignup,
    validateRequest,
    signUp
);

export default router;