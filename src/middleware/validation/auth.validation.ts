import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


export const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('mobile')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Mobile number is required!')
        .matches(/^[0-9]{10}$/)
        .withMessage('Please enter a valid 10-digit mobile number'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character'),
];
