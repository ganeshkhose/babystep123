import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { collections, isFirebaseConfigured, db } from '../config/firebase.js';
import { AdminUser } from '../types/admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'baby_step_super_secret_jwt_key_2026_change_in_production';

// In-memory fallback admin user for local development resilience
const FALLBACK_ADMIN: AdminUser = {
  id: 'admin_fallback_01',
  email: 'admin@thebabystep.com',
  name: 'Super Admin',
  role: 'superadmin',
  // bcrypt hash for: Admin@BabyStep2026!
  passwordHash: '$2b$10$MDdH6.nb6n88JX2AYgjdm.wLsQap6XwssmMPUCsBHwU7MKe5CZHeG',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    let adminRecord: AdminUser | null = null;

    // 1. Check Google Cloud Firestore
    if (isFirebaseConfigured && db) {
      try {
        const adminsRef = collections.admins();
        if (adminsRef) {
          const snapshot = await adminsRef.where('email', '==', normalizedEmail).limit(1).get();
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            adminRecord = { id: doc.id, ...doc.data() } as AdminUser;
          }
        }
      } catch (fbErr) {
        console.warn('Firestore admin lookup warning:', fbErr);
      }
    }

    // 2. Local fallback if Firestore has no record yet or was offline
    if (!adminRecord && normalizedEmail === FALLBACK_ADMIN.email) {
      adminRecord = FALLBACK_ADMIN;
    }

    if (!adminRecord) {
      res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
      return;
    }

    if (adminRecord.isActive === false) {
      res.status(403).json({
        success: false,
        message: 'This administrator account has been deactivated.',
      });
      return;
    }

    // 3. Verify password hash
    const isMatch = await bcrypt.compare(password, adminRecord.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
      return;
    }

    // 4. Update last login timestamp in Firestore
    const nowIso = new Date().toISOString();
    if (isFirebaseConfigured && db && adminRecord.id !== FALLBACK_ADMIN.id) {
      try {
        await collections.admins()?.doc(adminRecord.id).update({
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        });
      } catch (updateErr) {
        console.warn('Could not update last login time in Firestore:', updateErr);
      }
    }

    // 5. Generate signed JWT token (valid for 7 days)
    const token = jwt.sign(
      {
        adminId: adminRecord.id,
        email: adminRecord.email,
        name: adminRecord.name,
        role: adminRecord.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin signed in successfully.',
      token,
      admin: {
        id: adminRecord.id,
        email: adminRecord.email,
        name: adminRecord.name,
        role: adminRecord.role,
        lastLoginAt: nowIso,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    admin: req.admin,
  });
};

export const logoutAdmin = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Admin signed out successfully.',
  });
};
