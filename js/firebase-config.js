// =============================================
// Firebase Configuration
// @social — replace values with your Firebase project
// =============================================

const firebaseConfig = {
  apiKey: "REPLACE_API_KEY",
  authDomain: "REPLACE_AUTH_DOMAIN",
  projectId: "REPLACE_PROJECT_ID",
  storageBucket: "REPLACE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_MESSAGING_SENDER_ID",
  appId: "REPLACE_APP_ID"
};

// ── Google OAuth Client ID ────────────────────
// Get from: console.cloud.google.com
//   → APIs & Services → Credentials → Create OAuth 2.0 Client ID
//   → Add Authorized origin: https://cavecrew.vercel.app
const GOOGLE_CLIENT_ID = "REPLACE_GOOGLE_CLIENT_ID";

// ── Microsoft Azure App ID ────────────────────
// Get from: portal.azure.com
//   → Azure Active Directory → App registrations → New registration
//   → Redirect URI: https://cavecrew.vercel.app/login.html
const MICROSOFT_CLIENT_ID = "REPLACE_MICROSOFT_CLIENT_ID";

// ── Check if Firebase is configured ──────────
const FIREBASE_CONFIGURED = !firebaseConfig.apiKey.startsWith("REPLACE");

// Initialize Firebase only if configured
let auth = null;
if (FIREBASE_CONFIGURED) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  auth = firebase.auth();
}
