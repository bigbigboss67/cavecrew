/* =============================================
   @social — Scheduler / Calendar JavaScript
   scheduler.js
   ============================================= */

'use strict';

// ── Platform config ───────────────────────────
const PLATFORMS = {
  instagram: { label: 'Instagram', color: '#e4405f',  charLimit: 2200 },
  twitter:   { label: 'X/Twitter', color: '#1da1f2',  charLimit: 280  },
  facebook:  { label: 'Facebook',  color: '#1877f2',  charLimit: 63206},
  linkedin:  { label: 'LinkedIn',  color: '#0077b5',  charLimit: 3000 },
  tiktok:    { label: 'TikTok',    color: '#333333',  charLimit: 2200 },
  youtube:   { label: 'YouTube',   color: '#ff0000',  charLimit: 5000 },
  pinterest: { label: 'Pinterest', color: '#e60023',  charLimit: 500  },
  threads:   { label: 'Threads',   color: '#aaaaaa',  charLimit: 500  },
};

// AI sample content for each tone
const AI_TEMPLATES = {
  professional: [
    "We're excited to share {topic} with our community. This represents a significant step forward in delivering value to our clients. 🚀",
    "Introducing {topic} — designed to empower teams and drive measurable results. Learn more about how this can transform your workflow.",
    "At @social, we believe {topic} is key to success in today's dynamic market. Here's what you need to know. 📊",
  ],
  casual: [
    "Hey everyone! 👋 We just dropped {topic} and honestly? It's pretty amazing. Go check it out!",
    "Okay, we have to talk about {topic} because we are OBSESSED 🔥 Drop a ❤️ if you want to know more!",
    "Plot twist: {topic} is here and it's everything we promised and more. Who's excited?! 🙌",
  ],
  inspirational: [
    "Every great journey begins with a single step. Today, {topic} is that step for us. Dream big. 💫",
    "Success isn't given — it's built. {topic} is proof that when you stay committed, incredible things happen. ✨",
    "The future belongs to those who believe in the beauty of their dreams. {topic} is our dream, made real. 🌟",
  ],
  promotional: [
    "🎉 LIMITED TIME: {topic}! Don't miss out — this offer won't last. Tap the link to claim yours now!",
    "🔥 SALE ALERT: {topic} is here! Up to 40% off — grab yours before it's gone. Shop now! 🛒",
    "✨ Exclusive deal: {topic}! Our community gets first access. Use code SOCIAL20 for an extra 20% off!",
  ],
  educational: [
    "Did you know? {topic} can increase your productivity by up to 3x. Here's the science behind it: 🧵",
    "🎓 Quick guide to {topic}: 1️⃣ Start small 2️⃣ Build consistency 3️⃣ Track your progress 4️⃣ Scale up. Save this!",
    "Top 5 things you need to know about {topic}: Thread below 👇 (You'll want to bookmark this one)",
  ],
};

// Best times per day of week
const BEST_TIMES = {
  0: '7:00 PM', 1: '8:00 AM', 2: '9:00 AM',
  3: '12:00 PM', 4: '9:00 AM', 5: '11:00 AM', 6: '3:00 PM'
};

// ── State ─────────────────────────────────────
let currentDate = new Date();
let currentView = 'month';
let selectedDate = null;
let selectedPlatforms = [];
let platformFilter = 'all';
let editingPostId = null;
let pendingPanelOpen = true;

// ── DOM refs ──────────────────────────────────
const calendarBody     = document.getElementById('calendarBody');
const calTitle         = document.getElementById('calTitle');
const platformSelector = document.getElementById('platformSelector');
const postContent      = document.getElementById('postContent');
const charCounter      = document.getElementById('charCounter');
const scheduleToggle   = document.getElementById('scheduleToggle');
const datetimeWrap     = document.getElementById('datetimeWrap');
const scheduledAt      = document.getElementById('scheduledAt');
const publishBtn       = document.getElementById('publishBtn');
const publishBtnText   = document.getElementById('publishBtnText');
const saveDraftBtn     = document.getElementById('saveDraftBtn');
const pendingPanel     = document.getElementById('pendingPanel');
const pendingList      = document.getElementById('pendingList');
const pendingCount     = document.getElementById('pendingCount');
const pendingNavBadge  = document.getElementById('pendingNavBadge');
const composerTitle    = document.getElementById('composerTitle');

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Wait for requireAuth to store the resolved user in window._resolvedUser
  const checkReady = setInterval(() => {
    if (window._resolvedUser) {
      clearInterval(checkReady);
      initScheduler();
    }
  }, 50);
  // Hard fallback after 3 seconds (guest/session user case)
  setTimeout(() => { clearInterval(checkReady); if (typeof initScheduler === 'function') initScheduler(); }, 3000);
});

function initScheduler() {
  renderCalendar();
  initComposer();
  initPlatformFilter();
  initPendingPanel();
  updateStats();
  updatePublishButton();
  seedDemoData();
}

// ── Seed some demo posts ──────────────────────
function seedDemoData() {
  const posts = getAllPosts();
  if (posts.length > 0) return; // Already has data

  const now = new Date();
  const demos = [
    { content: "🚀 Excited to launch our new product line! Check it out now — link in bio. #launch #newproduct", platforms: ['instagram','twitter'], daysFromNow: 1, hour: 9, status: 'scheduled' },
    { content: "📊 Our Q2 results are in and they look incredible. Thank you to our amazing community for all the support!", platforms: ['linkedin','facebook'], daysFromNow: 2, hour: 14, status: 'scheduled' },
    { content: "🎉 Flash sale this weekend only! 30% off everything. Don't miss it!", platforms: ['instagram','twitter','facebook'], daysFromNow: 3, hour: 10, status: 'scheduled' },
    { content: "Behind the scenes: here's how we build our content strategy every week 👀", platforms: ['tiktok'], daysFromNow: 0, hour: 18, status: 'pending_approval' },
    { content: "New blog post: 10 tips to grow your social media following in 2026", platforms: ['linkedin'], daysFromNow: -1, hour: 8, status: 'published' },
    { content: "Happy Friday! 🎊 What are your weekend plans?", platforms: ['instagram','threads'], daysFromNow: 4, hour: 17, status: 'draft' },
  ];

  demos.forEach(d => {
    const date = new Date(now);
    date.setDate(date.getDate() + d.daysFromNow);
    date.setHours(d.hour, 0, 0, 0);
    const post = {
      id: 'post_demo_' + Math.random().toString(36).substr(2, 8),
      content: d.content,
      platforms: d.platforms,
      scheduledAt: date.toISOString(),
      status: d.status,
      createdBy: 'bigbigboss67@gmail.com',
      createdByName: 'Admin',
      createdAt: new Date().toISOString(),
      approved: d.status !== 'pending_approval',
    };
    const posts = getAllPosts();
    posts.push(post);
    savePosts(posts);
  });
}

// ── Calendar Rendering ────────────────────────
function renderCalendar() {
  updateTitle();
  if (currentView === 'month') renderMonthView();
  else if (currentView === 'week') renderWeekView();
  else renderListView();
}

function updateTitle() {
  if (currentView === 'month') {
    calTitle.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  } else if (currentView === 'week') {
    const start = getWeekStart(currentDate);
    const end   = new Date(start); end.setDate(end.getDate() + 6);
    calTitle.textContent = `${fmt(start, 'MMM D')} – ${fmt(end, 'MMM D, YYYY')}`;
  } else {
    calTitle.textContent = 'Upcoming Posts';
  }
}

// Month View
function renderMonthView() {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
  const today = new Date();

  const posts = getVisiblePosts().filter(p => {
    if (platformFilter === 'all') return true;
    return p.platforms.includes(platformFilter);
  });

  let html = `<div class="month-view">
    <div class="month-header">
      ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<div class="month-header-day">${d}</div>`).join('')}
    </div>
    <div class="month-grid">`;

  // Fill cells
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDow + 1;
    const date = new Date(year, month, dayNum);
    const isCurrentMonth = dayNum >= 1 && dayNum <= lastDay.getDate();
    const isToday = isSameDay(date, today);
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    const dayPosts = posts.filter(p => {
      if (!p.scheduledAt) return false;
      return isSameDay(new Date(p.scheduledAt), date);
    });

    const classes = ['month-cell',
      isCurrentMonth ? '' : 'other-month',
      isToday ? 'today' : '',
      isSelected ? 'selected' : ''
    ].filter(Boolean).join(' ');

    html += `<div class="${classes}" data-date="${date.toISOString()}" onclick="handleDayClick('${date.toISOString()}')">
      <div class="day-num">${date.getDate()}</div>
      <div class="day-posts">`;

    const maxShow = 3;
    dayPosts.slice(0, maxShow).forEach(post => {
      const platClass = post.platforms.length > 1 ? 'multi' : (post.platforms[0] || 'multi');
      const time = post.scheduledAt ? new Date(post.scheduledAt).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false}) : '';
      html += `<div class="post-pill ${platClass} status-${post.status}" onclick="event.stopPropagation();openPostModal('${post.id}')" title="${escHtml(post.content)}">
        ${time} ${escHtml(post.content.substring(0, 20))}...
      </div>`;
    });

    if (dayPosts.length > maxShow) {
      html += `<div class="more-posts">+${dayPosts.length - maxShow} more</div>`;
    }

    html += `</div></div>`;
  }

  html += `</div></div>`;
  calendarBody.innerHTML = html;
}

// Week View
function renderWeekView() {
  const weekStart = getWeekStart(currentDate);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const today = new Date();
  const posts = getVisiblePosts().filter(p => {
    if (!p.scheduledAt) return false;
    const pd = new Date(p.scheduledAt);
    return pd >= weekStart && pd < new Date(weekStart.getTime() + 7*86400000);
  });

  let html = `<div class="week-view">
    <div class="week-header">
      <div class="week-header-time"></div>
      ${days.map(d => `
        <div class="week-header-day ${isSameDay(d,today)?'today':''}">
          <div class="wh-name">${d.toLocaleString('default',{weekday:'short'})}</div>
          <div class="wh-num">${d.getDate()}</div>
        </div>`).join('')}
    </div>
    <div class="week-body">
      <div class="week-time-col">
        ${Array.from({length:24},(_,h)=>`<div class="week-hour-label">${h===0?'12am':h<12?h+'am':h===12?'12pm':(h-12)+'pm'}</div>`).join('')}
      </div>
      ${days.map((d,di) => {
        const dayPosts = posts.filter(p => isSameDay(new Date(p.scheduledAt), d));
        return `<div class="week-day-col ${isSameDay(d,today)?'today':''}" data-date="${d.toISOString()}" onclick="handleDayClick('${d.toISOString()}')">
          ${Array.from({length:24},(_,h) => `<div class="week-hour-slot" onclick="event.stopPropagation();handleHourClick('${d.toISOString()}',${h})"></div>`).join('')}
          ${dayPosts.map(post => {
            const postDate = new Date(post.scheduledAt);
            const hour = postDate.getHours();
            const min  = postDate.getMinutes();
            const top  = (hour * 60 + min) / 60 * 60;
            const platClass = post.platforms.length > 1 ? 'multi' : (post.platforms[0] || 'multi');
            const bg = post.platforms.length > 1
              ? 'linear-gradient(135deg,#6366f1,#06b6d4)'
              : (PLATFORMS[post.platforms[0]]?.color || '#6366f1');
            return `<div class="week-post-block" style="top:${top}px;background:${bg}" onclick="event.stopPropagation();openPostModal('${post.id}')">${postDate.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false})} ${escHtml(post.content.substring(0,20))}</div>`;
          }).join('')}
        </div>`;
      }).join('')}
    </div>
  </div>`;

  calendarBody.innerHTML = html;
}

// List View
function renderListView() {
  const posts = getVisiblePosts()
    .filter(p => p.scheduledAt)
    .filter(p => platformFilter === 'all' || p.platforms.includes(platformFilter))
    .sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  if (posts.length === 0) {
    calendarBody.innerHTML = `<div class="list-view" style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-muted)">No posts scheduled yet. Create your first post! 📅</div>`;
    return;
  }

  // Group by date
  const groups = {};
  posts.forEach(post => {
    const d = new Date(post.scheduledAt);
    const key = d.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  });

  let html = '<div class="list-view">';
  Object.entries(groups).forEach(([dateStr, dayPosts]) => {
    const date = new Date(dateStr);
    const today = new Date();
    const label = isSameDay(date, today) ? 'Today' : isSameDay(date, new Date(today.getTime()+86400000)) ? 'Tomorrow' : fmt(date, 'dddd, MMM D');

    html += `<div class="list-date-group">
      <div class="list-date-header">${label}</div>`;

    dayPosts.forEach(post => {
      const time = new Date(post.scheduledAt).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'});
      const isAdmin = getCurrentRole() === 'admin';
      html += `<div class="list-post-item" onclick="openPostModal('${post.id}')">
        <div class="list-post-time">${time}</div>
        <div class="list-post-content">
          <div class="list-post-text">${escHtml(post.content)}</div>
          <div class="list-post-meta">
            ${post.platforms.map(p => `<span class="list-post-platform ${p}">${PLATFORMS[p]?.label||p}</span>`).join('')}
            <span class="list-post-status ${post.status}">${statusLabel(post.status)}</span>
          </div>
        </div>
        <div class="list-post-actions" onclick="event.stopPropagation()">
          <button class="list-action-btn" onclick="editPost('${post.id}')">Edit</button>
          ${isAdmin && post.status==='pending_approval' ? `
            <button class="list-action-btn approve" onclick="approvePost('${post.id}')">✓ Approve</button>
            <button class="list-action-btn reject"  onclick="rejectPost('${post.id}')">✗ Reject</button>
          ` : ''}
          <button class="list-action-btn" style="color:#ef4444" onclick="confirmDeletePost('${post.id}')">Delete</button>
        </div>
      </div>`;
    });

    html += `</div>`;
  });

  html += '</div>';
  calendarBody.innerHTML = html;
}

// ── Calendar Navigation ───────────────────────
document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentView === 'month') currentDate.setMonth(currentDate.getMonth() - 1);
  else if (currentView === 'week') currentDate.setDate(currentDate.getDate() - 7);
  renderCalendar();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentView === 'month') currentDate.setMonth(currentDate.getMonth() + 1);
  else if (currentView === 'week') currentDate.setDate(currentDate.getDate() + 7);
  renderCalendar();
});

document.getElementById('todayBtn').addEventListener('click', () => {
  currentDate = new Date();
  renderCalendar();
});

document.querySelectorAll('.cal-view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cal-view-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentView = tab.dataset.view;
    renderCalendar();
  });
});

document.getElementById('calAddBtn').addEventListener('click', () => {
  clearComposer();
  selectedDate = new Date();
  updateDatetimeInput(selectedDate);
});

// ── Day / Hour Click ──────────────────────────
function handleDayClick(dateISO) {
  selectedDate = new Date(dateISO);
  clearComposer(false);
  if (!scheduleToggle.checked) scheduleToggle.click();
  updateDatetimeInput(selectedDate);
  composerTitle.textContent = 'New Post — ' + fmt(selectedDate, 'MMM D');
  renderCalendar(); // Re-render to show selection
}

function handleHourClick(dateISO, hour) {
  const date = new Date(dateISO);
  date.setHours(hour, 0, 0, 0);
  handleDayClick(date.toISOString());
}

function updateDatetimeInput(date) {
  // Format for datetime-local input
  const pad = n => String(n).padStart(2,'0');
  const s = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  scheduledAt.value = s;

  // Update best time hint
  const dayOfWeek = date.getDay();
  const bestTime = BEST_TIMES[dayOfWeek];
  document.getElementById('bestTimeText').textContent = `${fmt(date,'MMM D')} ${bestTime}`;
}

document.getElementById('useBestTimeBtn').addEventListener('click', () => {
  const ref = selectedDate || new Date();
  const dayOfWeek = ref.getDay();
  const bestTime = BEST_TIMES[dayOfWeek];
  const [time, ampm] = bestTime.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const d = new Date(ref);
  d.setHours(h, m || 0, 0, 0);
  updateDatetimeInput(d);
});

// ── Composer Init ─────────────────────────────
function initComposer() {
  // Platform buttons
  platformSelector.querySelectorAll('.plat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const isSelected = selectedPlatforms.includes(platform);
      const role = getCurrentRole();
      const maxPlats = role === 'admin' ? Infinity : 3;

      if (!isSelected && selectedPlatforms.length >= maxPlats) {
        document.getElementById('platformLimitWarning').style.display = 'block';
        setTimeout(() => { document.getElementById('platformLimitWarning').style.display = 'none'; }, 3000);
        return;
      }

      if (isSelected) {
        selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
        btn.classList.remove('selected');
      } else {
        selectedPlatforms.push(platform);
        btn.classList.add('selected');
      }
      updateCharCounter();
    });
  });

  // Content textarea
  postContent.addEventListener('input', updateCharCounter);

  // Schedule toggle
  scheduleToggle.addEventListener('change', () => {
    datetimeWrap.classList.toggle('visible', scheduleToggle.checked);
    if (scheduleToggle.checked && !scheduledAt.value) {
      updateDatetimeInput(selectedDate || new Date());
    }
  });

  // AI Write
  document.getElementById('aiWriteBtn').addEventListener('click', toggleAIPanel);
  document.getElementById('aiGenerateBtn').addEventListener('click', generateAIContent);

  // Media buttons
  document.getElementById('imgBtn').addEventListener('click', () => showToast('Image upload coming soon!','info'));
  document.getElementById('videoBtn').addEventListener('click', () => showToast('Video upload coming soon!','info'));
  document.getElementById('emojiBtn').addEventListener('click', () => insertEmoji());

  // Save Draft
  saveDraftBtn.addEventListener('click', () => savePost('draft'));

  // Publish / Submit
  publishBtn.addEventListener('click', () => {
    const role = getCurrentRole();
    if (role === 'admin') savePost('scheduled');
    else savePost('pending_approval');
  });

  updatePublishButton();
}

function updatePublishButton() {
  const role = getCurrentRole();
  if (!role) return;
  if (role === 'admin') {
    publishBtnText.textContent = scheduleToggle?.checked ? 'Schedule Post' : 'Publish Now';
    publishBtn.classList.remove('review');
    document.getElementById('pendingNotice').style.display = 'none';
  } else {
    publishBtnText.textContent = 'Submit for Review';
    publishBtn.classList.add('review');
    document.getElementById('pendingNotice').style.display = 'block';
  }

  // AI limit for users
  const aiUsed = getAIWriteUsedToday();
  const aiCountEl = document.getElementById('aiUsedCount');
  if (aiCountEl) aiCountEl.textContent = aiUsed;
  const aiLimitBadge = document.getElementById('aiLimitBadge');
  if (aiLimitBadge) {
    aiLimitBadge.style.display = role === 'user' ? 'flex' : 'none';
  }
}

scheduleToggle && scheduleToggle.addEventListener('change', updatePublishButton);

function getAIWriteUsedToday() {
  const today = new Date().toDateString();
  return parseInt(localStorage.getItem('ai_write_' + today) || '0');
}

function updateCharCounter() {
  const len = postContent.value.length;
  const limit = selectedPlatforms.length > 0
    ? Math.min(...selectedPlatforms.map(p => PLATFORMS[p]?.charLimit || 280))
    : 280;

  charCounter.textContent = `${len} / ${limit.toLocaleString()}`;
  charCounter.className = 'char-counter' + (len > limit * 0.9 ? (len > limit ? ' danger' : ' warning') : '');
}

function clearComposer(resetDate = true) {
  postContent.value = '';
  selectedPlatforms = [];
  editingPostId = null;
  platformSelector.querySelectorAll('.plat-btn').forEach(b => b.classList.remove('selected'));
  if (resetDate) {
    scheduleToggle.checked = false;
    datetimeWrap.classList.remove('visible');
    scheduledAt.value = '';
    selectedDate = null;
  }
  composerTitle.textContent = 'New Post';
  document.getElementById('editPostId').style.display = 'none';
  updateCharCounter();
}

// ── AI Write ──────────────────────────────────
function toggleAIPanel() {
  const panel = document.getElementById('aiWritePanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function generateAIContent() {
  if (!checkAIWriteLimit()) {
    document.getElementById('aiLimitMsg').style.display = 'block';
    return;
  }

  const topic = document.getElementById('aiTopicInput').value.trim() || 'our latest update';
  const tone  = document.getElementById('aiToneSelect').value;
  const templates = AI_TEMPLATES[tone] || AI_TEMPLATES.professional;
  const template = templates[Math.floor(Math.random() * templates.length)];
  const content = template.replace('{topic}', topic);

  postContent.value = content;
  updateCharCounter();

  // Update counter
  const today = new Date().toDateString();
  const key = 'ai_write_' + today;
  localStorage.setItem(key, (parseInt(localStorage.getItem(key) || '0') + 1));
  updatePublishButton();

  document.getElementById('aiWritePanel').style.display = 'none';
  showToast('✨ AI content generated!', 'success');
}

function insertEmoji() {
  const emojis = ['🚀','🎉','🔥','✨','💡','📊','🎯','🌟','💪','🙌','❤️','👏'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const pos = postContent.selectionStart;
  const text = postContent.value;
  postContent.value = text.slice(0, pos) + emoji + text.slice(pos);
  postContent.selectionStart = postContent.selectionEnd = pos + emoji.length;
  postContent.focus();
  updateCharCounter();
}

// ── Save Post ─────────────────────────────────
function savePost(status) {
  if (selectedPlatforms.length === 0) {
    showToast('Please select at least one platform', 'error');
    return;
  }
  if (!postContent.value.trim()) {
    showToast('Please write some content first', 'error');
    return;
  }

  const scheduled = scheduleToggle.checked && scheduledAt.value
    ? new Date(scheduledAt.value).toISOString()
    : null;

  if (status !== 'draft' && scheduleToggle.checked && !scheduled) {
    showToast('Please set a date and time', 'error');
    return;
  }

  if (status === 'scheduled' && !scheduled) {
    // Publish now = immediate
    status = 'published';
  }

  if (editingPostId) {
    updatePost(editingPostId, {
      content: postContent.value,
      platforms: selectedPlatforms,
      scheduledAt: scheduled,
      status,
    });
    showToast('✅ Post updated!', 'success');
  } else {
    createPost({
      content: postContent.value,
      platforms: selectedPlatforms,
      scheduledAt: scheduled || new Date().toISOString(),
      status,
    });
    const msgs = {
      draft: '📝 Saved as draft',
      scheduled: '🗓️ Post scheduled!',
      pending_approval: '⏳ Submitted for review',
      published: '🚀 Post published!',
    };
    showToast(msgs[status] || 'Saved!', 'success');
  }

  clearComposer();
  renderCalendar();
  updateStats();
  renderPendingList();
}

// ── Post Modal ────────────────────────────────
function openPostModal(postId) {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const overlay = document.getElementById('postModalOverlay');
  const title   = document.getElementById('postModalTitle');
  const body    = document.getElementById('postModalBody');
  const isAdm   = isAdmin();

  title.textContent = 'Post Details';

  const scheduledStr = post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleString('en',{weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})
    : 'Not scheduled';

  body.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        ${post.platforms.map(p => `<span class="list-post-platform ${p}" style="padding:3px 10px;border-radius:20px;color:white;font-size:12px;font-weight:700">${PLATFORMS[p]?.label||p}</span>`).join('')}
        <span class="list-post-status ${post.status}" style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700">${statusLabel(post.status)}</span>
      </div>
      <div style="background:var(--color-surface-2);border-radius:10px;padding:14px;font-size:14px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">${escHtml(post.content)}</div>
      <div style="font-size:12px;color:var(--text-muted)">
        📅 <strong>${scheduledStr}</strong> &nbsp;·&nbsp;
        👤 ${post.createdByName || post.createdBy}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button onclick="editPost('${post.id}');closePostModal()" style="padding:8px 16px;border-radius:8px;background:var(--color-surface-2);border:1px solid var(--color-border);color:var(--text-secondary);font-family:inherit;font-size:13px;cursor:pointer;font-weight:600">✏️ Edit</button>
      ${isAdm && post.status==='pending_approval' ? `
        <button onclick="approvePost('${post.id}');closePostModal()" style="padding:8px 16px;border-radius:8px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;font-family:inherit;font-size:13px;cursor:pointer;font-weight:600">✓ Approve</button>
        <button onclick="rejectPost('${post.id}');closePostModal()"  style="padding:8px 16px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#ef4444;font-family:inherit;font-size:13px;cursor:pointer;font-weight:600">✗ Reject</button>
      ` : ''}
      <button onclick="confirmDeletePost('${post.id}');closePostModal()" style="padding:8px 16px;border-radius:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);color:#ef4444;font-family:inherit;font-size:13px;cursor:pointer;font-weight:600">🗑️ Delete</button>
    </div>
  `;

  overlay.style.display = 'flex';
}

function closePostModal() {
  document.getElementById('postModalOverlay').style.display = 'none';
}

document.getElementById('postModalClose').addEventListener('click', closePostModal);
document.getElementById('postModalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePostModal(); });

// ── Edit Post ─────────────────────────────────
function editPost(postId) {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  editingPostId = postId;
  postContent.value = post.content;
  selectedPlatforms = [...post.platforms];

  platformSelector.querySelectorAll('.plat-btn').forEach(btn => {
    btn.classList.toggle('selected', selectedPlatforms.includes(btn.dataset.platform));
  });

  if (post.scheduledAt) {
    scheduleToggle.checked = true;
    datetimeWrap.classList.add('visible');
    const d = new Date(post.scheduledAt);
    updateDatetimeInput(d);
  }

  composerTitle.textContent = 'Edit Post';
  document.getElementById('editPostId').style.display = 'block';
  document.getElementById('editPostId').textContent = 'Editing #' + postId.slice(-6);
  updateCharCounter();
}

// ── Approve / Reject ──────────────────────────
function approvePost(postId) {
  updatePost(postId, { status: 'scheduled', approved: true });
  showToast('✅ Post approved and scheduled!', 'success');
  renderCalendar();
  updateStats();
  renderPendingList();
}

function rejectPost(postId) {
  updatePost(postId, { status: 'rejected' });
  showToast('Post rejected.', 'info');
  renderCalendar();
  updateStats();
  renderPendingList();
}

// ── Delete ────────────────────────────────────
function confirmDeletePost(postId) {
  const post = getAllPosts().find(p => p.id === postId);
  if (!post) return;
  const user = getCurrentUser();
  if (!isAdmin() && post.createdBy !== user?.email) {
    showToast('You can only delete your own posts', 'error');
    return;
  }
  if (confirm('Delete this post? This cannot be undone.')) {
    deletePost(postId);
    showToast('Post deleted', 'info');
    renderCalendar();
    updateStats();
    renderPendingList();
  }
}

// ── Platform Filter ───────────────────────────
function initPlatformFilter() {
  document.querySelectorAll('.pf-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.pf-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      platformFilter = chip.dataset.platform;
      renderCalendar();
    });
  });
}

// ── Stats ─────────────────────────────────────
function updateStats() {
  const posts = getVisiblePosts();
  document.getElementById('statScheduled').textContent  = posts.filter(p => p.status === 'scheduled').length;
  document.getElementById('statPublished').textContent  = posts.filter(p => p.status === 'published').length;
  document.getElementById('statPending').textContent    = posts.filter(p => p.status === 'pending_approval').length;
  document.getElementById('statDrafts').textContent     = posts.filter(p => p.status === 'draft').length;

  const pendingNum = getAllPosts().filter(p => p.status === 'pending_approval').length;
  if (pendingNavBadge) {
    pendingNavBadge.textContent = pendingNum;
    pendingNavBadge.style.display = pendingNum > 0 ? 'inline-flex' : 'none';
  }
}

// ── Pending Panel (Admin) ─────────────────────
function initPendingPanel() {
  if (!isAdmin() || !pendingPanel) return;
  pendingPanel.style.display = 'flex';
  renderPendingList();

  document.getElementById('pendingPanelHeader').addEventListener('click', () => {
    pendingPanelOpen = !pendingPanelOpen;
    pendingList.style.display = pendingPanelOpen ? '' : 'none';
    document.getElementById('pendingToggleIcon').textContent = pendingPanelOpen ? '▲' : '▼';
  });
}

function renderPendingList() {
  if (!isAdmin() || !pendingList) return;
  const pending = getAllPosts().filter(p => p.status === 'pending_approval');
  pendingCount.textContent = pending.length;

  if (pending.length === 0) {
    pendingList.innerHTML = `<div style="padding:12px;font-size:12px;color:var(--text-muted);text-align:center">No pending posts ✅</div>`;
    return;
  }

  pendingList.innerHTML = pending.map(post => `
    <div class="pending-item">
      <div class="pending-item-info">
        <div class="pending-item-user">👤 ${post.createdByName || post.createdBy}</div>
        <div class="pending-item-text">${escHtml(post.content)}</div>
        <div class="pending-item-plats">
          ${post.platforms.map(p => `<span class="pending-item-plat" style="background:${PLATFORMS[p]?.color||'#666'}">${PLATFORMS[p]?.label||p}</span>`).join('')}
        </div>
      </div>
      <div class="pending-actions">
        <button class="pending-approve" onclick="approvePost('${post.id}')">✓ OK</button>
        <button class="pending-reject"  onclick="rejectPost('${post.id}')">✗</button>
      </div>
    </div>
  `).join('');
}

// ── Toast ─────────────────────────────────────
function showToast(message, type = 'info') {
  if (typeof showAuthToast === 'function') { showAuthToast(message, type); return; }
  let c = document.getElementById('toastContainer2');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer2';
    c.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(c);
  }
  const colors = {success:'#10b981',error:'#ef4444',info:'#6366f1'};
  const t = document.createElement('div');
  t.style.cssText = `background:var(--color-surface);border:1px solid ${colors[type]||colors.info}33;border-left:3px solid ${colors[type]||colors.info};border-radius:10px;padding:12px 18px;font-size:14px;color:var(--text-primary);box-shadow:0 8px 32px rgba(0,0,0,0.4);max-width:340px;font-family:'Outfit',sans-serif;pointer-events:all;animation:toastIn .3s ease`;
  t.innerHTML = message;
  if (!document.getElementById('toastStyle2')) {
    const s = document.createElement('style');
    s.id = 'toastStyle2';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}@keyframes toastOut{to{opacity:0;transform:translateX(60px)}}';
    document.head.appendChild(s);
  }
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => t.remove(), 350); }, 3500);
}

// ── Helpers ───────────────────────────────────
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0,0,0,0);
  return d;
}

function fmt(date, format) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return format
    .replace('YYYY', date.getFullYear())
    .replace('MMM', months[date.getMonth()])
    .replace('MM', String(date.getMonth()+1).padStart(2,'0'))
    .replace('dddd', days[date.getDay()])
    .replace('D', date.getDate());
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function statusLabel(status) {
  const labels = {
    scheduled: 'Scheduled', published: 'Published',
    draft: 'Draft', pending_approval: 'Pending Review', rejected: 'Rejected',
  };
  return labels[status] || status;
}
