/* =============================================
   @social — Auth Page JavaScript
   auth.js — Firebase + Google + Microsoft
   ============================================= */

'use strict';

// =============================================
// Redirect to dashboard if already logged in
// =============================================
(function checkExistingSession() {
  // Check sessionStorage (Google / Microsoft users)
  try {
    if (sessionStorage.getItem('socialUser')) {
      window.location.href = 'dashboard.html';
      return;
    }
  } catch(e) {}

  // Check Firebase session
  if (FIREBASE_CONFIGURED && auth) {
    auth.onAuthStateChanged(user => {
      if (user) window.location.href = 'dashboard.html';
    });
  }
})();

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
    fill.style.width  = level.pct + '%';
    fill.className    = 'pw-strength__fill ' + level.cls;
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
    if (!email)               { showError('signinEmailError', 'Email is required'); valid = false; }
    else if (!isEmail(email)) { showError('signinEmailError', 'Enter a valid email'); valid = false; }
    if (!password)            { showError('signinPasswordError', 'Password is required'); valid = false; }
    if (!valid) return;

    setLoading('signinSubmit', true);

    try {
      await signInWithEmail(email, password);
      window.location.href = 'dashboard.html';
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
    const email     = document.getElementById('signupEmail').value.trim();
    const password  = document.getElementById('signupPassword').value;
    const agreed    = document.getElementById('agreeTerms').checked;

    let valid = true;
    if (!firstName)               { showError('firstNameError', 'First name is required'); valid = false; }
    if (!email)                   { showError('signupEmailError', 'Email is required'); valid = false; }
    else if (!isEmail(email))     { showError('signupEmailError', 'Enter a valid email'); valid = false; }
    if (!password)                { showError('signupPasswordError', 'Password is required'); valid = false; }
    else if (password.length < 6) { showError('signupPasswordError', 'Minimum 6 characters'); valid = false; }
    if (!agreed)                  { showError('agreeTermsError', 'You must agree to the terms'); valid = false; }
    if (!valid) return;

    setLoading('signupSubmit', true);

    try {
      const lastName = document.getElementById('signupLastName')?.value.trim() || '';
      await signUpWithEmail(firstName, lastName, email, password);
      window.location.href = 'dashboard.html';
    } catch (err) {
      setLoading('signupSubmit', false);
      showError('signupEmailError', getAuthErrorMessage(err.code));
    }
  });
}

// =============================================
// Google Sign In Button
// =============================================
function initGoogleAuth() {
  const btn = document.getElementById('googleAuthBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    setSocialLoading(btn, true, 'Google');

    try {
      const user = await signInWithGoogle();
      showAuthToast('✅ Signed in with Google!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
    } catch (err) {
      setSocialLoading(btn, false, 'Google');
      const msg = getAuthErrorMessage(err.code);

      if (err.code === 'auth/google-not-configured') {
        showConfigModal('Google');
      } else {
        showAuthToast(msg, 'error');
      }
    }
  });
}

// =============================================
// Microsoft Sign In Button
// =============================================
function initMicrosoftAuth() {
  const btn = document.getElementById('microsoftAuthBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    setSocialLoading(btn, true, 'Microsoft');

    try {
      const user = await signInWithMicrosoft();
      showAuthToast('✅ Signed in with Microsoft!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
    } catch (err) {
      setSocialLoading(btn, false, 'Microsoft');
      const msg = getAuthErrorMessage(err.code);

      if (err.code === 'auth/microsoft-not-configured') {
        showConfigModal('Microsoft');
      } else {
        showAuthToast(msg, 'error');
      }
    }
  });
}

// =============================================
// Config needed modal
// =============================================
function showConfigModal(provider) {
  const existing = document.getElementById('configModal');
  if (existing) existing.remove();

  const steps = {
    Google: {
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
      color: '#4285F4',
      steps: [
        '1. Go to <a href="https://console.firebase.google.com" target="_blank" style="color:#6366f1">console.firebase.google.com</a>',
        '2. Create a project → Authentication → Enable <strong>Google</strong>',
        '3. Project Settings → Web App → copy the <code>firebaseConfig</code>',
        '4. Paste the config in the chat below — we\'ll deploy it instantly!'
      ]
    },
    Microsoft: {
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M0 0h11.5v11.5H0z" fill="#F25022"/><path d="M12.5 0H24v11.5H12.5z" fill="#7FBA00"/><path d="M0 12.5h11.5V24H0z" fill="#00A4EF"/><path d="M12.5 12.5H24V24H12.5z" fill="#FFB900"/></svg>`,
      color: '#00A4EF',
      steps: [
        '1. Go to <a href="https://portal.azure.com" target="_blank" style="color:#6366f1">portal.azure.com</a>',
        '2. Azure Active Directory → App registrations → New registration',
        '3. Add Redirect URI: <code>https://cavecrew.vercel.app/login.html</code>',
        '4. Copy the <strong>Application (client) ID</strong> and send it in chat'
      ]
    }
  };

  const s = steps[provider];
  const modal = document.createElement('div');
  modal.id = 'configModal';
  modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.7);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;padding:20px;backdrop-filter:blur(8px);
  `;

  modal.innerHTML = `
    <div style="
      background:var(--color-surface);
      border:1px solid var(--color-border);
      border-radius:20px;
      padding:32px;
      max-width:460px;
      width:100%;
      box-shadow:0 24px 80px rgba(0,0,0,0.5);
      animation:bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    ">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        ${s.icon}
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--text-primary)">${provider} Login Setup</div>
          <div style="font-size:13px;color:var(--text-muted)">Quick 5-minute setup required</div>
        </div>
        <button onclick="document.getElementById('configModal').remove()" style="
          margin-left:auto;width:30px;height:30px;border-radius:50%;
          background:var(--color-surface-2);color:var(--text-muted);
          font-size:18px;line-height:30px;text-align:center;cursor:pointer;border:none;
        ">×</button>
      </div>

      <div style="
        background:var(--color-surface-2);
        border-radius:12px;
        padding:16px 20px;
        margin-bottom:20px;
      ">
        ${s.steps.map(step => `
          <div style="
            font-size:13px;color:var(--text-secondary);
            padding:6px 0;line-height:1.6;
          ">${step}</div>
        `).join('<hr style="border:none;border-top:1px solid var(--color-border-2);margin:4px 0"/>')}
      </div>

      <div style="
        background:rgba(99,102,241,0.08);
        border:1px solid rgba(99,102,241,0.2);
        border-radius:10px;
        padding:12px 16px;
        font-size:13px;
        color:var(--text-secondary);
        line-height:1.5;
        margin-bottom:20px;
      ">
        💬 <strong style="color:var(--color-primary)">Paste the config/ID in the chat</strong> and it will be deployed live in &lt;30 seconds.
      </div>

      <button onclick="document.getElementById('configModal').remove()" style="
        width:100%;padding:12px;
        background:linear-gradient(135deg,var(--color-primary),var(--color-accent));
        color:white;border:none;border-radius:10px;
        font-size:14px;font-weight:700;cursor:pointer;
        font-family:inherit;
      ">Got it, I'll set it up</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// =============================================
// Toast notification
// =============================================
function showAuthToast(message, type = 'info') {
  let container = document.getElementById('authToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'authToastContainer';
    container.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:9999;
      display:flex;flex-direction:column;gap:8px;pointer-events:none;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: { border: 'rgba(16,185,129,0.4)', text: '#10b981' },
    error:   { border: 'rgba(239,68,68,0.4)',  text: '#ef4444' },
    info:    { border: 'rgba(99,102,241,0.4)', text: '#6366f1' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:var(--color-surface);
    border:1px solid ${c.border};
    border-left:3px solid ${c.text};
    border-radius:10px;padding:12px 18px;
    font-size:14px;font-weight:500;
    color:var(--text-primary);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    pointer-events:all;
    animation:toastSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    font-family:'Outfit',sans-serif;
    max-width:340px;
  `;
  toast.innerHTML = message;

  if (!document.getElementById('toastAnimStyle')) {
    const s = document.createElement('style');
    s.id = 'toastAnimStyle';
    s.textContent = `
      @keyframes toastSlideIn { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
      @keyframes toastSlideOut { to{opacity:0;transform:translateX(60px)} }
      @keyframes bounceIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
    `;
    document.head.appendChild(s);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
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
   'firstNameError','signupEmailError','signupPasswordError','agreeTermsError']
    .forEach(id => showError(id, ''));
}

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  const text    = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  if (text)    text.hidden    = loading;
  if (spinner) spinner.hidden = !loading;
}

function setSocialLoading(btn, loading, label) {
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.7' : '1';
  if (loading) {
    btn.dataset.origHtml = btn.innerHTML;
    btn.innerHTML = `<svg style="animation:spin 0.8s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> ${label}...`;
    if (!document.getElementById('spinStyle')) {
      const s = document.createElement('style');
      s.id = 'spinStyle';
      s.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
  } else {
    btn.innerHTML = btn.dataset.origHtml || label;
  }
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPasswordStrength();
  initSignIn();
  initSignUp();
  initGoogleAuth();
  initMicrosoftAuth();
});
