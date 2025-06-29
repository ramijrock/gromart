import { Router } from "express";
import { validateRequest } from "../middleware/validate.request";
import { validateSignIn, validateSignup } from "../middleware/validation/auth.validation";
import { allUsers, logIn, signUp } from "../controllers/auth.controller";

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
);

router.get("/all-users", allUsers);

export default router;