import express from 'express';
import { addSubCategory, getSubCategories } from '../controllers/subcategory.controller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { validateAddSubCategory, validateSubCategoryQuery } from '../middleware/validation/subCategory.validation';
import { validateRequest } from '../middleware/validate.request';
import getCloudinaryMulter from '../middleware/cloudinaryMulter';

const router = express.Router();

// Public routes
router.get("/list", validateSubCategoryQuery, validateRequest, getSubCategories);
// router.get("/sub-category/:id", getSubCategoryById);

// Add subcategory
router.post('/add', authenticateJWT, authorizeRoles(["admin"]), getCloudinaryMulter("subCategory").single('image'), validateAddSubCategory, validateRequest, addSubCategory);

export default router; 