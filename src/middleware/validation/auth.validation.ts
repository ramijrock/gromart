import { body } from "express-validator";


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
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .withMessage('Password must be at least 8 characters long and contain uppercase, lowercase, and a number'),
];

export const validateSignIn = [
    body('email').trim().isEmail().withMessage('Email is required!'),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is required!'),
  ];
