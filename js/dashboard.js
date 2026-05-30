/* =============================================
   CaveCrew — Dashboard JavaScript
   dashboard.js
   ============================================= */

'use strict';

// =============================================
// Data
// =============================================
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: '#e1306c', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' },
  { id: 'twitter', name: 'X', color: '#1da1f2', bg: '#1a1a1a' },
  { id: 'facebook', name: 'Facebook', color: '#1877f2', bg: '#1877f2' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', bg: '#0077b5' },
  { id: 'tiktok', name: 'TikTok', color: '#fe2c55', bg: '#1a1a1a' },
  { id: 'youtube', name: 'YouTube', color: '#ff0000', bg: '#ff0000' },
];

const PLATFORM_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

// =============================================
// Chart Drawing (Canvas-based, no external lib)
// =============================================
function initEngagementChart() {
  const canvas = document.getElementById('engagementChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set high DPI
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;

  const data7d = [42, 58, 45, 71, 65, 88, 76];
  const data30d = Array.from({ length: 30 }, () => Math.floor(Math.random() * 60 + 40));
  const labels7d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let currentData = data7d;
  let currentLabels = labels7d;

  function drawChart(data, labels) {
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    const max = Math.max(...data) * 1.2;
    const step = chartW / (data.length - 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
    }

    // Points
    const points = data.map((val, i) => ({
      x: pad.left + i * step,
      y: pad.top + chartH - (val / max) * chartH,
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(99,102,241,0.3)');
    grad.addColorStop(1, 'rgba(99,102,241,0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpX = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpX, points[i - 1].y, cpX, points[i].y, points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
    ctx.lineTo(points[0].x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    const lineGrad = ctx.createLinearGradient(pad.left, 0, pad.left + chartW, 0);
    lineGrad.addColorStop(0, '#6366f1');
    lineGrad.addColorStop(1, '#06b6d4');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpX = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpX, points[i - 1].y, cpX, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Labels
    if (labels && labels.length <= data.length) {
      ctx.fillStyle = 'rgba(148,163,184,0.8)';
      ctx.font = '11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      const labelStep = chartW / (labels.length - 1);
      labels.forEach((label, i) => {
        const x = pad.left + i * labelStep;
        ctx.fillText(label, x, H - 8);
      });
    }
  }

  drawChart(currentData, currentLabels);

  // Period buttons
  document.querySelectorAll('.cpt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cpt').forEach(b => b.classList.remove('cpt--active'));
      btn.classList.add('cpt--active');

      const period = btn.dataset.period;
      if (period === '7d') {
        drawChart(data7d, labels7d);
      } else if (period === '30d') {
        const l30 = Array.from({ length: 8 }, (_, i) => `W${i + 1}`).slice(0, data30d.length);
        drawChart(data30d, ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Feb 1']);
      } else {
        drawChart(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 70 + 30)),
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        );
      }
    });
  });

  // Redraw on resize
  window.addEventListener('resize', () => {
    const newRect = canvas.getBoundingClientRect();
    canvas.width = newRect.width * dpr;
    canvas.height = newRect.height * dpr;
    ctx.scale(dpr, dpr);
    drawChart(currentData, currentLabels);
  });
}

// =============================================
// Scheduled Posts
// =============================================
function initScheduledPosts() {
  const container = document.getElementById('scheduledPostsList');
  if (!container) return;

  const posts = [
    { time: '2:00 PM', text: '🚀 Excited to announce our biggest product launch yet! Stay tuned for the reveal at 3 PM EST.', platforms: ['instagram', 'twitter', 'facebook'] },
    { time: '4:30 PM', text: 'How we grew our engagement by 300% in 90 days — full case study in the link below 🔗', platforms: ['linkedin'] },
    { time: '6:00 PM', text: '✨ Behind the scenes of our latest campaign shoot. Swipe to see the magic!', platforms: ['instagram', 'tiktok'] },
    { time: '8:00 PM', text: 'What does success look like to you? Drop your thoughts below 👇', platforms: ['twitter', 'facebook'] },
  ];

  posts.forEach(post => {
    const el = document.createElement('div');
    el.className = 'scheduled-post';
    el.innerHTML = `
      <div class="scheduled-post__time">${post.time}</div>
      <div class="scheduled-post__content">
        <div class="scheduled-post__text">${post.text}</div>
        <div class="scheduled-post__platforms">
          ${post.platforms.map(p => {
            const platform = PLATFORMS.find(pl => pl.id === p);
            return `<div class="sp-icon" style="background:${platform ? platform.bg : '#333'};color:white">${PLATFORM_ICONS[p] || ''}</div>`;
          }).join('')}
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

// =============================================
// Activity Feed
// =============================================
function initActivityFeed() {
  const container = document.getElementById('activityFeed');
  if (!container) return;

  const activities = [
    { type: 'like', icon: '❤️', text: '<strong>@fashion_lover</strong> liked your Instagram post — "Summer Collection 2025"', time: '2 min ago', iconClass: 'like' },
    { type: 'follow', icon: '👤', text: '<strong>@techstartup_hq</strong> started following your LinkedIn page', time: '8 min ago', iconClass: 'follow' },
    { type: 'comment', icon: '💬', text: '<strong>@marketing_pro</strong> commented on your X post: "This is exactly what we needed!"', time: '15 min ago', iconClass: 'comment' },
    { type: 'share', icon: '🔁', text: 'Your TikTok video was shared 247 times in the last hour', time: '1 hour ago', iconClass: 'share' },
    { type: 'like', icon: '❤️', text: 'Your Facebook post reached <strong>10,000</strong> impressions', time: '2 hours ago', iconClass: 'like' },
    { type: 'comment', icon: '💬', text: '<strong>@growthdesign</strong> replied to your Instagram story', time: '3 hours ago', iconClass: 'comment' },
  ];

  const iconSVGs = {
    like: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    follow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
    comment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  };

  activities.forEach((act, i) => {
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.style.animationDelay = `${i * 80}ms`;
    el.innerHTML = `
      <div class="activity-icon activity-icon--${act.iconClass}">${iconSVGs[act.iconClass]}</div>
      <div class="activity-content">
        <div class="activity-text">${act.text}</div>
        <span class="activity-time">${act.time}</span>
      </div>
    `;
    container.appendChild(el);
  });
}

// =============================================
// New Post Modal
// =============================================
function initNewPostModal() {
  const openBtn = document.getElementById('newPostBtn');
  const modal = document.getElementById('newPostModal');
  const closeBtn = document.getElementById('closeNewPostModal');
  const saveBtn = document.getElementById('saveDraftBtn');
  const publishBtn = document.getElementById('publishPostBtn');
  const textarea = document.getElementById('postContent');
  const charCount = document.getElementById('charCount');
  const scheduleToggle = document.getElementById('scheduleToggle');
  const scheduleDatetime = document.getElementById('scheduleDatetime');

  if (!openBtn || !modal) return;

  // Populate platform toggles
  const togglesContainer = document.getElementById('platformToggles');
  if (togglesContainer) {
    PLATFORMS.forEach(platform => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'platform-toggle';
      btn.dataset.platform = platform.id;
      btn.innerHTML = `${PLATFORM_ICONS[platform.id] || ''}<span>${platform.name}</span>`;
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        if (btn.classList.contains('active')) {
          btn.style.background = platform.bg;
          btn.style.borderColor = 'transparent';
        } else {
          btn.style.background = '';
          btn.style.borderColor = '';
        }
      });
      togglesContainer.appendChild(btn);
    });
  }

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Char count
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 2000 ? 'var(--color-error)' : '';
    });
  }

  // Schedule toggle
  if (scheduleToggle && scheduleDatetime) {
    scheduleToggle.addEventListener('change', () => {
      scheduleDatetime.style.display = scheduleToggle.checked ? 'flex' : 'none';
    });
  }

  // Save / Publish
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      showToast('Draft saved!', 'success');
      closeModal();
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', async () => {
      const content = textarea ? textarea.value.trim() : '';
      if (!content) {
        showToast('Please write something first', 'error');
        return;
      }

      publishBtn.disabled = true;
      publishBtn.innerHTML = `<svg class="spin-anim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Publishing...`;

      await new Promise(r => setTimeout(r, 2000));
      closeModal();
      showToast('Post published successfully!', 'success');
      publishBtn.disabled = false;
      publishBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Publish Now`;
    });
  }
}

// =============================================
// Toast Notifications
// =============================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    info: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#6366f1' },
  };

  const c = colors[type] || colors.info;
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: var(--color-surface);
    border: 1px solid ${c.border};
    border-left: 3px solid ${c.text};
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    pointer-events: all;
    animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    max-width: 340px;
    font-family: 'Outfit', sans-serif;
  `;
  toast.textContent = message;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
    @keyframes toastOut { to { opacity:0; transform:translateX(60px); } }
    .spin-anim { animation: spin 0.8s linear infinite; }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  `;
  if (!document.getElementById('toastStyles')) {
    style.id = 'toastStyles';
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initEngagementChart();
  initScheduledPosts();
  initActivityFeed();
  initNewPostModal();
});
