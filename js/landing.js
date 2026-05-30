/* =============================================
   CaveCrew — Landing Page JavaScript
   landing.js
   ============================================= */

'use strict';

// =============================================
// Hamburger Menu
// =============================================
function initHamburger() {
  const btn = document.getElementById('hamburger');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });
}

// =============================================
// Smooth Scroll for Anchor Links
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// =============================================
// Intersection Observer for Animations
// =============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.feature-card, .platform-card, .pricing-card, .stat-pill').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add visible class styles
  const style = document.createElement('style');
  style.textContent = `
    .feature-card.visible,
    .platform-card.visible,
    .pricing-card.visible,
    .stat-pill.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // Stagger children in grids
  document.querySelectorAll('.features-grid, .platforms-showcase, .pricing-grid').forEach(grid => {
    const children = grid.querySelectorAll('.feature-card, .platform-card, .pricing-card');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 60}ms`;
    });
  });
}

// =============================================
// Platform card hover interactions
// =============================================
function initPlatformCards() {
  document.querySelectorAll('.platform-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.pc-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(-5deg)';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.pc-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

// =============================================
// CTA button ripple effect
// =============================================
function initRipple() {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        width: ${Math.max(rect.width, rect.height) * 2}px;
        height: ${Math.max(rect.width, rect.height) * 2}px;
        left: ${x - Math.max(rect.width, rect.height)}px;
        top: ${y - Math.max(rect.width, rect.height)}px;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initSmoothScroll();
  initScrollAnimations();
  initPlatformCards();
  initRipple();
});
