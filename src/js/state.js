/* ==========================================================================
   GeoQuest Application State & Navigation Router
   Central reactive state store for Home Screen, Modals & Session
   ========================================================================== */

import { sound } from './audio.js';
import { mockPlayerData, mockLeaderboard, mockMailboxMessages } from './mockData.js';
import { subscribeRealtimeLeaderboard, updateUserXPInFirestore } from './authService.js';

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
    this.initRealtimeLeaderboard();
  }

  initRealtimeLeaderboard() {
    try {
      subscribeRealtimeLeaderboard((players) => {
        if (Array.isArray(players) && players.length > 0) {
          this.leaderboard.topPlayers = players;
          this.updateLeaderboardRank(this.player);
          this.notify('leaderboard_update', this.leaderboard);
        }
      });
    } catch (e) {
      console.warn("Real-time leaderboard init note:", e);
    }
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

  getRegisteredAccounts() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(window.localStorage.getItem('geoquest_registered_accounts') || '{}');
      }
    } catch (e) {}
    return {};
  }

  saveRegisteredAccount(account) {
    try {
      if (typeof window !== 'undefined' && window.localStorage && account) {
        const accounts = this.getRegisteredAccounts();
        const usernameKey = (account.username || 'Explorer').toLowerCase().trim();
        const existing = accounts[usernameKey] || {};
        const merged = { ...existing, ...account, lastLogin: new Date().toISOString() };
        accounts[usernameKey] = merged;
        if (account.email) {
          accounts[account.email.toLowerCase().trim()] = merged;
        }
        window.localStorage.setItem('geoquest_registered_accounts', JSON.stringify(accounts));
      }
    } catch (e) {}
  }

  initPlayerData() {
    if (this.userSession && this.userSession.username) {
      const s = this.userSession;
      return {
        ...mockPlayerData,
        ...s,
        username: s.username,
        level: s.level || 1,
        xp: s.xp || 0,
        nextLevelXp: s.nextLevelXp || 1000,
        title: s.title || 'Novice Cartographer',
        streak: s.streak || 1,
        stats: s.stats || { missionsCompleted: 0, relicsDiscovered: 0, countriesExplored: 0, totalDistanceKm: "0.0" },
        badges: s.badges || JSON.parse(JSON.stringify(mockPlayerData.badges)),
        completedMissions: s.completedMissions || [],
        isGuest: !!s.isGuest
      };
    }
    return JSON.parse(JSON.stringify(mockPlayerData));
  }

  generateUserMailbox(player) {
    const welcomeMail = {
      id: "mail-welcome",
      type: "Expedition Briefing",
      icon: "🧭",
      title: `Welcome to GeoQuest, ${player.username}!`,
      time: "Just now",
      preview: "Your journey across India's sacred heritage begins now.",
      content: `Welcome to GeoQuest, ${player.username}! Your mission is to explore legendary sites like the Konark Sun Temple, Taj Mahal, Ajanta Caves, and Kaziranga. Solve quizzes, explore in 3D, and visit physical sites to earn XP and unlock badges!`,
      unread: true
    };

    const mails = [welcomeMail];

    // If player has unlocked badges, add celebration mails
    (player.badges || []).filter(b => b.unlocked).forEach(b => {
      mails.push({
        id: `mail-badge-${b.id}`,
        type: "Badge Unlocked",
        icon: b.icon || "🏆",
        title: `Badge Unlocked: ${b.name}!`,
        time: b.unlockedAt || "Recent",
        preview: `You unlocked the ${b.name} badge! Reward: ${b.reward}`,
        content: `Congratulations Explorer! You have unlocked the ${b.name} badge. ${b.desc} ${b.reward} has been credited to your dossier.`,
        unread: false
      });
    });

    return mails;
  }

  updateLeaderboardRank(player) {
    const pXp = typeof player.xp === 'number' ? player.xp : 0;
    const pName = (player.username || '').toLowerCase().trim();
    const top = this.leaderboard.topPlayers || [];

    // Calculate real-time rank
    let userRank = 1;
    let foundInTop = false;

    for (let i = 0; i < top.length; i++) {
      if (top[i].name && top[i].name.toLowerCase().trim() === pName) {
        userRank = top[i].rank || (i + 1);
        foundInTop = true;
        break;
      }
    }

    if (!foundInTop) {
      userRank = 1;
      for (let i = 0; i < top.length; i++) {
        if (pXp >= top[i].xp) {
          userRank = i + 1;
          break;
        }
        userRank = i + 2;
      }
    }

    this.leaderboard.currentUserRank = {
      rank: userRank,
      name: player.username || "Explorer",
      level: player.level || 1,
      xp: pXp,
      badge: player.title || "Novice Cartographer"
    };
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
    this.player = {
      ...this.initPlayerData(),
      ...user,
      username: user.username || 'Explorer',
      level: user.level || 1,
      xp: typeof user.xp === 'number' ? user.xp : 0,
      nextLevelXp: user.nextLevelXp || 1000,
      title: user.title || (user.level > 3 ? "Senior Relic Hunter" : "Novice Cartographer"),
      streak: user.streak || 1,
      stats: user.stats || { missionsCompleted: 0, relicsDiscovered: 0, countriesExplored: 0, totalDistanceKm: "0.0" },
      badges: user.badges || JSON.parse(JSON.stringify(mockPlayerData.badges)),
      completedMissions: user.completedMissions || [],
      isGuest: !!user.isGuest
    };

    this.userSession = { ...this.player };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('geoquest_user_session', JSON.stringify(this.userSession));
      }
    } catch (e) {}

    this.mailbox = this.generateUserMailbox(this.player);
    this.updateLeaderboardRank(this.player);
    this.saveRegisteredAccount(this.player);
    
    // Sync to Firestore in real-time
    if (this.player.uid) {
      updateUserXPInFirestore(this.player.uid, this.player);
    }

    this.notify('user_change', this.player);
  }

  addXP(amount, reason = "") {
    this.player.xp = (this.player.xp || 0) + amount;
    
    // Level up calculation (Every 1000 XP)
    const newLevel = Math.floor(this.player.xp / 1000) + 1;
    if (newLevel > this.player.level) {
      this.player.level = newLevel;
      this.player.nextLevelXp = newLevel * 1000;
      this.player.title = newLevel >= 5 ? "Senior Relic Hunter" : (newLevel >= 3 ? "Master Cartographer" : "Explorer");
      sound.playChime();
      this.showToast(`🎉 LEVEL UP! You reached Level ${newLevel}!`, 'success', 4000);
    } else {
      this.showToast(`⭐ +${amount} XP earned! ${reason}`, 'success');
    }

    // Check badge condition (first mission completion)
    if (this.player.stats.missionsCompleted >= 2 && !this.player.badges[0].unlocked) {
      this.unlockBadge("b1");
    }

    this.setUser(this.player);
  }

  unlockBadge(badgeId) {
    const b = (this.player.badges || []).find(x => x.id === badgeId);
    if (b && !b.unlocked) {
      b.unlocked = true;
      b.unlockedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      sound.playChime();
      this.showToast(`🏆 BADGE UNLOCKED: ${b.name}!`, 'success', 4000);
      this.setUser(this.player);
    }
  }

  recordMissionCompletion(missionId, xpReward) {
    this.player.stats.missionsCompleted = (this.player.stats.missionsCompleted || 0) + 1;
    this.player.stats.relicsDiscovered = (this.player.stats.relicsDiscovered || 0) + 1;
    this.player.completedMissions.push({
      id: missionId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      xpEarned: xpReward
    });
    this.addXP(xpReward, "Mission Completed");
  }

  logout() {
    this.userSession = null;
    this.player = JSON.parse(JSON.stringify(mockPlayerData));
    this.mailbox = JSON.parse(JSON.stringify(mockMailboxMessages));
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
