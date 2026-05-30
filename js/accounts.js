/* =============================================
   CaveCrew — Accounts Page JavaScript
   accounts.js
   ============================================= */

'use strict';

// =============================================
// Platform Data
// =============================================
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', category: 'instagram', bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', color: '#e1306c' },
  { id: 'twitter', name: 'X / Twitter', category: 'twitter', bg: '#1a1a1a', color: '#1da1f2', border: '#333' },
  { id: 'facebook', name: 'Facebook', category: 'facebook', bg: '#1877f2', color: '#1877f2' },
  { id: 'linkedin', name: 'LinkedIn', category: 'linkedin', bg: '#0077b5', color: '#0077b5' },
  { id: 'tiktok', name: 'TikTok', category: 'tiktok', bg: '#1a1a1a', color: '#fe2c55', border: '#333' },
  { id: 'youtube', name: 'YouTube', category: 'youtube', bg: '#ff0000', color: '#ff0000' },
  { id: 'pinterest', name: 'Pinterest', category: 'other', bg: '#e60023', color: '#e60023' },
  { id: 'snapchat', name: 'Snapchat', category: 'other', bg: '#fffc00', color: '#333' },
  { id: 'threads', name: 'Threads', category: 'twitter', bg: '#1a1a1a', color: '#fff' },
  { id: 'reddit', name: 'Reddit', category: 'other', bg: '#ff4500', color: '#ff4500' },
  { id: 'discord', name: 'Discord', category: 'other', bg: '#5865f2', color: '#5865f2' },
  { id: 'telegram', name: 'Telegram', category: 'other', bg: '#0088cc', color: '#0088cc' },
];

const PLATFORM_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`,
  snapchat: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.814l-.004.093c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.045.677-.165 1.076-.165.826 0 1.4.39 1.4.976.008.346-.094.661-.388.904-.32.257-.79.381-1.289.381l-.116-.005c-.36-.021-.657-.12-.87-.21.01.139.058.509.194.855.418 1.069 1.272 1.915 2.548 2.511.494.235.835.578.835 1.07 0 .544-.56 1.03-1.395 1.369-.396.173-.833.275-1.342.315-.084.375-.355 1.059-.836 1.059-.135 0-.271-.025-.39-.063l-.019-.006c-.256-.072-.552-.18-.94-.18-.392 0-.634.108-.83.196-.198.089-.4.192-.715.192-.345 0-.625-.12-.84-.23l-.08-.04c-.2-.1-.367-.176-.574-.176-.15 0-.3.049-.455.136-.33.185-.638.288-1.012.288-.372 0-.682-.103-1.01-.288-.155-.087-.305-.136-.457-.136-.207 0-.374.076-.575.176l-.079.04c-.215.11-.495.23-.84.23-.315 0-.517-.103-.714-.192-.197-.088-.44-.196-.83-.196-.39 0-.685.108-.943.18l-.019.006c-.12.038-.254.063-.39.063-.48 0-.75-.684-.836-1.059-.508-.04-.946-.142-1.342-.315C1.56 19.03 1 18.544 1 18c0-.492.341-.835.835-1.07 1.276-.596 2.13-1.442 2.548-2.511.136-.346.184-.716.193-.855-.211.09-.508.189-.87.21l-.115.005c-.499 0-.969-.124-1.29-.381-.294-.243-.395-.558-.387-.904 0-.586.574-.976 1.4-.976.398 0 .776.12 1.075.165.198 0 .326-.045.402-.09l-.03-.51-.004-.093c-.087-1.595-.213-3.621.317-4.814C6.86 1.069 10.217.793 11.206.793h1z"/></svg>`,
  threads: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.3-.883-2.348-.887h-.13c-.876 0-2.228.498-2.892 2.371l-1.925-.681C9.002 3.762 10.572 3.04 12.15 3.04h.008c3.581.024 6.334 1.205 8.184 3.509 1.645 2.052 2.496 4.906 2.524 8.48v.016c-.028 3.576-.878 6.43-2.524 8.483-1.846 2.303-4.598 3.484-8.18 3.509l-.9.027z"/></svg>`,
  reddit: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
};

// Demo account data
let accounts = [
  { id: 1, platform: 'instagram', username: '@brandname', label: 'Main Brand', followers: '842K', posts: '1.2K', engagement: '4.8%', status: 'connected' },
  { id: 2, platform: 'twitter', username: '@brandname', label: 'Main Brand', followers: '224K', posts: '8.4K', engagement: '2.3%', status: 'connected' },
  { id: 3, platform: 'facebook', username: 'Brand Official', label: 'Page', followers: '318K', posts: '3.1K', engagement: '1.9%', status: 'connected' },
  { id: 4, platform: 'linkedin', username: 'Brand Co.', label: 'Company Page', followers: '98K', posts: '412', engagement: '5.2%', status: 'connected' },
  { id: 5, platform: 'tiktok', username: '@brandname', label: 'Main', followers: '1.2M', posts: '245', engagement: '7.6%', status: 'connected' },
  { id: 6, platform: 'youtube', username: 'Brand Channel', label: 'Main', followers: '482K', posts: '312', engagement: '3.4%', status: 'connected' },
  { id: 7, platform: 'linkedin', username: 'Brand CEO', label: 'Personal', followers: '23K', posts: '89', engagement: '8.1%', status: 'syncing' },
];

let selectedPlatform = null;
let currentStep = 1;

// =============================================
// Render Accounts Grid
// =============================================
function renderAccounts(filter = 'all', searchQuery = '') {
  const grid = document.getElementById('accountsGrid');
  if (!grid) return;

  let filtered = accounts;
  if (filter !== 'all') {
    filtered = filtered.filter(a => a.platform === filter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.username.toLowerCase().includes(q) ||
      a.label.toLowerCase().includes(q) ||
      a.platform.toLowerCase().includes(q)
    );
  }

  grid.innerHTML = '';

  filtered.forEach((account, i) => {
    const platform = PLATFORMS.find(p => p.id === account.platform) || PLATFORMS[0];
    const initials = account.username.replace('@', '').substring(0, 2).toUpperCase();
    const trendUp = Math.random() > 0.3;

    const card = document.createElement('div');
    card.className = 'account-card';
    card.style.animationDelay = `${i * 60}ms`;
    card.dataset.platform = account.platform;

    card.innerHTML = `
      <div class="account-card__header">
        <div class="account-avatar">
          <div class="account-avatar__img" style="background:${platform.bg}">
            ${initials}
          </div>
          <div class="account-avatar__platform" style="background:${platform.bg};color:${platform.color === '#333' ? '#333' : 'white'}">
            ${PLATFORM_ICONS[account.platform] || ''}
          </div>
        </div>
        <div class="account-info">
          <span class="account-name">${account.username}</span>
          <span class="account-handle">${platform.name}</span>
          <span class="account-label" style="background:${platform.bg.startsWith('linear') ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.1)'};color:var(--color-primary)">${account.label}</span>
        </div>
        <div class="account-status">
          <div class="status-dot status-dot--${account.status}"></div>
          <span style="color:${account.status === 'connected' ? 'var(--color-success)' : account.status === 'syncing' ? 'var(--color-warning)' : 'var(--color-error)'};font-size:11px;font-weight:600">${account.status.charAt(0).toUpperCase() + account.status.slice(1)}</span>
        </div>
        <button class="account-card__menu" onclick="openAccountMenu(${account.id}, event)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
      <div class="account-metrics">
        <div class="metric">
          <span class="metric__value">${account.followers}</span>
          <span class="metric__label">Followers</span>
          <span class="metric__trend metric__trend--${trendUp ? 'up' : 'down'}">${trendUp ? '↑' : '↓'} ${(Math.random() * 10 + 1).toFixed(1)}%</span>
        </div>
        <div class="metric">
          <span class="metric__value">${account.posts}</span>
          <span class="metric__label">Posts</span>
        </div>
        <div class="metric">
          <span class="metric__value">${account.engagement}</span>
          <span class="metric__label">Engage</span>
          <span class="metric__trend metric__trend--up">↑ Good</span>
        </div>
      </div>
      <div class="account-card__actions">
        <button class="account-action" onclick="viewAccount(${account.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Analytics
        </button>
        <button class="account-action" onclick="scheduleForAccount(${account.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Schedule
        </button>
        <button class="account-action account-action--danger" onclick="disconnectAccount(${account.id}, event)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Show/hide CTA
  const cta = document.querySelector('.add-account-cta');
  if (cta) {
    cta.style.display = filtered.length === 0 ? 'flex' : 'flex';
  }
}

// =============================================
// Account Actions
// =============================================
window.viewAccount = function(id) {
  showToast('Opening analytics for this account...', 'info');
};

window.scheduleForAccount = function(id) {
  showToast('Opening scheduler for this account...', 'info');
};

window.openAccountMenu = function(id, e) {
  e.stopPropagation();
  showToast('Account menu coming soon!', 'info');
};

window.disconnectAccount = function(id, e) {
  e.stopPropagation();
  if (confirm('Are you sure you want to disconnect this account?')) {
    accounts = accounts.filter(a => a.id !== id);
    renderAccounts();
    showToast('Account disconnected', 'success');
  }
};

// =============================================
// Platform Filter Tabs
// =============================================
function initPlatformFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('filter-tab--active'));
      tab.classList.add('filter-tab--active');
      renderAccounts(tab.dataset.filter, document.getElementById('accountSearch')?.value || '');
    });
  });
}

// =============================================
// Search
// =============================================
function initSearch() {
  const search = document.getElementById('accountSearch');
  if (!search) return;

  search.addEventListener('input', () => {
    const activeFilter = document.querySelector('.filter-tab--active')?.dataset.filter || 'all';
    renderAccounts(activeFilter, search.value);
  });
}

// =============================================
// Add Account Modal
// =============================================
function initAddAccountModal() {
  const modal = document.getElementById('addAccountModal');
  const openBtns = [document.getElementById('addAccountBtn'), document.getElementById('addAccountCta')];
  const closeBtn = document.getElementById('closeAddAccountModal');
  const cancelBtn = document.getElementById('cancelAddAccountBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  const backBtn = document.getElementById('backStepBtn');

  if (!modal) return;

  // Populate platform select grid
  const grid = document.getElementById('platformSelectGrid');
  if (grid) {
    PLATFORMS.forEach(platform => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'platform-select-btn';
      btn.dataset.platformId = platform.id;
      btn.innerHTML = `
        <div class="psb-icon" style="background:${platform.bg};color:${platform.id === 'snapchat' ? '#333' : 'white'}">
          ${PLATFORM_ICONS[platform.id] || ''}
        </div>
        <span>${platform.name}</span>
      `;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.platform-select-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPlatform = platform;
        nextBtn.disabled = false;
        nextBtn.textContent = `Connect ${platform.name} →`;
      });
      grid.appendChild(btn);
    });
  }

  // Open modal
  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openModal();
      });
    }
  });

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    goToStep(1);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    selectedPlatform = null;
    currentStep = 1;
    nextBtn.disabled = true;
    nextBtn.textContent = 'Select a Platform';
    document.querySelectorAll('.platform-select-btn').forEach(b => b.classList.remove('selected'));
    // Reset form
    const form = document.getElementById('connectAccountForm');
    if (form) form.reset();
    clearErrors();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      if (currentStep === 1 && selectedPlatform) {
        goToStep(2);
      } else if (currentStep === 2) {
        if (validateCredentials()) {
          goToStep(3);
          await simulateConnection();
          goToStep(4);
        }
      } else if (currentStep === 4) {
        closeModal();
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  }

  function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.account-step').forEach(s => s.style.display = 'none');
    const stepEl = document.getElementById(`step${step}`);
    if (stepEl) stepEl.style.display = 'block';

    const title = document.getElementById('addAccountModalTitle');
    const footerR = document.getElementById('addAccountModalFooter');

    const titles = {
      1: 'Connect Social Account',
      2: `Connect ${selectedPlatform?.name || 'Account'}`,
      3: 'Connecting...',
      4: '🎉 Account Connected!',
    };

    if (title) title.textContent = titles[step];
    if (backBtn) backBtn.style.display = step > 1 && step < 3 ? 'inline-flex' : 'none';

    if (step === 2) {
      // Populate selected platform header
      const header = document.getElementById('selectedPlatformHeader');
      const platformLabel = document.getElementById('platformNameLabel');
      if (header && selectedPlatform) {
        header.innerHTML = `
          <div class="psb-icon" style="background:${selectedPlatform.bg};color:${selectedPlatform.id === 'snapchat' ? '#333' : 'white'};width:48px;height:48px">
            ${PLATFORM_ICONS[selectedPlatform.id] || ''}
          </div>
          <div class="sph-info">
            <h4>${selectedPlatform.name}</h4>
            <p>Enter your login credentials below</p>
          </div>
        `;
      }
      if (platformLabel) platformLabel.textContent = selectedPlatform?.name || 'platform';
      nextBtn.textContent = 'Connect Account →';
      nextBtn.disabled = false;
    }

    if (step === 3) {
      nextBtn.style.display = 'none';
      if (backBtn) backBtn.style.display = 'none';
      if (cancelBtn) cancelBtn.style.display = 'none';
    }

    if (step === 4) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Go to Accounts';
      if (cancelBtn) cancelBtn.style.display = 'none';
      showSuccessScreen();
    }
  }

  // Password toggle for account
  const togglePw = document.getElementById('toggleAccountPw');
  if (togglePw) {
    togglePw.addEventListener('click', () => {
      const input = document.getElementById('accountPassword');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }
}

// =============================================
// Credential Validation
// =============================================
function validateCredentials() {
  clearErrors();
  const username = document.getElementById('accountUsername')?.value.trim();
  const password = document.getElementById('accountPassword')?.value;
  let valid = true;

  if (!username) {
    showFieldError('accountUsernameError', 'Username or email is required');
    valid = false;
  }
  if (!password) {
    showFieldError('accountPasswordError', 'Password is required');
    valid = false;
  } else if (password.length < 4) {
    showFieldError('accountPasswordError', 'Password must be at least 4 characters');
    valid = false;
  }

  return valid;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['accountUsernameError', 'accountPasswordError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// =============================================
// Connection Simulation
// =============================================
async function simulateConnection() {
  const steps = [
    'Establishing secure connection...',
    'Verifying credentials...',
    'Fetching account data...',
    'Syncing profile information...',
    'Importing follower data...',
  ];

  const title = document.getElementById('connectingTitle');
  const orbEl = document.getElementById('connectingOrb');
  const stepsEl = document.getElementById('connectingSteps');

  if (title) title.textContent = `Connecting to ${selectedPlatform?.name}...`;
  if (orbEl) orbEl.style.background = selectedPlatform?.bg || 'linear-gradient(135deg,#6366f1,#06b6d4)';

  if (stepsEl) stepsEl.innerHTML = '';

  for (let i = 0; i < steps.length; i++) {
    const stepEl = document.createElement('div');
    stepEl.className = 'connecting-step active';
    stepEl.innerHTML = `<div class="connecting-step-dot"></div>${steps[i]}`;
    if (stepsEl) stepsEl.appendChild(stepEl);

    await new Promise(r => setTimeout(r, 500));

    stepEl.className = 'connecting-step done';
    stepEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>
      ${steps[i]}
    `;
  }

  await new Promise(r => setTimeout(r, 300));
}

// =============================================
// Success Screen
// =============================================
function showSuccessScreen() {
  const msg = document.getElementById('successMsg');
  const preview = document.getElementById('connectedPreview');
  const username = document.getElementById('accountUsername')?.value || 'your account';
  const label = document.getElementById('accountLabel')?.value || selectedPlatform?.name;

  if (msg) msg.textContent = `${username} has been successfully connected to CaveCrew. We're syncing your data now.`;
  if (preview && selectedPlatform) {
    preview.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;border-radius:8px;background:${selectedPlatform.bg};display:flex;align-items:center;justify-content:center;color:white">
          ${PLATFORM_ICONS[selectedPlatform.id] || ''}
        </div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--text-primary)">${username}</div>
          <div style="font-size:12px;color:var(--text-muted)">${selectedPlatform.name} · ${label}</div>
        </div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--color-success)">
          <span style="width:7px;height:7px;border-radius:50%;background:var(--color-success);display:block"></span>
          Connected
        </div>
      </div>
    `;
  }

  // Add to accounts list
  if (selectedPlatform) {
    const newAccount = {
      id: Date.now(),
      platform: selectedPlatform.id,
      username: document.getElementById('accountUsername')?.value || '@newaccount',
      label: document.getElementById('accountLabel')?.value || 'New Account',
      followers: '—',
      posts: '—',
      engagement: '—',
      status: 'syncing',
    };
    accounts.push(newAccount);
    renderAccounts();
  }
}

// =============================================
// Toast
// =============================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;`;
    document.body.appendChild(container);
  }

  const colors = {
    success: { border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    error: { border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    info: { border: 'rgba(99,102,241,0.3)', text: '#6366f1' },
  };

  const c = colors[type] || colors.info;
  const toast = document.createElement('div');
  toast.style.cssText = `background:var(--color-surface);border:1px solid ${c.border};border-left:3px solid ${c.text};border-radius:10px;padding:12px 18px;font-size:14px;font-weight:500;color:var(--text-primary);box-shadow:0 8px 32px rgba(0,0,0,0.4);pointer-events:all;animation:toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;max-width:340px;font-family:'Outfit',sans-serif;`;
  toast.textContent = message;

  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}@keyframes toastOut{to{opacity:0;transform:translateX(60px)}}`;
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

function simulateDelay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  renderAccounts();
  initPlatformFilter();
  initSearch();
  initAddAccountModal();
});
