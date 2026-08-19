/* ==========================================================================
   GeoQuest Home Screen Modals & Panels
   - Profile Panel (Avatar, Stats, Badges, Mission History)
   - Mailbox / Game Updates Panel (Unread Notifications)
   - Leaderboard Panel (Top 10 + Your Rank Card)
   - Heritage AI Guide Panel (Polished Placeholder)
   - Settings Panel (Volume Slider & Explicit Logout)
   ========================================================================== */

import { SVG_ICONS } from '../assets.js';
import { appState } from '../state.js';
import { sound } from '../audio.js';

export function getHomeModalHTML(modalName, modalData = {}) {
  switch (modalName) {
    case 'profile':
      return createProfileModalHTML();
    case 'mailbox':
      return createMailboxModalHTML();
    case 'leaderboard':
      return createLeaderboardModalHTML();
    case 'heritage_ai':
      return createHeritageAIModalHTML();
    case 'settings':
      return createSettingsModalHTML();
    case 'collection':
      return createCollectionModalHTML();
    default:
      return '';
  }
}

export function setupHomeModalEvents(wrapper, modalName) {
  switch (modalName) {
    case 'profile':
      setupProfileEvents(wrapper);
      break;
    case 'mailbox':
      setupMailboxEvents(wrapper);
      break;
    case 'leaderboard':
      setupLeaderboardEvents(wrapper);
      break;
    case 'heritage_ai':
      setupHeritageAIEvents(wrapper);
      break;
    case 'settings':
      setupSettingsEvents(wrapper);
      break;
    case 'collection':
      setupCollectionEvents(wrapper);
      break;
  }
}

// ---------------------------------------------------------
// 1. PROFILE MODAL
// ---------------------------------------------------------
function createProfileModalHTML() {
  const p = appState.player;
  const xpPercent = Math.min(100, Math.round((p.xp / p.nextLevelXp) * 100));

  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet profile-modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.user}</span>
            <h3 class="modal-title">Explorer Dossier</h3>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="profile-scroll-area" style="padding-bottom:12px;">
          <!-- Profile Card -->
          <div class="profile-hero-card">
            <div class="profile-avatar-wrap anim-pulse-logo">
              <div class="profile-avatar-inner">
                ${SVG_ICONS.logoHero}
              </div>
              <div class="profile-level-badge">LVL ${p.level}</div>
            </div>

            <h3 class="profile-name">${p.username}</h3>
            <span class="profile-title">${p.title}</span>

            <div class="profile-streak-pill">
              <span style="color:#f4a261;">${SVG_ICONS.flame}</span>
              <span>${p.streak}-Day Exploration Streak</span>
            </div>

            <!-- XP Bar Inside Profile -->
            <div class="profile-xp-meter">
              <div class="xp-meter-header">
                <span>XP Progress</span>
                <span style="font-weight:700; color:var(--gold-300);">${p.xp.toLocaleString()} / ${p.nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div class="xp-meter-track">
                <div class="xp-meter-fill" style="width: ${xpPercent}%;"></div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="profile-stats-grid">
            <div class="profile-stat-box">
              <span class="p-stat-val">${p.stats.missionsCompleted}</span>
              <span class="p-stat-lbl">Missions</span>
            </div>
            <div class="profile-stat-box">
              <span class="p-stat-val">${p.stats.relicsDiscovered}</span>
              <span class="p-stat-lbl">Relics</span>
            </div>
            <div class="profile-stat-box">
              <span class="p-stat-val">${p.stats.countriesExplored}</span>
              <span class="p-stat-lbl">Regions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupProfileEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());
}

// ---------------------------------------------------------
// 2. MAILBOX MODAL
// ---------------------------------------------------------
function createMailboxModalHTML() {
  const messages = appState.mailbox;
  const unreadCount = appState.getUnreadMailCount();

  const messagesHtml = messages.map(m => `
    <div class="mailbox-item ${m.unread ? 'unread' : 'read'}" data-mail-id="${m.id}">
      <div class="mail-icon">${m.icon}</div>
      <div class="mail-body">
        <div class="mail-header-meta">
          <span class="mail-type-tag">${m.type || 'Dispatch'}</span>
          <span class="mail-time">${m.time}</span>
        </div>
        <h4 class="mail-title">${m.title}</h4>
        <p class="mail-preview">${m.preview}</p>
        <p class="mail-content-full">${m.content}</p>
      </div>
      ${m.unread ? '<span class="unread-dot" aria-label="Unread message"></span>' : ''}
    </div>
  `).join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.mail}</span>
            <h3 class="modal-title">Game Mailbox</h3>
            ${unreadCount > 0 ? `<span class="badge-unread-count">${unreadCount} New</span>` : ''}
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">
          Guild notices, mission dispatches, and exploration streak bonuses.
        </p>

        <div class="mailbox-list">
          ${messagesHtml}
        </div>
      </div>
    </div>
  `;
}

function setupMailboxEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());

  const items = wrapper.querySelectorAll('.mailbox-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      sound.playTap();
      item.classList.toggle('expanded');
      const mailId = item.getAttribute('data-mail-id');
      appState.markMailAsRead(mailId);
      const dot = item.querySelector('.unread-dot');
      if (dot) dot.remove();
      item.classList.remove('unread');
      item.classList.add('read');
    });
  });
}

// ---------------------------------------------------------
// 3. LEADERBOARD MODAL
// ---------------------------------------------------------
function createLeaderboardModalHTML() {
  const lb = appState.leaderboard;
  const userRank = lb.currentUserRank;

  const topListHtml = lb.topPlayers.map((player, idx) => {
    const isTop3 = player.rank <= 3;
    let rankBadge = `#${player.rank}`;
    if (player.rank === 1) rankBadge = '🥇';
    if (player.rank === 2) rankBadge = '🥈';
    if (player.rank === 3) rankBadge = '🥉';

    return `
      <div class="lb-row ${isTop3 ? 'top-three' : ''}">
        <div class="lb-rank rank-${player.rank}">${rankBadge}</div>
        <div class="lb-avatar" style="background: ${player.avatarColor}; color: #12100d;">
          ${player.name.charAt(0)}
        </div>
        <div class="lb-player-info">
          <span class="lb-player-name">${player.name}</span>
          <span class="lb-player-badge">${player.badge} • Lvl ${player.level}</span>
        </div>
        <div class="lb-player-xp">${player.xp.toLocaleString()} XP</div>
      </div>
    `;
  }).join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.trophy}</span>
            <h3 class="modal-title">Global Leaderboard</h3>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="lb-subtitle">TOP 10 WORLD EXPLORERS</div>

        <div class="lb-list">
          ${topListHtml}
        </div>

        <!-- Current User Rank Separate Card -->
        <div class="lb-user-card">
          <div class="lb-user-label">YOUR RANKING</div>
          <div class="lb-user-inner">
            <div class="lb-user-rank">#${userRank.rank}</div>
            <div class="lb-avatar" style="background: var(--gold-500); color: #12100d;">
              ${appState.player.username.charAt(0)}
            </div>
            <div class="lb-player-info">
              <span class="lb-player-name">${appState.player.username} (You)</span>
              <span class="lb-player-badge">${appState.player.title} • Lvl ${appState.player.level}</span>
            </div>
            <div class="lb-player-xp" style="color:var(--gold-300); font-weight:800;">
              ${appState.player.xp.toLocaleString()} XP
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupLeaderboardEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());
}

// ---------------------------------------------------------
// 4. HERITAGE AI ASSISTANT MODAL (Placeholder)
// ---------------------------------------------------------
function createHeritageAIModalHTML() {
  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.bot}</span>
            <h3 class="modal-title">Heritage AI Guide</h3>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <!-- AI Assistant Intro Card -->
        <div class="ai-assistant-card">
          <div class="ai-avatar-wrap anim-pulse-logo">
            <div class="ai-avatar-icon">🤖</div>
          </div>
          <h4 class="ai-hero-title">Heritage AI</h4>
          <p class="ai-status-text">Your heritage guide is ready to help ✨</p>
          <div class="hero-divider" style="margin:12px auto;"></div>

          <!-- How to Use -->
          <div class="ai-howto-wrap">
            <span class="ai-howto-heading">How to Use</span>
            <p class="ai-howto-desc">
              Use AI during exploration to know and learn about heritage sites — their history, architecture, culture, and significance.
            </p>
          </div>

          <div class="ai-badge-soon">
            <span>✨ AI functionality coming soon</span>
          </div>
        </div>

        <!-- Exploration Prompts -->
        <div class="ai-chips-wrap">
          <span class="ai-chips-heading">EXPLORATION PROMPTS</span>
          <div class="ai-chips-list">
            <button type="button" class="ai-prompt-chip" data-prompt="taj">
              <span class="chip-icon">🕌</span>
              <span>What is the history of the Taj Mahal in Agra?</span>
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="ajanta">
              <span class="chip-icon">🏛️</span>
              <span>Tell me about Ajanta and Ellora Caves in Maharashtra</span>
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="sun">
              <span class="chip-icon">☀️</span>
              <span>How was the Sun Temple at Konark built?</span>
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="kaziranga">
              <span class="chip-icon">🦏</span>
              <span>What animals live in Kaziranga National Park?</span>
            </button>
          </div>
        </div>

        <button type="button" class="btn btn-gold" id="btn-ai-dismiss" style="margin-top:14px; height:46px;">
          <span>GOT IT</span>
        </button>
      </div>
    </div>
  `;
}

function setupHeritageAIEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');
  const dismissBtn = wrapper.querySelector('#btn-ai-dismiss');
  const chips = wrapper.querySelectorAll('.ai-prompt-chip');

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());
  dismissBtn?.addEventListener('click', () => {
    sound.playTap();
    appState.closeModal();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.playTap();
      appState.showToast('Heritage AI companion will answer this in the upcoming update!', 'info');
    });
  });
}

// ---------------------------------------------------------
// 5. SETTINGS MODAL
// ---------------------------------------------------------
function createSettingsModalHTML() {
  const currentVol = Math.round((sound.volume || 0.8) * 100);
  const isMuted = sound.isMuted;

  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.settings}</span>
            <h3 class="modal-title">Expedition Settings</h3>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="settings-list">
          <!-- Volume Control -->
          <div class="setting-item vol-item">
            <div class="setting-header">
              <div class="setting-title-wrap">
                <span style="color:var(--gold-400); display:flex;">${SVG_ICONS.volume}</span>
                <span class="setting-title">Audio Volume</span>
              </div>
              <span class="setting-val" id="vol-percent-text">${isMuted ? 'Muted' : `${currentVol}%`}</span>
            </div>

            <!-- Beautiful Custom Volume Slider -->
            <div class="vol-slider-outer">
              <span class="vol-icon-low" aria-hidden="true">🔈</span>
              <div class="vol-track-wrap">
                <div class="vol-track-bg">
                  <div class="vol-track-fill" id="vol-track-fill" style="width:${isMuted ? 0 : currentVol}%"></div>
                  <div class="vol-track-glow" id="vol-track-glow" style="width:${isMuted ? 0 : currentVol}%"></div>
                </div>
                <div class="vol-ticks" aria-hidden="true">
                  ${Array.from({length:9}, (_,i) => `<span class="vol-tick${i===0||i===8?' vol-tick-end':''}" style="left:${i*12.5}%"></span>`).join('')}
                </div>
                <input
                  type="range"
                  id="volume-slider"
                  min="0" max="100"
                  value="${isMuted ? 0 : currentVol}"
                  class="geo-range-slider"
                  aria-label="Volume"
                />
              </div>
              <span class="vol-icon-high" aria-hidden="true">🔊</span>
            </div>

            <div class="vol-labels" aria-hidden="true">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          <!-- Sound Mute Switch -->
          <div class="setting-item-row">
            <div class="setting-title-wrap">
              <span style="font-size:16px;">🔔</span>
              <span class="setting-title">Sound Effects</span>
            </div>
            <button type="button" class="toggle-switch ${!isMuted ? 'active' : ''}" id="sound-toggle-btn">
              <span class="toggle-knob"></span>
            </button>
          </div>

          <!-- Version Info -->
          <div class="setting-item-row" style="border:none; padding:8px 0;">
            <span style="font-size:12px; color:var(--text-muted);">GeoQuest Realm Engine</span>
            <span style="font-size:12px; color:var(--gold-400); font-weight:700;">v1.2.0-Alpha</span>
          </div>

          <!-- Explicit Logout Button -->
          <div style="margin-top:12px;">
            <button type="button" class="btn btn-logout-action" id="btn-settings-logout">
              <span style="display:flex;">${SVG_ICONS.logout}</span>
              <span>🚪 Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupSettingsEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');
  const logoutBtn = wrapper.querySelector('#btn-settings-logout');
  const volumeSlider = wrapper.querySelector('#volume-slider');
  const volPercentText = wrapper.querySelector('#vol-percent-text');
  const soundToggleBtn = wrapper.querySelector('#sound-toggle-btn');

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());

  // Volume Slider Live Update
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        sound.setVolume(val);
        // Update fill track width
        const fill = wrapper.querySelector('#vol-track-fill');
        const glow = wrapper.querySelector('#vol-track-glow');
        if (fill) fill.style.width = `${e.target.value}%`;
        if (glow) glow.style.width = `${e.target.value}%`;
        if (sound.isMuted && val > 0) {
          sound.toggleMute();
          soundToggleBtn?.classList.add('active');
        }
        if (volPercentText) {
          volPercentText.textContent = `${Math.round(val * 100)}%`;
        }
      });

    volumeSlider.addEventListener('change', () => {
      sound.playTap();
    });
  }

  // Sound Toggle Switch
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      soundToggleBtn.classList.toggle('active', !isMuted);
      if (volPercentText) {
        volPercentText.textContent = isMuted ? 'Muted' : `${Math.round(sound.volume * 100)}%`;
      }
      if (!isMuted) {
        sound.playChime();
      }
    });
  }

  // Explicit Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sound.playTap();
      appState.closeModal();
      appState.logout();
    });
  }
}

// ---------------------------------------------------------
// 6. COLLECTION / BADGES MODAL
// ---------------------------------------------------------
function createCollectionModalHTML() {
  const p = appState.player;
  const badges = p.badges || [];
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  const badgesListHtml = badges.map(b => `
    <div class="coll-badge-card ${b.unlocked ? 'unlocked' : 'locked'}" data-badge-id="${b.id}" role="button" tabindex="0" aria-label="${b.name} badge details">
      <div class="coll-badge-num-col">
        <span class="coll-badge-num">#${b.number}</span>
      </div>
      <div class="coll-badge-icon-wrap">
        <span class="coll-badge-emoji">${b.icon}</span>
        ${b.unlocked ? '<div class="coll-badge-glow-ring" aria-hidden="true"></div>' : '<div class="coll-badge-lock-ico" aria-hidden="true">🔒</div>'}
      </div>
      <div class="coll-badge-content">
        <div class="coll-badge-top-row">
          <h4 class="coll-badge-name">${b.name}</h4>
          <span class="coll-rarity-tag rarity-${b.rarity.toLowerCase()}">${b.rarity}</span>
        </div>
        <p class="coll-badge-cond">✦ ${b.condition}</p>
        <div class="coll-badge-bottom-row">
          <span class="coll-badge-status ${b.unlocked ? 'status-unlocked' : 'status-locked'}">
            ${b.unlocked ? '✨ Unlocked' : '🔒 Locked'}
          </span>
          <span class="coll-badge-reward">⭐ ${b.reward}</span>
        </div>
      </div>
      <div class="coll-badge-arrow" aria-hidden="true">›</div>
    </div>
  `).join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop-generic">
      <div class="modal-sheet collection-modal-sheet">
        <div class="modal-handle"></div>

        <!-- Header -->
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); display:flex; font-size:18px;">🏆</span>
            <h3 class="modal-title">Expedition Badges</h3>
          </div>
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
            ${SVG_ICONS.close}
          </button>
        </div>

        <div class="collection-scroll-area">
          <!-- Summary Progress Card -->
          <div class="coll-summary-card">
            <div class="coll-summary-top">
              <div class="coll-summary-left">
                <span class="coll-summary-lbl">EXPEDITION COLLECTION</span>
                <div class="coll-summary-val-row">
                  <span class="coll-summary-big">${unlockedCount}</span>
                  <span class="coll-summary-total">/ ${totalCount} BADGES</span>
                </div>
              </div>
              <div class="coll-summary-right">
                <span class="coll-pct-tag">${pct}% UNLOCKED</span>
              </div>
            </div>
            <!-- Progress bar -->
            <div class="coll-progress-track">
              <div class="coll-progress-fill" style="width: ${pct}%;"></div>
              <div class="coll-progress-gleam" aria-hidden="true"></div>
            </div>
          </div>

          <p class="coll-hint-text">Tap any badge to inspect criteria and rewards</p>

          <!-- Badges List -->
          <div class="coll-badges-list">
            ${badgesListHtml}
          </div>
        </div>

        <!-- Single Badge Detail Inspector Drawer -->
        <div class="badge-detail-drawer" id="badge-detail-drawer" aria-hidden="true">
          <div class="badge-detail-backdrop" id="badge-detail-backdrop"></div>
          <div class="badge-detail-card" id="badge-detail-card">
            <!-- Dynamically populated on badge click -->
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupCollectionEvents(wrapper) {
  const backdrop = wrapper.querySelector('#modal-backdrop-generic');
  const closeBtn = wrapper.querySelector('#modal-close-btn');
  const drawer = wrapper.querySelector('#badge-detail-drawer');
  const detailCard = wrapper.querySelector('#badge-detail-card');
  const detailBackdrop = wrapper.querySelector('#badge-detail-backdrop');
  const badges = appState.player.badges || [];

  // Close modal on backdrop click
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) appState.closeModal();
  });
  closeBtn?.addEventListener('click', () => appState.closeModal());

  // Close badge detail drawer
  const closeDetail = () => {
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  };

  detailBackdrop?.addEventListener('click', closeDetail);

  // Badge click inspection
  const badgeCards = wrapper.querySelectorAll('.coll-badge-card[data-badge-id]');
  badgeCards.forEach(card => {
    card.addEventListener('click', () => {
      sound.playTap();
      const badgeId = card.dataset.badgeId;
      const b = badges.find(x => x.id === badgeId);
      if (!b || !detailCard || !drawer) return;

      detailCard.innerHTML = `
        <button type="button" class="badge-detail-close" id="badge-detail-close-btn" aria-label="Close details">✕</button>

        <div class="badge-detail-avatar-wrap">
          <span class="badge-detail-icon">${b.icon}</span>
          <div class="badge-detail-icon-glow ${b.unlocked ? 'glow-active' : ''}"></div>
        </div>

        <div class="badge-detail-num-tag">BADGE #${b.number}</div>
        <h3 class="badge-detail-name">${b.name}</h3>

        <div class="badge-detail-pills">
          <span class="coll-rarity-tag rarity-${b.rarity.toLowerCase()}">${b.rarity}</span>
          <span class="badge-detail-status-pill ${b.unlocked ? 'pill-unlocked' : 'pill-locked'}">
            ${b.unlocked ? '✨ Unlocked' : '🔒 Locked'}
          </span>
        </div>

        <div class="badge-detail-section">
          <span class="badge-detail-sec-title">UNLOCK CONDITION</span>
          <p class="badge-detail-cond">${b.condition}</p>
        </div>

        <div class="badge-detail-section">
          <span class="badge-detail-sec-title">PROGRESS & REWARD</span>
          <div class="badge-detail-row">
            <span class="badge-detail-prog">📊 ${b.progress}</span>
            <span class="badge-detail-xp">⭐ ${b.reward}</span>
          </div>
        </div>

        <div class="badge-detail-section">
          <span class="badge-detail-sec-title">EXPEDITION LORE</span>
          <p class="badge-detail-lore">${b.desc}</p>
        </div>

        ${b.unlockedAt ? `<div class="badge-detail-date">Unlocked on ${b.unlockedAt}</div>` : ''}

        <button type="button" class="badge-detail-ok-btn" id="badge-detail-ok">
          ${b.unlocked ? 'AWESOME' : 'GOT IT'}
        </button>
      `;

      detailCard.querySelector('#badge-detail-close-btn')?.addEventListener('click', closeDetail);
      detailCard.querySelector('#badge-detail-ok')?.addEventListener('click', closeDetail);

      drawer.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => drawer.classList.add('open'));
    });
  });
}
