import { Router } from 'express';
import { createOrder, getOrdersByUserId, getOrderById } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getOrdersByUserId);

export default router;
