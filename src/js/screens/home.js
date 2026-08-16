/* ==========================================================================
   GeoQuest Screen 4: Temporary Adventure Home Screen
   "WELCOME TO GEOQUEST — Your adventure begins here."
   ========================================================================== */

import { SVG_ICONS } from '../assets.js';
import { appState } from '../state.js';
import { sound } from '../audio.js';

export function renderHomeScreen() {
  const container = document.createElement('div');
  container.className = 'screen-view home-screen anim-fade-in';
  container.id = 'home-screen';

  const user = appState.userSession || {
    username: 'Explorer_Guest',
    rank: 'Novice Wayfarer',
    level: 1,
    isGuest: true
  };

  container.innerHTML = `
    <div class="screen-content home-content">
      <!-- Top Explorer Bar -->
      <div class="home-top-bar">
        <div class="explorer-avatar anim-pulse-logo">
          ${SVG_ICONS.logoHero}
        </div>
        <div class="explorer-meta">
          <span class="explorer-title">${user.isGuest ? 'Guest Explorer' : 'Guild Explorer'}</span>
          <span class="explorer-name">${user.username}</span>
        </div>
        <button type="button" class="btn-logout" id="btn-home-logout" title="Exit Expedition">
          <span style="font-size:12px; font-weight:700;">EXIT</span>
        </button>
      </div>

      <!-- Hero Banner -->
      <div class="home-hero-card">
        <div class="hero-rune-badge">
          <span>LEVEL ${user.level}</span>
          <div class="badge-dot"></div>
          <span>${user.rank}</span>
        </div>
        <h2 class="home-hero-title">WELCOME TO GEOQUEST</h2>
        <p class="home-hero-sub">Your adventure begins here.</p>
        <div class="hero-divider"></div>
        <p class="hero-desc">
          Prepare your compass and boots. Ancient ruins, forgotten crypts, and hidden geocache relics await discovery across the realm.
        </p>
      </div>

      <!-- Quick Stats Grid -->
      <div class="home-stats-row">
        <div class="stat-card">
          <span class="stat-icon">🧭</span>
          <span class="stat-num">0</span>
          <span class="stat-label">Sites Explored</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏺</span>
          <span class="stat-num">0 / 12</span>
          <span class="stat-label">Relics Found</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <span class="stat-num">100 XP</span>
          <span class="stat-label">Renown</span>
        </div>
      </div>

      <!-- Quests Teaser Section -->
      <div class="quests-section">
        <div class="section-header">
          <span style="font-family:var(--font-serif); font-weight:700; color:var(--gold-400); font-size:14px; letter-spacing:1px;">
            AVAILABLE EXPEDITIONS
          </span>
          <span class="teaser-tag">PROTOTYPE</span>
        </div>

        <div class="quest-card" data-quest="petra">
          <div class="quest-rune">🏛️</div>
          <div class="quest-info">
            <span class="quest-title">Lost Library of Alexandria</span>
            <span class="quest-meta">Historic Site • 1.4 km away • 50 XP</span>
          </div>
          <button class="quest-action-btn" type="button">Track</button>
        </div>

        <div class="quest-card" data-quest="angkor">
          <div class="quest-rune">🗿</div>
          <div class="quest-info">
            <span class="quest-title">Sun Temple of the Solstice</span>
            <span class="quest-meta">Ancient Shrine • 3.8 km away • 120 XP</span>
          </div>
          <button class="quest-action-btn" type="button">Track</button>
        </div>
      </div>

      <!-- Bottom Action -->
      <div style="width:100%; margin-top:20px;">
        <button type="button" class="btn btn-secondary" id="btn-return-login" style="height:46px;">
          <span>Return to Portal</span>
        </button>
      </div>
    </div>
  `;

  // Scoped styling
  const style = document.createElement('style');
  style.textContent = `
    .home-content {
      padding-top: 10px;
      gap: 16px;
    }

    .home-top-bar {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(22, 19, 15, 0.7);
      border: 1px solid var(--gold-border);
      border-radius: var(--radius-md);
    }

    .explorer-avatar {
      width: 38px;
      height: 38px;
      flex-shrink: 0;
    }

    .explorer-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      text-align: left;
    }

    .explorer-title {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .explorer-name {
      font-size: 14.5px;
      font-weight: 700;
      color: var(--gold-300);
      font-family: var(--font-serif);
    }

    .btn-logout {
      padding: 6px 12px;
      background: rgba(231, 111, 81, 0.15);
      border: 1px solid rgba(231, 111, 81, 0.4);
      color: var(--text-danger);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .btn-logout:hover {
      background: rgba(231, 111, 81, 0.25);
    }

    .home-hero-card {
      width: 100%;
      background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.16) 0%, rgba(22, 19, 15, 0.9) 75%);
      border: 1px solid var(--gold-border);
      border-radius: var(--radius-lg);
      padding: 22px 18px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    .hero-rune-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: var(--radius-full);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--gold-400);
      margin-bottom: 12px;
    }

    .badge-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--gold-400);
    }

    .home-hero-title {
      font-family: var(--font-serif);
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--gold-300);
      text-transform: uppercase;
      text-shadow: 0 0 14px rgba(212, 175, 55, 0.4);
    }

    .home-hero-sub {
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .hero-divider {
      width: 50px;
      height: 1px;
      background: var(--gold-border);
      margin: 12px 0;
    }

    .hero-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .home-stats-row {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .stat-card {
      background: rgba(22, 19, 15, 0.7);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: var(--radius-md);
      padding: 12px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
    }

    .stat-icon {
      font-size: 18px;
    }

    .stat-num {
      font-family: var(--font-serif);
      font-size: 13.5px;
      font-weight: 700;
      color: var(--gold-300);
    }

    .stat-label {
      font-size: 10px;
      color: var(--text-muted);
    }

    .quests-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 4px;
    }

    .teaser-tag {
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 6px;
      background: rgba(212, 175, 55, 0.12);
      border-radius: 4px;
      color: var(--gold-400);
    }

    .quest-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(22, 19, 15, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      transition: all var(--transition-fast);
    }

    .quest-card:hover {
      border-color: var(--gold-400);
      background: rgba(30, 26, 20, 0.95);
    }

    .quest-rune {
      font-size: 22px;
      flex-shrink: 0;
    }

    .quest-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      gap: 2px;
    }

    .quest-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .quest-meta {
      font-size: 11px;
      color: var(--text-muted);
    }

    .quest-action-btn {
      padding: 6px 12px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid var(--gold-border);
      border-radius: var(--radius-full);
      color: var(--gold-400);
      font-size: 11.5px;
      font-weight: 700;
      transition: all var(--transition-fast);
    }

    .quest-action-btn:hover {
      background: var(--gold-500);
      color: #12100d;
    }
  `;
  container.appendChild(style);

  // Setup Event Listeners
  const logoutBtn = container.querySelector('#btn-home-logout');
  const returnBtn = container.querySelector('#btn-return-login');
  const trackBtns = container.querySelectorAll('.quest-action-btn');

  logoutBtn.addEventListener('click', () => appState.logout());
  returnBtn.addEventListener('click', () => appState.navigate('login'));

  trackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playChime();
      appState.showToast('Expedition waypoint locked! Ready for exploration.', 'info');
    });
  });

  return container;
}
