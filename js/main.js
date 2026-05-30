/* =============================================
   CaveCrew — Main JavaScript
   main.js — shared across all pages
   ============================================= */

'use strict';

// =============================================
// Particle Field
// =============================================
function initParticles() {
  const field = document.getElementById('particleField');
  if (!field) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const startX = Math.random() * window.innerWidth;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;

    // Randomly pick purple or cyan
    const colors = ['rgba(99,102,241,0.6)', 'rgba(6,182,212,0.5)', 'rgba(168,85,247,0.4)'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    field.appendChild(p);
  }
}

// =============================================
// Number Counter Animation
// =============================================
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isLarge = target > 100000;

  function format(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return Math.round(n).toString();
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease out
    const current = Math.floor(eased * target);

    el.textContent = format(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = format(target);
    }
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
      }
    });
  }, { threshold: 0.3 });

  els.forEach(el => observer.observe(el));
}

// =============================================
// Input Icons — apply icon offset when icon present
// =============================================
function initInputIcons() {
  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    const icon = wrapper.querySelector('.input-icon');
    const input = wrapper.querySelector('input, textarea');
    if (icon && input) {
      input.style.paddingLeft = '40px';
    }
  });
}

// =============================================
// Password Toggle
// =============================================
function initPasswordToggles() {
  document.querySelectorAll('.input-toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update icon
      btn.innerHTML = isPassword
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });
}

// =============================================
// Sidebar Collapse (dashboard pages)
// =============================================
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('sidebarCollapseBtn');
  const sidebarToggle = document.getElementById('sidebarToggle');

  if (!sidebar) return;

  // Load collapsed state
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });
  }

  // Close mobile sidebar on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('mobile-open') &&
        !sidebar.contains(e.target) &&
        !e.target.closest('#sidebarToggle')) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

// =============================================
// User Data from storage
// =============================================
function loadUserData() {
  const user = JSON.parse(localStorage.getItem('cavecrew_user') || 'null');
  if (!user) return;

  // Update avatar
  document.querySelectorAll('#userAvatar').forEach(el => {
    el.textContent = user.initials || 'JD';
  });
  document.querySelectorAll('#userName').forEach(el => {
    el.textContent = user.name || 'John Doe';
  });
  document.querySelectorAll('#userEmail').forEach(el => {
    el.textContent = user.email || 'user@company.com';
  });
  document.querySelectorAll('#welcomeName').forEach(el => {
    el.textContent = user.firstName || 'there';
  });
}

// =============================================
// Navigation scroll effect
// =============================================
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// =============================================
// Init All
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCounters();
  initInputIcons();
  initPasswordToggles();
  initSidebar();
  loadUserData();
  initNavScroll();
});
