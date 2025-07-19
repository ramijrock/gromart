import { Router } from "express";
import { validateRequest } from "../middleware/validate.request";
import { validateSignIn, validateSignup } from "../middleware/validation/auth.validation";
import { allUsers, currentUser, logIn, signUp } from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/authenticateJWT";

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

// Get details of the currently logged-in user
router.get("/current-user", authenticateJWT, currentUser);

export default router;