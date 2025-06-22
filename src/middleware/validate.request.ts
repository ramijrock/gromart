import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    res.status(400).json({
      message: firstError.msg
    });
    return;
  }
  next();
}; 