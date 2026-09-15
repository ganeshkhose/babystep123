import { Router } from 'express';
import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from '../controllers/adminAuthController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public route to authenticate
router.post('/login', loginAdmin);

// Protected routes requiring valid admin JWT
router.get('/me', verifyAdminToken, getCurrentAdmin);
router.post('/logout', verifyAdminToken, logoutAdmin);

export default router;
