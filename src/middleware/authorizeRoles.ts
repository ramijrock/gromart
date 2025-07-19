import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { AuthenticatedRequest } from "./authenticateJWT";

// Middleware to restrict access based on roles
export const authorizeRoles = (allowedRoles: Array<IUser["role"]>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user as IUser; // Extract user from the request object
    // If no user is found, return unauthorized
    if (!user) {
      res.status(401).json({
        message: "Unauthorized: No user found",
      });
      return;
    }

    // If the user's role is not in the allowed roles, return access denied
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        message: `Access denied for role: ${user.role}`,
      });
      return;
    }

    // User is authorized, proceed to the next middleware or route handler
    next();
  };
};
