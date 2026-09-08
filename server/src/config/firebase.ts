import admin from 'firebase-admin';

let isFirebaseConfigured = false;
let db: admin.firestore.Firestore | null = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    db = admin.firestore();
    isFirebaseConfigured = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    console.log('ℹ️ Firebase credentials not provided in environment; operating in robust in-memory mode.');
  }
} catch (error) {
  console.warn('⚠️ Could not initialize Firebase Admin:', error);
}

export { admin, db, isFirebaseConfigured };
