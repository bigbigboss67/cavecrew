/* =============================================
   @social — Firebase + OAuth Auth Logic
   firebase-auth.js
   ============================================= */

'use strict';

// =============================================
// Email Sign Up
// =============================================
async function signUpWithEmail(firstName, lastName, email, password) {
  if (!FIREBASE_CONFIGURED || !auth) throw { code: 'auth/not-configured' };
  const credential = await auth.createUserWithEmailAndPassword(email, password);
  await credential.user.updateProfile({
    displayName: `${firstName} ${lastName}`.trim()
  });
  return credential.user;
}

// =============================================
// Email Sign In
// =============================================
async function signInWithEmail(email, password) {
  if (!FIREBASE_CONFIGURED || !auth) throw { code: 'auth/not-configured' };
  const credential = await auth.signInWithEmailAndPassword(email, password);
  return credential.user;
}

// =============================================
// Google Sign In — uses Google Identity Services
// Works independently of Firebase if GOOGLE_CLIENT_ID is set
// =============================================
function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    const googleConfigured = typeof GOOGLE_CLIENT_ID !== 'undefined' &&
                             !GOOGLE_CLIENT_ID.startsWith('REPLACE');
    const firebaseReady    = FIREBASE_CONFIGURED && auth;

    if (!googleConfigured && !firebaseReady) {
      reject({ code: 'auth/google-not-configured' });
      return;
    }

    if (firebaseReady) {
      // Use Firebase Google provider (recommended when Firebase is set up)
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      auth.signInWithPopup(provider)
        .then(cred => resolve(cred.user))
        .catch(reject);
    } else {
      // Fallback: Google Identity Services standalone
      if (typeof google === 'undefined') {
        reject({ code: 'auth/google-sdk-missing' });
        return;
      }
      google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: (response) => {
          if (response.error) { reject({ code: 'auth/google-error', message: response.error }); return; }
          // Fetch user info
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.access_token}` }
          })
          .then(r => r.json())
          .then(profile => {
            // Store in sessionStorage as a lightweight "user" object
            const user = {
              displayName: profile.name,
              email: profile.email,
              photoURL: profile.picture,
              uid: profile.sub,
              isGoogleUser: true,
            };
            sessionStorage.setItem('socialUser', JSON.stringify(user));
            resolve(user);
          })
          .catch(() => reject({ code: 'auth/google-profile-error' }));
        },
      }).requestAccessToken();
    }
  });
}

// =============================================
// Microsoft Sign In — MSAL.js
// =============================================
function signInWithMicrosoft() {
  return new Promise((resolve, reject) => {
    const msConfigured = typeof MICROSOFT_CLIENT_ID !== 'undefined' &&
                         !MICROSOFT_CLIENT_ID.startsWith('REPLACE');

    if (!msConfigured) {
      reject({ code: 'auth/microsoft-not-configured' });
      return;
    }

    if (typeof msal === 'undefined') {
      reject({ code: 'auth/msal-missing' });
      return;
    }

    const msalConfig = {
      auth: {
        clientId: MICROSOFT_CLIENT_ID,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin + '/login.html',
      },
      cache: { cacheLocation: 'sessionStorage' },
    };

    const msalInstance = new msal.PublicClientApplication(msalConfig);

    const loginRequest = {
      scopes: ['User.Read', 'openid', 'profile', 'email'],
      prompt: 'select_account',
    };

    msalInstance.loginPopup(loginRequest)
      .then(response => {
        const account = response.account;
        const user = {
          displayName: account.name,
          email: account.username,
          uid: account.localAccountId,
          isMicrosoftUser: true,
        };
        sessionStorage.setItem('socialUser', JSON.stringify(user));
        resolve(user);
      })
      .catch(err => {
        if (err.errorCode === 'user_cancelled') {
          reject({ code: 'auth/popup-closed-by-user' });
        } else {
          reject({ code: 'auth/microsoft-error', message: err.message });
        }
      });
  });
}

// =============================================
// Sign Out
// =============================================
async function signOutUser() {
  sessionStorage.removeItem('socialUser');
  if (FIREBASE_CONFIGURED && auth) {
    try { await auth.signOut(); } catch(e) {}
  }
  window.location.href = 'login.html';
}

// =============================================
// Require Auth — protect dashboard pages
// =============================================
function requireAuth(callback) {
  // Check sessionStorage first (Google/Microsoft users)
  const sessionUser = getSessionUser();
  if (sessionUser) {
    callback(sessionUser);
    return;
  }

  if (FIREBASE_CONFIGURED && auth) {
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = 'login.html';
      } else {
        callback(user);
      }
    });
  } else {
    // Firebase not configured — redirect to login
    window.location.href = 'login.html';
  }
}

// =============================================
// Get session user (Google/Microsoft non-Firebase users)
// =============================================
function getSessionUser() {
  try {
    return JSON.parse(sessionStorage.getItem('socialUser') || 'null');
  } catch(e) { return null; }
}

// =============================================
// Populate UI with current user info
// =============================================
function populateUserUI(user) {
  if (!user) return;
  const name = user.displayName || user.email?.split('@')[0] || 'User';
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName  = nameParts[1] || '';
  const initials  = (firstName[0] + (lastName[0] || firstName[1] || '')).toUpperCase();

  document.querySelectorAll('#userAvatar').forEach(el => el.textContent = initials);
  document.querySelectorAll('#userName').forEach(el => el.textContent = name);
  document.querySelectorAll('#userEmail').forEach(el => el.textContent = user.email || '');
  document.querySelectorAll('#welcomeName').forEach(el => el.textContent = firstName);
}

// =============================================
// Error messages
// =============================================
function getAuthErrorMessage(code) {
  const messages = {
    'auth/not-configured':          'Email login requires Firebase setup. Please contact your admin.',
    'auth/google-not-configured':   'Google login is not set up yet. Use email/password for now.',
    'auth/microsoft-not-configured':'Microsoft login is not set up yet. Use email/password for now.',
    'auth/google-sdk-missing':      'Google SDK failed to load. Check your internet connection.',
    'auth/msal-missing':            'Microsoft SDK failed to load. Check your internet connection.',
    'auth/google-error':            'Google sign-in failed. Please try again.',
    'auth/microsoft-error':         'Microsoft sign-in failed. Please try again.',
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Incorrect email or password.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/popup-closed-by-user':    'Sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Another sign-in is already in progress.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}
