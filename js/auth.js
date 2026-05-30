/* =============================================
   CaveCrew — Auth Page JavaScript
   auth.js
   ============================================= */

'use strict';

// =============================================
// Tab Switching
// =============================================
function initTabs() {
  const signinTab = document.getElementById('signinTab');
  const signupTab = document.getElementById('signupTab');
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const indicator = document.getElementById('tabIndicator');

  if (!signinTab) return;

  // Check URL param for default tab
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'signup') {
    switchTab('signup');
  }

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
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');

  if (!input) return;

  input.addEventListener('input', () => {
    const val = input.value;
    const score = getPasswordScore(val);

    const levels = [
      { pct: 0, cls: '', text: 'Enter a password' },
      { pct: 25, cls: '', text: 'Too weak' },
      { pct: 50, cls: 'pw-strength__fill--fair', text: 'Fair' },
      { pct: 75, cls: 'pw-strength__fill--good', text: 'Good' },
      { pct: 100, cls: 'pw-strength__fill--strong', text: 'Strong' },
    ];

    const level = levels[score];
    fill.style.width = level.pct + '%';
    fill.className = 'pw-strength__fill ' + level.cls;
    label.textContent = level.text;
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
// Form Validation
// =============================================
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================
// Sign In Form
// =============================================
function initSignIn() {
  const form = document.getElementById('signinForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearError('signinEmailError');
    clearError('signinPasswordError');

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    let valid = true;

    if (!email) {
      showError('signinEmailError', 'Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('signinEmailError', 'Please enter a valid email');
      valid = false;
    }

    if (!password) {
      showError('signinPasswordError', 'Password is required');
      valid = false;
    }

    if (!valid) return;

    // Simulate loading
    setLoading('signinSubmit', true);

    await simulateDelay(1800);

    setLoading('signinSubmit', false);

    // Demo: any credentials work
    const nameParts = email.split('@')[0].split('.');
    const firstName = capitalize(nameParts[0] || 'User');
    const lastName = capitalize(nameParts[1] || '');

    const userData = {
      email,
      name: [firstName, lastName].filter(Boolean).join(' '),
      firstName,
      initials: (firstName[0] + (lastName[0] || firstName[1] || '')).toUpperCase(),
    };

    localStorage.setItem('cavecrew_user', JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
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

    const errors = {
      firstNameError: '',
      lastNameError: '',
      signupEmailError: '',
      signupPasswordError: '',
      agreeTermsError: '',
    };

    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const agreed = document.getElementById('agreeTerms').checked;

    let valid = true;

    if (!firstName) { errors.firstNameError = 'First name is required'; valid = false; }
    if (!email) { errors.signupEmailError = 'Email is required'; valid = false; }
    else if (!validateEmail(email)) { errors.signupEmailError = 'Enter a valid email'; valid = false; }
    if (!password) { errors.signupPasswordError = 'Password is required'; valid = false; }
    else if (password.length < 8) { errors.signupPasswordError = 'Must be at least 8 characters'; valid = false; }
    if (!agreed) { errors.agreeTermsError = 'You must agree to the terms'; valid = false; }

    Object.keys(errors).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = errors[id];
    });

    if (!valid) return;

    setLoading('signupSubmit', true);
    await simulateDelay(2000);
    setLoading('signupSubmit', false);

    const userData = {
      email,
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      initials: (firstName[0] + (lastName[0] || firstName[1] || '')).toUpperCase(),
    };

    localStorage.setItem('cavecrew_user', JSON.stringify(userData));
    window.location.href = 'dashboard.html';
  });
}

// =============================================
// Social Auth Buttons
// =============================================
function initSocialAuth() {
  const googleBtn = document.getElementById('googleAuthBtn');
  const msBtn = document.getElementById('microsoftAuthBtn');

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      googleBtn.disabled = true;
      googleBtn.style.opacity = '0.6';
      await simulateDelay(1500);

      const userData = {
        email: 'demo@gmail.com',
        name: 'Demo User',
        firstName: 'Demo',
        initials: 'DU',
      };
      localStorage.setItem('cavecrew_user', JSON.stringify(userData));
      window.location.href = 'dashboard.html';
    });
  }

  if (msBtn) {
    msBtn.addEventListener('click', async () => {
      msBtn.disabled = true;
      msBtn.style.opacity = '0.6';
      await simulateDelay(1500);

      const userData = {
        email: 'demo@company.com',
        name: 'Demo User',
        firstName: 'Demo',
        initials: 'DU',
      };
      localStorage.setItem('cavecrew_user', JSON.stringify(userData));
      window.location.href = 'dashboard.html';
    });
  }
}

// =============================================
// Helpers
// =============================================
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  btn.disabled = loading;
  if (text) text.hidden = loading;
  if (spinner) spinner.hidden = !loading;
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
