/* ==========================================================================
   GeoQuest Centralized Mock Data
   Modular, pure frontend store ready for future Firestore integration
   ========================================================================== */

export const mockPlayerData = {
  username: "Explorer",
  title: "Senior Relic Hunter",
  level: 5,
  xp: 2450,
  nextLevelXp: 3000,
  streak: 7,
  profilePicture: null, // Uses vector emblem if null
  stats: {
    missionsCompleted: 14,
    relicsDiscovered: 8,
    countriesExplored: 6,
    totalDistanceKm: "42.8"
  },
  badges: [
    {
      id: "b1",
      number: 1,
      name: "Heritage Explorer",
      icon: "🧭",
      rarity: "Bronze",
      condition: "Discover your first 2 heritage sites",
      desc: "Awarded to daring explorers who embark upon the journey of uncovering India's legendary monuments.",
      reward: "+250 XP",
      progress: "2 / 2 Completed",
      unlocked: true,
      unlockedAt: "Aug 14, 2026"
    },
    {
      id: "b2",
      number: 2,
      name: "Monument Seeker",
      icon: "🏛️",
      rarity: "Silver",
      condition: "Discover 4 different heritage sites",
      desc: "Given to travelers who seek out sacred stones and marvels across multiple ancient provinces.",
      reward: "+500 XP",
      progress: "4 / 4 Completed",
      unlocked: true,
      unlockedAt: "Aug 16, 2026"
    },
    {
      id: "b3",
      number: 3,
      name: "India Uncovered",
      icon: "🗺️",
      rarity: "Gold",
      condition: "Explore heritage sites in 4 different states",
      desc: "Honors pioneers who have traversed borders across northern, western, eastern, and northeastern realms.",
      reward: "+750 XP",
      progress: "4 / 4 Completed",
      unlocked: true,
      unlockedAt: "Aug 17, 2026"
    },
    {
      id: "b4",
      number: 4,
      name: "Keeper of History",
      icon: "📜",
      rarity: "Mythic",
      condition: "Discover all heritage sites",
      desc: "An elite title reserved for masters who hold the keys and chronicles of every sacred site in the land.",
      reward: "+1,000 XP",
      progress: "4 / 5 Discovered",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "b5",
      number: 5,
      name: "Grand Heritage Voyager",
      icon: "👑",
      rarity: "Legendary",
      condition: "Discover heritage sites in all states where heritage sites are present",
      desc: "The supreme crown of expedition. Awarded only to those who have set foot in every heritage corner of India.",
      reward: "+1,500 XP",
      progress: "4 / 8 States",
      unlocked: false,
      unlockedAt: null
    }
  ],
  completedMissions: [
    {
      id: "m1",
      title: "Secrets of the Colosseum",
      region: "Rome, Italy",
      date: "Aug 12, 2026",
      xpEarned: 500,
      badgeReward: "🏛️"
    },
    {
      id: "m2",
      title: "Lost Library of Alexandria",
      region: "Alexandria, Egypt",
      date: "Aug 08, 2026",
      xpEarned: 750,
      badgeReward: "📜"
    },
    {
      id: "m3",
      title: "Canyon of the Crescent Moon",
      region: "Petra, Jordan",
      date: "Aug 02, 2026",
      xpEarned: 600,
      badgeReward: "🏰"
    }
  ]
};

export const mockLeaderboard = {
  topPlayers: [
    { rank: 1, name: "Arjun", level: 14, xp: 12450, badge: "👑 Grand Explorer", avatarColor: "#fae4a8" },
    { rank: 2, name: "Riya", level: 13, xp: 11820, badge: "⭐ Master Cartographer", avatarColor: "#e5c158" },
    { rank: 3, name: "Kabir", level: 12, xp: 10900, badge: "🔥 Trailblazer", avatarColor: "#df7d2a" },
    { rank: 4, name: "Ananya", level: 11, xp: 9850, badge: "🏛️ Relic Seeker", avatarColor: "#d4af37" },
    { rank: 5, name: "Rahul", level: 10, xp: 9200, badge: "🧭 Pathfinder", avatarColor: "#b89025" },
    { rank: 6, name: "Elena", level: 9, xp: 8700, badge: "📜 Scholar", avatarColor: "#9a7315" },
    { rank: 7, name: "Vikram", level: 8, xp: 8150, badge: "⚔️ Vanguard", avatarColor: "#8f6c18" },
    { rank: 8, name: "Mei Lin", level: 7, xp: 7600, badge: "🛡️ Guardian", avatarColor: "#735411" },
    { rank: 9, name: "Tariq", level: 6, xp: 6950, badge: "🏹 Scout", avatarColor: "#8c6b32" },
    { rank: 10, name: "Player", level: 6, xp: 6400, badge: "Novice", avatarColor: "#664d12" }
  ],
  currentUserRank: {
    rank: 27,
    name: "Explorer",
    level: 5,
    xp: 2450,
    badge: "Senior Relic Hunter"
  }
};

export const mockMailboxMessages = [
  {
    id: "mail-1",
    type: "New Heritage Mission",
    icon: "🏛️",
    title: "New Heritage Mission Available!",
    time: "Just now",
    preview: "Explore the Konark Sun Temple, Odisha and uncover its historical secrets.",
    content: "Explore the Konark Sun Temple, Odisha and uncover its historical secrets. Take on the ancient 13th-century chariot sundial trial and claim your expedition rewards.",
    unread: true
  },
  {
    id: "mail-2",
    type: "Badge Unlocked",
    icon: "🏆",
    title: "New Badge Unlocked: Monument Seeker!",
    time: "2h ago",
    preview: "You discovered your 4th heritage site. Your collection is growing!",
    content: "You discovered your 4th heritage site. Your collection is growing! The Monument Seeker badge has been unlocked in your Collection and +500 XP has been credited.",
    unread: true
  },
  {
    id: "mail-3",
    type: "New Region",
    icon: "🗺️",
    title: "New State Discovered!",
    time: "Yesterday",
    preview: "You've unlocked Rajasthan. New heritage sites are now available on your map.",
    content: "You've unlocked Rajasthan. New heritage sites, royal palaces, and historic desert forts are now available on your India Heritage Map.",
    unread: false
  },
  {
    id: "mail-4",
    type: "Exploration Streak",
    icon: "🔥",
    title: "Your 7-Day Exploration Streak is Active!",
    time: "2d ago",
    preview: "Keep exploring to maintain your streak and earn bonus XP.",
    content: "Your 7-Day Exploration Streak is active! Keep exploring daily to maintain your streak and earn bonus XP.",
    unread: false
  },
  {
    id: "mail-5",
    type: "Mission Completed",
    icon: "⭐",
    title: "Heritage Mission Completed!",
    time: "3d ago",
    preview: "You successfully completed the Taj Mahal Expedition and earned +250 XP.",
    content: "You successfully completed the Taj Mahal Expedition and earned +250 XP. Your discovery logs and explorer rank have been updated.",
    unread: false
  }
];
