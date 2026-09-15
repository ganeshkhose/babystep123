import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminAuthPayload } from '../types/admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'baby_step_super_secret_jwt_key_2026_change_in_production';

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No administrative authentication token provided.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminAuthPayload;
    req.admin = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Admin session has expired. Please sign in again.',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid administrative session token.',
      code: 'INVALID_TOKEN',
    });
  }
};
