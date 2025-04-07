import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDZBbvlvDjwhUskRicifv8BdJNq271hYAY",
  authDomain: "nextjs-auth-app-f86cf.firebaseapp.com",
  projectId: "nextjs-auth-app-f86cf",
  storageBucket: "nextjs-auth-app-f86cf.appspot.com",
  messagingSenderId: "467208115791",
  appId: "1:467208115791:web:7aedb07a00b01667f93c3a",
  measurementId: "G-XGR2254X9Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let analytics = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(console.error);
}

export { app, auth, provider, signInWithPopup, signOut, analytics };
