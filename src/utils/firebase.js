import { useState, useEffect, useContext, createContext } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';


// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Create a context to store the authentication state
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

// Sign in with Google
const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Sign up with email and password
const signUpWithEmailPassword = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Sign in with email and password
const signInWithEmailPassword = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Sign out user
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error(error);
    });
};

export { auth, signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, signOutUser };