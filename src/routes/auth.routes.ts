import { Router } from "express";
import { validateRequest } from "../middleware/validate.request";
import { validateSignIn, validateSignup } from "../middleware/validation/auth.validation";
import { logIn, signUp } from "../controllers/auth.controller";

const router = Router();

router.post("/signup",
    validateSignup,
    validateRequest,
    signUp
);

router.post("/login",
    validateSignIn,
    validateRequest,
    logIn
)

export default router;