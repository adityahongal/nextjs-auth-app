// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  signOut,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase - making sure everything happens only in browser
const app = typeof window !== 'undefined' ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null;
const auth = typeof window !== 'undefined' ? getAuth(app) : null;
const provider = new GoogleAuthProvider();

// Initialize persistence only in browser
if (typeof window !== 'undefined' && auth) {
  // Add specific scopes if needed
  provider.addScope('profile');
  provider.addScope('email');
  
  // Set persistence to local
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Auth persistence set to local"))
    .catch(error => console.error("Auth persistence error:", error));
}

// Initialize analytics only in browser
let analytics = null;
if (typeof window !== 'undefined' && app) {
  isSupported()
    .then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Analytics initialized");
      }
    })
    .catch(console.error);
}

export { 
  app, 
  auth, 
  provider, 
  signInWithRedirect, 
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  analytics 
};