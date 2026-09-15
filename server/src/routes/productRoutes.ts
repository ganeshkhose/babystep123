import { Router } from 'express';
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';
import {
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/productAdminController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public customer storefront endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected admin endpoints
router.post('/', verifyAdminToken, createProductHandler);
router.put('/:id', verifyAdminToken, updateProductHandler);
router.delete('/:id', verifyAdminToken, deleteProductHandler);

export default router;
