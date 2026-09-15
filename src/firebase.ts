import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(
    app,
    {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    },
    firebaseConfig.firestoreDatabaseId
);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, provider, signInWithPopup, signOut };
