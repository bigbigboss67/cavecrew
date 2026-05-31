// =============================================
// Firebase Configuration — @social
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyBdch9jVPnHN5IpWlsVKAa8ev_RQRItH-k",
  authDomain: "social-media-79409.firebaseapp.com",
  projectId: "social-media-79409",
  storageBucket: "social-media-79409.firebasestorage.app",
  messagingSenderId: "658821839969",
  appId: "1:658821839969:web:b8d3154147587e0edcbe20",
  measurementId: "G-P4EP3MEBTD"
};

// ── Google OAuth Client ID ────────────────────
// Firebase handles Google OAuth automatically via authDomain above
const GOOGLE_CLIENT_ID = "REPLACE_GOOGLE_CLIENT_ID";

// ── Microsoft Azure App ID ────────────────────
const MICROSOFT_CLIENT_ID = "REPLACE_MICROSOFT_CLIENT_ID";

// ── Firebase is configured ✅ ─────────────────
const FIREBASE_CONFIGURED = true;

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth instance used by all pages
const auth = firebase.auth();
