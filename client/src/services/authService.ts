import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore, isFirebaseAvailable } from './firebase';
import { UserProfile } from '../types/user';

const LOCAL_USER_KEY = 'baby_step_user';

export const createDefaultGuestUser = (): UserProfile => ({
  uid: 'guest_' + Math.random().toString(36).substring(2, 9),
  email: null,
  displayName: 'Guest',
  isGuest: true,
  createdAt: new Date().toISOString(),
});

export const getCurrentLocalUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isGuest) {
        parsed.displayName = 'Guest';
      }
      return parsed;
    }
  } catch {
    // Ignore error
  }
  const defaultGuest = createDefaultGuestUser();
  saveLocalUser(defaultGuest);
  return defaultGuest;
};

export const saveLocalUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  if (isFirebaseAvailable && auth) {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const profile: UserProfile = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || email.split('@')[0],
      isGuest: false,
    };
    saveLocalUser(profile);

    if (firestore) {
      setDoc(doc(firestore, 'users', profile.uid), profile, { merge: true }).catch(() => {});
    }
    return profile;
  }

  // Graceful local demo authentication
  const mockUser: UserProfile = {
    uid: `local-${Date.now()}`,
    email,
    displayName: email.split('@')[0],
    isGuest: false,
  };
  saveLocalUser(mockUser);
  return mockUser;
};

export const registerWithEmail = async (name: string, email: string, pass: string): Promise<UserProfile> => {
  if (isFirebaseAvailable && auth) {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    const profile: UserProfile = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: name || email.split('@')[0],
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    saveLocalUser(profile);

    if (firestore) {
      setDoc(doc(firestore, 'users', profile.uid), profile, { merge: true }).catch(() => {});
    }
    return profile;
  }

  // Graceful local demo registration
  const mockUser: UserProfile = {
    uid: `local-${Date.now()}`,
    email,
    displayName: name || email.split('@')[0],
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
  saveLocalUser(mockUser);
  return mockUser;
};

export const logoutUser = async (): Promise<UserProfile> => {
  if (isFirebaseAvailable && auth) {
    await signOut(auth);
  }
  const guest = createDefaultGuestUser();
  saveLocalUser(guest);
  return guest;
};

export const subscribeToAuthChanges = (callback: (user: UserProfile) => void) => {
  if (isFirebaseAvailable && auth) {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const user: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          isGuest: false,
        };
        saveLocalUser(user);
        callback(user);
      } else {
        const local = getCurrentLocalUser();
        callback(local);
      }
    });
  }

  // If Firebase not available, notify with local guest state
  callback(getCurrentLocalUser());
  return () => {};
};
