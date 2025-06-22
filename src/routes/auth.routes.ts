import { Router } from "express";
import { validateRequest } from "../middleware/validate.request";
import { validateSignup } from "../middleware/validation/auth.validation";

const router = Router();

router.post("/signup",
    validateSignup,
    validateRequest,
    // signUp
);

export default router;