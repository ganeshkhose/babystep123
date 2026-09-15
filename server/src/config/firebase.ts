import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let isFirebaseConfigured = false;
let db: Firestore | null = null;
let adminApp: App | null = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    const databaseId = process.env.FIREBASE_DATABASE_ID || 'default';
    db = getFirestore(adminApp, databaseId);
    isFirebaseConfigured = true;
    console.log(`✅ Firebase Admin connected to project: ${projectId} (Database: ${databaseId})`);
  } else {
    console.log('ℹ️ Firebase credentials not provided in environment; operating in robust in-memory mode.');
  }
} catch (error) {
  console.warn('⚠️ Could not initialize Firebase Admin:', error);
}

// Collection references helper
export const collections = {
  products: () => (db ? db.collection('products') : null),
  admins: () => (db ? db.collection('admins') : null),
};

export { adminApp as admin, db, isFirebaseConfigured };
