/* =============================================
   @social — Firebase Auth Logic
   firebase-auth.js
   ============================================= */

'use strict';

// =============================================
// Sign Up with Email & Password
// =============================================
async function signUpWithEmail(firstName, lastName, email, password) {
  const credential = await auth.createUserWithEmailAndPassword(email, password);
  // Set display name
  await credential.user.updateProfile({
    displayName: `${firstName} ${lastName}`.trim()
  });
  return credential.user;
}

// =============================================
// Sign In with Email & Password
// =============================================
async function signInWithEmail(email, password) {
  const credential = await auth.signInWithEmailAndPassword(email, password);
  return credential.user;
}

// =============================================
// Google Sign In
// =============================================
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await auth.signInWithPopup(provider);
  return credential.user;
}

// =============================================
// Sign Out
// =============================================
async function signOutUser() {
  await auth.signOut();
  window.location.href = 'login.html';
}

// =============================================
// Require Auth — redirect to login if not signed in
// Call on every protected page
// =============================================
function requireAuth(callback) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
    } else {
      callback(user);
    }
  });
}

// =============================================
// Populate UI with current user info
// =============================================
function populateUserUI(user) {
  const name = user.displayName || user.email.split('@')[0];
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts[1] || '';
  const initials = (firstName[0] + (lastName[0] || firstName[1] || '')).toUpperCase();

  document.querySelectorAll('#userAvatar').forEach(el => el.textContent = initials);
  document.querySelectorAll('#userName').forEach(el => el.textContent = name);
  document.querySelectorAll('#userEmail').forEach(el => el.textContent = user.email);
  document.querySelectorAll('#welcomeName').forEach(el => el.textContent = firstName);
}

// =============================================
// Map Firebase errors to user-friendly messages
// =============================================
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/popup-closed-by-user':    'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Only one sign-in popup at a time.',
    'auth/invalid-credential':      'Invalid email or password.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}
