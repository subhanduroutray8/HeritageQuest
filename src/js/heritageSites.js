/* ==========================================================================
   GeoQuest — Heritage Sites Mock Data
   Updated coordinates matching the new vivid India map:
   1. Taj Mahal (Agra, Uttar Pradesh)
   2. Ajanta and Ellora Caves (Maharashtra)
   3. Sun Temple (Konark, Odisha)
   4. Kaziranga National Park (Assam)
   ========================================================================== */

export const HERITAGE_SITES = [
  {
    id: 'taj_mahal',
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    state: 'Uttar Pradesh',
    type: 'Cultural Heritage',
    era: '17th Century (1632–1653)',
    difficulty: 'Intermediate',
    xpReward: 450,
    icon: '🕌',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.75)',
    borderGlow: '#8b5cf6',
    themeClass: 'theme-purple',
    // Positions relative to new map container
    pinX: 40.5,
    pinY: 32.5,
    labelSide: 'right',
    description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river, built by Mughal emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal.',
    facts: [
      'UNESCO World Heritage Site since 1983',
      'Architectural masterpiece of Mughal symmetry',
      'Constructed over 22 years by 20,000 artisans'
    ]
  },
  {
    id: 'ajanta_ellora',
    name: 'Ajanta & Ellora Caves',
    shortName: 'Ajanta and Ellora Caves',
    location: 'Maharashtra',
    state: 'Maharashtra',
    type: 'Ancient Rock-Cut Heritage',
    era: '2nd Century BC – 6th Century AD',
    difficulty: 'Advanced',
    xpReward: 520,
    icon: '🏛️',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.75)',
    borderGlow: '#f59e0b',
    themeClass: 'theme-gold',
    pinX: 28.2,
    pinY: 51.5,
    labelSide: 'right',
    description: 'Ancient rock-cut cave monuments featuring monumental Buddhist, Hindu, and Jain shrines with extraordinary sculptures and murals carved directly into volcanic basalt rock cliffs.',
    facts: [
      'UNESCO double World Heritage Site',
      '34 monasteries & temples at Ellora, 29 caves at Ajanta',
      'Features Kailasa Temple, world’s largest monolithic rock excavation'
    ]
  },
  {
    id: 'sun_temple',
    name: 'Sun Temple',
    shortName: 'Sun Temple, Konark',
    location: 'Konark, Odisha',
    state: 'Konark, Odisha',
    type: 'Architectural Marvel',
    era: '13th Century (1250 CE)',
    difficulty: 'Intermediate',
    xpReward: 390,
    icon: '☀️',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.75)',
    borderGlow: '#ea580c',
    themeClass: 'theme-orange',
    pinX: 66.0,
    pinY: 51.0,
    labelSide: 'right',
    description: 'A colossal 13th-century stone chariot dedicated to the Sun God Surya, engineered with 24 intricately carved wheels functioning as precise sundials, pulled by seven stone horses.',
    facts: [
      'UNESCO World Heritage Site since 1984',
      'Known historically to ancient mariners as the "Black Pagoda"',
      'Built by King Narasimhadeva I of the Eastern Ganga Dynasty'
    ]
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    shortName: 'Kaziranga National Park',
    location: 'Assam',
    state: 'Assam',
    type: 'Natural Sanctuary',
    era: 'Established 1908',
    difficulty: 'Expert',
    xpReward: 580,
    icon: '🦏',
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.75)',
    borderGlow: '#22c55e',
    themeClass: 'theme-green',
    pinX: 77.0,
    pinY: 34.2,
    labelSide: 'left',
    description: 'A sanctuary in the Brahmaputra floodplain hosting two-thirds of the world’s great Indian one-horned rhinoceros population alongside wild elephants and royal Bengal tigers.',
    facts: [
      'UNESCO World Heritage Site since 1985',
      'World’s highest density of one-horned rhinoceroses (2,400+)',
      'Recognized as an Important Bird Area by BirdLife International'
    ]
  }
];
