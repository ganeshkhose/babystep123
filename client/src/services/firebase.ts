import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let isFirebaseAvailable = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'your_api_key_here') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    firestore = getFirestore(app);
    isFirebaseAvailable = true;
    console.log('✨ Firebase client successfully connected to', firebaseConfig.projectId);
  } catch (error) {
    console.warn('Firebase initialization note:', error);
  }
} else {
  // Graceful guest/offline mode when keys are not yet added
  console.info('🌱 Baby Step running in Guest Friendly Local Mode (No Firebase keys required for browsing & shopping!)');
}

export { app, auth, firestore, isFirebaseAvailable };
