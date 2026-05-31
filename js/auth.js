/* =============================================
   @social — Auth Page JavaScript
   auth.js — powered by Firebase Auth
   ============================================= */

'use strict';

// =============================================
// If already logged in, redirect to dashboard
// =============================================
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = 'dashboard.html';
  }
});

// =============================================
// Tab Switching
// =============================================
function initTabs() {
  const signinTab  = document.getElementById('signinTab');
  const signupTab  = document.getElementById('signupTab');
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const indicator  = document.getElementById('tabIndicator');

  if (!signinTab) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'signup') switchTab('signup');

  signinTab.addEventListener('click', () => switchTab('signin'));
  signupTab.addEventListener('click', () => switchTab('signup'));

  function switchTab(tab) {
    if (tab === 'signin') {
      signinForm.style.display = 'flex';
      signupForm.style.display = 'none';
      signinTab.classList.add('auth-tab--active');
      signupTab.classList.remove('auth-tab--active');
      indicator.style.transform = 'translateX(0)';
    } else {
      signinForm.style.display = 'none';
      signupForm.style.display = 'flex';
      signupTab.classList.add('auth-tab--active');
      signinTab.classList.remove('auth-tab--active');
      indicator.style.transform = 'translateX(100%)';
    }
  }
}

// =============================================
// Password Strength Meter
// =============================================
function initPasswordStrength() {
  const input = document.getElementById('signupPassword');
  const fill  = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!input) return;

  input.addEventListener('input', () => {
    const score = getPasswordScore(input.value);
    const levels = [
      { pct: 0,   cls: '',                          text: 'Enter a password' },
      { pct: 25,  cls: '',                          text: 'Too weak'         },
      { pct: 50,  cls: 'pw-strength__fill--fair',   text: 'Fair'            },
      { pct: 75,  cls: 'pw-strength__fill--good',   text: 'Good'            },
      { pct: 100, cls: 'pw-strength__fill--strong', text: 'Strong'          },
    ];
    const level = levels[score];
    fill.style.width    = level.pct + '%';
    fill.className      = 'pw-strength__fill ' + level.cls;
    label.textContent   = level.text;
  });

  function getPasswordScore(pw) {
    if (!pw) return 0;
    let score = 1;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  }
}

// =============================================
// Sign In Form
// =============================================
function initSignIn() {
  const form = document.getElementById('signinForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const email    = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;

    let valid = true;
    if (!email)              { showError('signinEmailError', 'Email is required'); valid = false; }
    else if (!isEmail(email)) { showError('signinEmailError', 'Enter a valid email'); valid = false; }
    if (!password)           { showError('signinPasswordError', 'Password is required'); valid = false; }
    if (!valid) return;

    setLoading('signinSubmit', true);

    try {
      await signInWithEmail(email, password);
      // onAuthStateChanged will fire and redirect to dashboard
    } catch (err) {
      setLoading('signinSubmit', false);
      showError('signinPasswordError', getAuthErrorMessage(err.code));
    }
  });
}

// =============================================
// Sign Up Form
// =============================================
function initSignUp() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName  = document.getElementById('signupLastName').value.trim();
    const email     = document.getElementById('signupEmail').value.trim();
    const password  = document.getElementById('signupPassword').value;
    const agreed    = document.getElementById('agreeTerms').checked;

    let valid = true;
    if (!firstName)              { showError('firstNameError', 'First name is required'); valid = false; }
    if (!email)                  { showError('signupEmailError', 'Email is required'); valid = false; }
    else if (!isEmail(email))     { showError('signupEmailError', 'Enter a valid email'); valid = false; }
    if (!password)               { showError('signupPasswordError', 'Password is required'); valid = false; }
    else if (password.length < 6) { showError('signupPasswordError', 'Minimum 6 characters'); valid = false; }
    if (!agreed)                 { showError('agreeTermsError', 'You must agree to the terms'); valid = false; }
    if (!valid) return;

    setLoading('signupSubmit', true);

    try {
      await signUpWithEmail(firstName, lastName, email, password);
      // onAuthStateChanged will fire and redirect to dashboard
    } catch (err) {
      setLoading('signupSubmit', false);
      showError('signupEmailError', getAuthErrorMessage(err.code));
    }
  });
}

// =============================================
// Google Sign In
// =============================================
function initSocialAuth() {
  const googleBtn = document.getElementById('googleAuthBtn');
  const msBtn     = document.getElementById('microsoftAuthBtn');

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      setLoading('googleAuthBtn', true, true);
      try {
        await signInWithGoogle();
        // onAuthStateChanged redirect
      } catch (err) {
        setLoading('googleAuthBtn', false, true);
        // Show brief error below form
        const errEl = document.getElementById('signinPasswordError') || document.getElementById('signupEmailError');
        if (errEl) errEl.textContent = getAuthErrorMessage(err.code);
      }
    });
  }

  // Microsoft — placeholder (requires Azure app registration)
  if (msBtn) {
    msBtn.addEventListener('click', () => {
      alert('Microsoft sign-in requires Azure app registration. Use email/password or Google for now.');
    });
  }
}

// =============================================
// Helpers
// =============================================
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearAllErrors() {
  ['signinEmailError','signinPasswordError',
   'firstNameError','lastNameError','signupEmailError','signupPasswordError','agreeTermsError']
    .forEach(id => showError(id, ''));
}

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function setLoading(btnId, loading, isSocial = false) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;

  if (isSocial) {
    btn.style.opacity = loading ? '0.6' : '1';
    return;
  }

  const text    = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  if (text)    text.hidden    = loading;
  if (spinner) spinner.hidden = !loading;
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPasswordStrength();
  initSignIn();
  initSignUp();
  initSocialAuth();
});
