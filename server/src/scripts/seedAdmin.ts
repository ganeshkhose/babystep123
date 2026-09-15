import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { collections, isFirebaseConfigured, db } from '../config/firebase.js';
import { INITIAL_PRODUCTS } from '../data/initialProducts.js';

async function seedAdminAndDatabase() {
  console.log('🚀 Starting Baby Step Database & SuperAdmin Seed Script...');

  if (!isFirebaseConfigured || !db) {
    console.error('❌ Firebase is not configured. Check your server/.env credentials.');
    process.exit(1);
  }

  const adminsRef = collections.admins();
  const productsRef = collections.products();

  if (!adminsRef || !productsRef) {
    console.error('❌ Could not retrieve collection references.');
    process.exit(1);
  }

  // 1. Seed Initial SuperAdmin
  const adminEmail = 'admin@thebabystep.com';
  const defaultPassword = 'Admin@BabyStep2026!';

  try {
    console.log(`🔐 Checking/Creating initial SuperAdmin: ${adminEmail}...`);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const newAdminDoc = adminsRef.doc('superadmin_baby_step_01');
    await newAdminDoc.set({
      id: 'superadmin_baby_step_01',
      email: adminEmail,
      name: 'The Baby Step Store Admin',
      role: 'superadmin',
      passwordHash,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ SuperAdmin created successfully in Firestore!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${defaultPassword}`);

    // 2. Seed Initial Products if Firestore products collection is empty
    console.log(`📦 Seeding ${INITIAL_PRODUCTS.length} initial products to Firestore...`);
    for (const prod of INITIAL_PRODUCTS) {
      await productsRef.doc(prod.id).set(prod, { merge: true });
    }
    console.log('✅ Initial products successfully synced to Firestore!');

    console.log('✨ Seed script completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('DEBUG FIRESTORE ERROR:', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
    });
    process.exit(1);
  }
}

seedAdminAndDatabase();
