// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make Firebase services globally accessible for main.js
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.currentUserId = null;
window.isAuthReady = false;

// Authenticate user
onAuthStateChanged(auth, async (user) => {
    if (user) {
        window.currentUserId = user.uid;
        console.log("Firebase Auth: Authenticated user ID:", window.currentUserId);
    } else {
        try {
            await signInAnonymously(auth);
            window.currentUserId = auth.currentUser.uid;
            console.log("Firebase Auth: Signed in anonymously:", window.currentUserId);
        } catch (error) {
            console.error("Firebase Auth: Error during authentication:", error);
        }
    }
    window.isAuthReady = true;
    // Dispatch a custom event to let main.js know that authentication is complete
    document.dispatchEvent(new CustomEvent('firebaseAuthReady'));
});