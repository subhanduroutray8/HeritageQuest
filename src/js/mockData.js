/* ==========================================================================
   GeoQuest Centralized Mock Data
   Modular, pure frontend store ready for future Firestore integration
   ========================================================================== */

export const mockPlayerData = {
  username: "Explorer",
  title: "Novice Cartographer",
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  streak: 1,
  profilePicture: null,
  stats: {
    missionsCompleted: 0,
    relicsDiscovered: 0,
    countriesExplored: 0,
    totalDistanceKm: "0.0"
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
      progress: "0 / 2 Completed",
      unlocked: false,
      unlockedAt: null
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
      progress: "0 / 4 Completed",
      unlocked: false,
      unlockedAt: null
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
      progress: "0 / 4 Completed",
      unlocked: false,
      unlockedAt: null
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
      progress: "0 / 4 Discovered",
      unlocked: false,
      unlockedAt: null
    },
    {
      id: "b5",
      number: 5,
      name: "Grand Heritage Voyager",
      icon: "👑",
      rarity: "Legendary",
      condition: "Complete all heritage missions across India",
      desc: "The supreme crown of expedition. Awarded only to those who have set foot in every heritage corner of India.",
      reward: "+1,500 XP",
      progress: "0 / 4 Sites",
      unlocked: false,
      unlockedAt: null
    }
  ],
  completedMissions: []
};

export const mockLeaderboard = {
  topPlayers: [],
  currentUserRank: {
    rank: 1,
    name: "Explorer",
    level: 1,
    xp: 0,
    badge: "Novice Cartographer"
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
