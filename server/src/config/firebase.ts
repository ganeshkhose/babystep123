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
    db = getFirestore(adminApp);
    isFirebaseConfigured = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    console.log('ℹ️ Firebase credentials not provided in environment; operating in robust in-memory mode.');
  }
} catch (error) {
  console.warn('⚠️ Could not initialize Firebase Admin:', error);
}

export { adminApp as admin, db, isFirebaseConfigured };
