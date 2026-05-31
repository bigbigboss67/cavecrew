/* =============================================
   @social — Role & Permission System
   roles.js
   ============================================= */

'use strict';

// ── Admin definition ──────────────────────────
const ADMIN_EMAIL = 'bigbigboss67@gmail.com';

// ── Permission catalogue ──────────────────────
const PERMISSIONS = {
  // Publishing
  PUBLISH_DIRECT:        'publish_direct',        // Publish without approval
  SUBMIT_FOR_REVIEW:     'submit_for_review',      // Submit posts for approval
  APPROVE_POSTS:         'approve_posts',           // Approve/reject pending posts
  DELETE_ANY_POST:       'delete_any_post',
  DELETE_OWN_POST:       'delete_own_post',

  // Accounts
  CONNECT_ACCOUNTS:      'connect_accounts',
  DISCONNECT_ACCOUNTS:   'disconnect_accounts',

  // Calendar / Scheduler
  VIEW_ALL_POSTS:        'view_all_posts',         // See every user's posts
  VIEW_OWN_POSTS:        'view_own_posts',
  SCHEDULE_POSTS:        'schedule_posts',
  EDIT_ANY_POST:         'edit_any_post',
  EDIT_OWN_POST:         'edit_own_post',

  // Analytics
  VIEW_ANALYTICS:        'view_analytics',
  EXPORT_ANALYTICS:      'export_analytics',       // Download CSV/PDF reports

  // AI features
  AI_WRITE_UNLIMITED:    'ai_write_unlimited',
  AI_WRITE_LIMITED:      'ai_write_limited',       // 3/day

  // Team
  MANAGE_TEAM:           'manage_team',            // Add/remove/edit users
  VIEW_TEAM:             'view_team',

  // Settings
  ACCESS_SETTINGS:       'access_settings',

  // Platforms
  POST_ALL_PLATFORMS:    'post_all_platforms',     // Unlimited platforms at once
  POST_MAX_3_PLATFORMS:  'post_max_3_platforms',   // Max 3 platforms
};

// ── Role definitions ──────────────────────────
const ROLES = {
  admin: {
    label: 'Admin',
    color: '#6366f1',
    badge: '👑',
    permissions: Object.values(PERMISSIONS), // All permissions
  },
  user: {
    label: 'User',
    color: '#06b6d4',
    badge: '👤',
    permissions: [
      PERMISSIONS.SUBMIT_FOR_REVIEW,
      PERMISSIONS.DELETE_OWN_POST,
      PERMISSIONS.VIEW_OWN_POSTS,
      PERMISSIONS.SCHEDULE_POSTS,
      PERMISSIONS.EDIT_OWN_POST,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.AI_WRITE_LIMITED,
      PERMISSIONS.VIEW_TEAM,
      PERMISSIONS.POST_MAX_3_PLATFORMS,
    ],
  },
};

// ── Current user role ─────────────────────────
function getCurrentRole() {
  const user = getCurrentUser();
  if (!user) return null;
  return user.email === ADMIN_EMAIL ? 'admin' : 'user';
}

function getCurrentUser() {
  // Firebase user
  if (typeof auth !== 'undefined' && auth && auth.currentUser) {
    return auth.currentUser;
  }
  // Session user (Google/Microsoft)
  try {
    return JSON.parse(sessionStorage.getItem('socialUser') || 'null');
  } catch(e) { return null; }
}

function isAdmin() {
  return getCurrentRole() === 'admin';
}

// ── Permission check ──────────────────────────
function hasPermission(permission) {
  const role = getCurrentRole();
  if (!role) return false;
  return ROLES[role].permissions.includes(permission);
}

// ── Apply UI restrictions based on role ───────
function applyRoleRestrictions() {
  const role = getCurrentRole();
  if (!role) return;

  // Show/hide admin-only elements
  document.querySelectorAll('[data-admin-only]').forEach(el => {
    el.style.display = role === 'admin' ? '' : 'none';
  });

  // Show/hide user-only elements
  document.querySelectorAll('[data-user-only]').forEach(el => {
    el.style.display = role === 'user' ? '' : 'none';
  });

  // Disable locked elements for non-admins
  document.querySelectorAll('[data-requires-permission]').forEach(el => {
    const perm = el.dataset.requiresPermission;
    if (!hasPermission(perm)) {
      el.disabled = true;
      el.classList.add('locked');
      el.title = '🔒 Admin only';
      if (el.tagName === 'A') el.style.pointerEvents = 'none';
    }
  });

  // Update role badge in sidebar
  const roleBadge = document.getElementById('userRoleBadge');
  if (roleBadge) {
    const r = ROLES[role];
    roleBadge.textContent = `${r.badge} ${r.label}`;
    roleBadge.style.background = role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(6,182,212,0.15)';
    roleBadge.style.color = r.color;
  }
}

// ── Pending posts count (admin badge) ────────
function getPendingCount() {
  const posts = getAllPosts();
  return posts.filter(p => p.status === 'pending_approval').length;
}

// ── LocalStorage post store ───────────────────
const POSTS_KEY = 'social_scheduled_posts';

function getAllPosts() {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); } catch(e) { return []; }
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function createPost(data) {
  const user = getCurrentUser();
  const role = getCurrentRole();
  const post = {
    id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    content: data.content || '',
    platforms: data.platforms || [],
    scheduledAt: data.scheduledAt || null,
    status: data.status || (role === 'admin' ? 'scheduled' : 'pending_approval'),
    createdBy: user?.email || 'unknown',
    createdByName: user?.displayName || 'Unknown',
    createdAt: new Date().toISOString(),
    mediaType: data.mediaType || null,
    tags: data.tags || [],
    approved: role === 'admin',
  };
  const posts = getAllPosts();
  posts.push(post);
  savePosts(posts);
  return post;
}

function updatePost(id, updates) {
  const posts = getAllPosts();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  savePosts(posts);
  return posts[idx];
}

function deletePost(id) {
  const posts = getAllPosts().filter(p => p.id !== id);
  savePosts(posts);
}

function getVisiblePosts() {
  const role = getCurrentRole();
  const user = getCurrentUser();
  const all = getAllPosts();
  if (role === 'admin') return all;
  return all.filter(p => p.createdBy === user?.email);
}

// ── AI Write daily limit (users) ─────────────
function checkAIWriteLimit() {
  if (isAdmin()) return true;
  const today = new Date().toDateString();
  const key = 'ai_write_' + today;
  const count = parseInt(localStorage.getItem(key) || '0');
  if (count >= 3) return false;
  localStorage.setItem(key, count + 1);
  return true;
}
