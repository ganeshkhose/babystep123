import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items, guestInfo, shippingAddress, paymentMethod, userId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'A non-empty list of items is required',
      });
      return;
    }

    const order = await orderService.createOrder({
      items,
      guestInfo,
      shippingAddress,
      paymentMethod,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
};

export const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const orders = await orderService.getOrdersByUserId(userId);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order #${orderId} not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
