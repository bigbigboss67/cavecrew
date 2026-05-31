// =============================================
// Firebase Configuration
// @social — replace values with your project
// =============================================

const firebaseConfig = {
  apiKey: "REPLACE_API_KEY",
  authDomain: "REPLACE_AUTH_DOMAIN",
  projectId: "REPLACE_PROJECT_ID",
  storageBucket: "REPLACE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_MESSAGING_SENDER_ID",
  appId: "REPLACE_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Exports used by all pages
const auth = firebase.auth();
