/* ==========================================================================
   GeoQuest Application State & Navigation Router
   Central reactive state store for Home Screen, Modals & Session
   ========================================================================== */

import { sound } from './audio.js';
import { mockPlayerData, mockLeaderboard, mockMailboxMessages } from './mockData.js';

class StateManager {
  constructor() {
    this.currentScreen = 'splash';
    this.previousScreen = null;
    this.userSession = this.loadPersistedSession();
    this.player = this.initPlayerData();
    this.leaderboard = JSON.parse(JSON.stringify(mockLeaderboard));
    this.mailbox = JSON.parse(JSON.stringify(mockMailboxMessages));
    this.listeners = [];
    this.activeModal = null;
    this.deviceMode = 'ios';
    this.selectedHeritageSite = null;
    this.selectedGameMode = null;
  }

  loadPersistedSession() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('geoquest_user_session');
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      // Local storage not available
    }
    return null;
  }

  initPlayerData() {
    if (this.userSession && this.userSession.username) {
      return {
        ...mockPlayerData,
        username: this.userSession.username,
        isGuest: !!this.userSession.isGuest
      };
    }
    return { ...mockPlayerData };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data, this));
  }

  navigate(screenName, options = {}) {
    if (this.currentScreen === screenName && !options.force) return;
    this.previousScreen = this.currentScreen;
    this.currentScreen = screenName;
    sound.playTap();
    this.notify('navigation', { from: this.previousScreen, to: this.currentScreen, ...options });
  }

  setUser(user) {
    this.userSession = user;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('geoquest_user_session', JSON.stringify(user));
      }
    } catch (e) {}
    this.player = {
      ...this.player,
      username: user.username || 'Explorer',
      isGuest: !!user.isGuest
    };
    this.notify('user_change', user);
  }

  enterDevMode() {
    const devUser = {
      username: "DevExplorer",
      role: "Developer / Demo Mode",
      level: 5,
      isGuest: false,
      isDev: true
    };
    this.setUser(devUser);
    sound.playChime();
    this.showToast("⚡ Entered Developer / Demo Mode", "info");
    this.navigate('home');
  }

  logout() {
    this.userSession = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('geoquest_user_session');
      }
    } catch (e) {}
    this.navigate('login');
    this.showToast('You have returned to the expedition camp.', 'info');
  }

  openModal(modalName, data = {}) {
    this.activeModal = { name: modalName, data };
    sound.playTap();
    this.notify('modal_open', this.activeModal);
  }

  closeModal() {
    const closed = this.activeModal;
    this.activeModal = null;
    sound.playTap();
    this.notify('modal_close', closed);
  }

  setDeviceMode(mode) {
    this.deviceMode = mode;
    this.notify('device_change', mode);
  }

  setGameMode(mode) {
  this.selectedGameMode = mode;
  this.notify('game_mode_change', mode);
  }

  getUnreadMailCount() {
    return this.mailbox.filter(m => m.unread).length;
  }

  markMailAsRead(mailId) {
    const item = this.mailbox.find(m => m.id === mailId);
    if (item && item.unread) {
      item.unread = false;
      this.notify('mailbox_change', this.mailbox);
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Remove any existing toast
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast-bubble toast-${type}`;
    
    let icon = '📜';
    if (type === 'error') {
      icon = '⚠️';
      sound.playError();
    } else if (type === 'success') {
      icon = '✨';
      sound.playChime();
    } else {
      sound.playTap();
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'toastSlideUpOut 0.25s forwards';
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }
}

export const appState = new StateManager();
