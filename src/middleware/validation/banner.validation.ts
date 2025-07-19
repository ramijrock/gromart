import { body } from "express-validator";

export const validateAddBanner = [
    body('title')
        .trim()
        .isEmpty()
        .withMessage('Title is required!'),
    body('link')
        .trim()
        .isEmpty()
        .withMessage('Link is required!'),
    body('deviceType')
      .trim()
      .isEmpty()
      .withMessage('Device type is required!'),
  ];