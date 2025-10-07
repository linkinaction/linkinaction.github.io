// Firebase configuration and initialization
const GOOGLE_MAPS_API_KEY = 'AIzaSyBTO9piU4s9LVGYvob043hACb2S2hg7CMU';

// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for Firebase
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables to be used in the main script
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
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
                window.currentUserId = auth.currentUser.uid;
                console.log("Firebase Auth: Signed in with custom token:", window.currentUserId);
            } else {
                await signInAnonymously(auth);
                window.currentUserId = auth.currentUser.uid;
                console.log("Firebase Auth: Signed in anonymously:", window.currentUserId);
            }
        } catch (error) {
            console.error("Firebase Auth: Error during authentication:", error);
        }
    }
    window.isAuthReady = true;
    document.dispatchEvent(new CustomEvent('firebaseAuthReady'));
});