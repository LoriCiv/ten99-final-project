import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// These values are pulled from your .env.local file or Vercel environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// We check if an app has already been initialized to prevent errors during hot-reloading in development.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export the initialized services to be used in other parts of your application
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

This file is now "healthy" because:
1.  **It's Secure:** It doesn't contain any secret keys directly in the code. It loads them from the environment, which is the correct practice.
2.  **It's Efficient:** It checks if Firebase has already been initialized (`getApps().length === 0`) to prevent re-initializing the app every time you save a file in development.
3.  **It's Clear:** It has one purpose—to configure and export your Firebase servic
