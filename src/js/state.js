/* ==========================================================================
   GeoQuest Application State & Navigation Router
   ========================================================================== */

import { sound } from './audio.js';

class StateManager {
  constructor() {
    this.currentScreen = 'splash';
    this.previousScreen = null;
    this.userSession = null;
    this.listeners = [];
    this.activeModal = null;
    this.deviceMode = 'ios'; // 'ios', 'android', 'fullscreen'
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
    this.notify('user_change', user);
  }

  logout() {
    this.userSession = null;
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
