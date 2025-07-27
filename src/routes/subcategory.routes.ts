import express from 'express';
import { addSubCategory } from '../controllers/subcategory.controller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { validateAddSubCategory } from '../middleware/validation/subCategory.validation';
import { validateRequest } from '../middleware/validate.request';
import getCloudinaryMulter from '../middleware/cloudinaryMulter';

const router = express.Router();

// Add subcategory
router.post('/add', authenticateJWT, authorizeRoles(["admin"]), getCloudinaryMulter("subCategory").single('image'), validateAddSubCategory, validateRequest, addSubCategory);

export default router; 