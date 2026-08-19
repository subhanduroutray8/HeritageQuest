/* ==========================================================================
   Heritage Quest — Game Mode Selection Screen
   Virtual Mode with 4 Options: View 3D, Mission, Quiz, Arrange + AI Assistant
   ========================================================================== */

import { SVG_ICONS } from '../assets.js';
import { appState } from '../state.js';
import { sound } from '../audio.js';
import { HERITAGE_SITES } from '../heritageSites.js';

export function renderGameModeScreen(passedSite) {
  const site = passedSite || appState.selectedHeritageSite || HERITAGE_SITES[0];
  const root = document.createElement('div');
  root.className = 'screen-view gms anim-fade-in';
  root.id = 'game-mode-screen';

  // Complete 6-Question Serial Quiz Dataset
  const siteQuizzes = {
    taj_mahal: [
      {
        question: "Who commissioned the construction of the Taj Mahal?",
        options: ["Shah Jahan", "Akbar the Great", "Aurangzeb", "Babur"],
        correct: 0,
        fact: "Shah Jahan built the Taj Mahal in 1632 in memory of his favorite wife, Mumtaz Mahal."
      },
      {
        question: "The Taj Mahal is built primarily from which material?",
        options: ["White Makrana Marble", "Red Sandstone", "Black Granite", "Limestone"],
        correct: 0,
        fact: "The Taj Mahal is clad entirely in white Makrana marble from Rajasthan."
      },
      {
        question: "How long did the construction of the Taj Mahal take?",
        options: ["22 Years", "10 Years", "40 Years", "5 Years"],
        correct: 0,
        fact: "Over 20,000 artisans worked for 22 years (1632–1653) to complete the Taj Mahal."
      }
    ],
    ajanta_ellora: [
      {
        question: "What is the famous Kailasa Temple at Ellora notable for?",
        options: [
          "World's largest monolithic rock excavation",
          "Built entirely of white marble",
          "Tallest wooden pagoda in Asia",
          "Underground river waterway"
        ],
        correct: 0,
        fact: "Kailasa Temple (Cave 16) was carved top-down from a single massive basalt rock cliff!"
      },
      {
        question: "How many caves are there in the Ajanta complex?",
        options: ["30 Caves", "12 Caves", "50 Caves", "18 Caves"],
        correct: 0,
        fact: "There are 30 rock-cut caves at Ajanta featuring Buddhist murals and sculptures."
      },
      {
        question: "The Ajanta cave paintings depict stories from which religion?",
        options: ["Buddhism", "Hinduism", "Jainism", "Zoroastrianism"],
        correct: 0,
        fact: "The Ajanta murals primarily depict Jataka tales of Buddha's past lives."
      }
    ],
    sun_temple: [
      // Q1: General Trivia
      {
        question: "How many carved stone wheels act as sundials on the Konark Sun Temple?",
        options: ["24 Wheels", "12 Wheels", "8 Wheels", "36 Wheels"],
        correct: 0,
        fact: "The 24 wheels represent the 24 hours of a day and accurately calculate solar time!"
      },
      // Q2: Dynasty
      {
        question: "Which dynasty built the Konark Sun Temple?",
        options: ["Eastern Ganga Dynasty", "Maurya Empire", "Chola Dynasty", "Gupta Empire"],
        correct: 0,
        fact: "King Narasimhadeva I of the Eastern Ganga Dynasty commissioned the Sun Temple around 1250 CE."
      },
      // Q3: Monument Shape
      {
        question: "What animal forms the massive pulling chariot of the Konark Sun Temple?",
        options: ["Seven Horses", "Royal Elephants", "Golden Lions", "Sacred Oxen"],
        correct: 0,
        fact: "Seven galloping horses pull the chariot of the Sun God Surya, representing the days of the week."
      },
      // Q4: Odia Heritage Task 1 (Spokes)
      {
        question: "How many major spokes does each Konark sundial wheel have to calculate the 'Prahars' of the day?",
        localLanguageTerm: "ରଥ ଚକ (Ratha Chaka)",
        options: ["8 Major Spokes", "4 Major Spokes", "12 Major Spokes", "24 Major Spokes"],
        correct: 0,
        fact: "Each wheel has 8 major spokes dividing the day into 8 Prahars (3-hour intervals) with sub-spokes measuring minutes!",
        verifiedSource: "ASI Architectural Survey",
        sourceUrl: "https://asi.nic.in"
      },
      // Q5: Odia Heritage Task 2 (Natya Mandapa / Odissi)
      {
        question: "Which classical dance form's authentic poses and mudras are intricately carved across the Natya Mandapa?",
        localLanguageTerm: "ନାଟ୍ୟ ମଣ୍ଡପ (Natya Mandapa)",
        options: ["Odissi", "Bharatanatyam", "Kathak", "Kathakali"],
        correct: 0,
        fact: "The Natya Mandapa features 128 celestial dancers and musicians playing Mardala drums, forming the core of classical Odissi.",
        verifiedSource: "UNESCO World Heritage Ref #246",
        sourceUrl: "https://whc.unesco.org/en/list/246"
      },
      // Q6: Odia Heritage Task 3 (Gajasimha Sculpture)
      {
        question: "What philosophical meaning does the Gajasimha (Lion atop Elephant) sculpture at the entrance symbolize?",
        localLanguageTerm: "ଗଜସିଂହ (Gajasimha)",
        options: ["Power & Wisdom overcoming Pride/Ignorance", "Imperial Victory & Conquest", "Solar and Lunar Eclipse", "Harvest & Monsoon Blessings"],
        correct: 0,
        fact: "The Lion represents spiritual wisdom and strength subduing the Elephant of ego and ignorance.",
        verifiedSource: "UNESCO World Heritage Inventory #246",
        sourceUrl: "https://whc.unesco.org/en/list/246"
      }
    ],
    kaziranga: [
      {
        question: "Kaziranga National Park hosts two-thirds of the world's population of which animal?",
        options: ["Great One-Horned Rhinoceros", "Bengal Tiger", "Asian Elephant", "Snow Leopard"],
        correct: 0,
        fact: "Kaziranga is home to over 2,600 Great Indian One-Horned Rhinoceroses!"
      },
      {
        question: "In which Indian state is Kaziranga National Park located?",
        options: ["Assam", "West Bengal", "Meghalaya", "Arunachal Pradesh"],
        correct: 0,
        fact: "Kaziranga lies along the floodplains of the Brahmaputra River in Assam."
      },
      {
        question: "When was Kaziranga declared a UNESCO World Heritage Site?",
        options: ["1985", "1974", "2000", "1992"],
        correct: 0,
        fact: "Kaziranga was inscribed as a UNESCO World Heritage Site in 1985."
      }
    ]
  };

  const siteQuizList = siteQuizzes[site.id] || siteQuizzes.sun_temple;
  let currentQuizIndex = 0;
  let currentQuiz = siteQuizList[currentQuizIndex];

  // Arrange timeline milestones
  const siteArrangeData = {
    taj_mahal: [
      { id: '1', title: "Foundation & Wells", icon: "🧱" },
      { id: '2', title: "Main Mausoleum & Dome", icon: "🕌" },
      { id: '3', title: "Four Minarets & Gardens", icon: "🌳" },
      { id: '4', title: "UNESCO World Heritage", icon: "🏛️" }
    ],
    ajanta_ellora: [
      { id: '1', title: "Early Hinayana Caves", icon: "🪨" },
      { id: '2', title: "Mahayana Buddhist Murals", icon: "🎨" },
      { id: '3', title: "Kailasa Monolithic Temple", icon: "🏛️" },
      { id: '4', title: "UNESCO Inscription", icon: "📜" }
    ],
    sun_temple: [
      { id: '1', title: "Eastern Ganga Dynasty Rule", icon: "👑" },
      { id: '2', title: "24-Wheel Chariot Carving", icon: "☀️" },
      { id: '3', title: "European Mariners 'Black Pagoda'", icon: "⛵" },
      { id: '4', title: "Archaeological Restoration", icon: "⚒️" }
    ],
    kaziranga: [
      { id: '1', title: "Proposed Reserve Forest", icon: "🌿" },
      { id: '2', title: "Designated Game Sanctuary", icon: "🐾" },
      { id: '3', title: "Declared National Park", icon: "🦏" },
      { id: '4', title: "Tiger Reserve Status", icon: "🐅" }
    ]
  };

  const arrangeItems = siteArrangeData[site.id] || siteArrangeData.sun_temple;

  root.innerHTML = `
    <!-- Animated dark backdrop with particles -->
    <div class="gms-bg" aria-hidden="true"></div>
    <div class="gms-bg-glow" aria-hidden="true"></div>
    <div class="gms-particles" aria-hidden="true">
      ${Array.from({length:14},(_,i)=>`<span class="gp gp${i+1}"></span>`).join('')}
    </div>

    <!-- VIEW 1: MODE SELECTION (Virtual vs Physical) -->
    <div class="gms-view-container" id="view-mode-selection">
      <!-- Back Button -->
      <button class="gms-back-btn" id="gms-back-to-map" type="button" aria-label="Back to map">
        <span class="gms-back-ico" aria-hidden="true">${SVG_ICONS.back}</span>
        <span>Back to Map</span>
      </button>

      <!-- Site Identity Header -->
      <div class="gms-site-header">
        <div class="gms-site-icon-wrap">
          <span class="gms-site-icon">${site.icon}</span>
          <div class="gms-site-icon-ring" aria-hidden="true"></div>
        </div>
        <div class="gms-site-meta">
          <h1 class="gms-site-name">${site.name}</h1>
          <p class="gms-site-loc">📍 ${site.location}</p>
          <span class="gms-site-type-pill">${site.type}</span>
        </div>
      </div>

      <!-- Divider Question -->
      <div class="gms-question-wrap">
        <div class="gms-divider-line" aria-hidden="true"></div>
        <h2 class="gms-question">Choose Exploration Mode</h2>
        <div class="gms-divider-line" aria-hidden="true"></div>
      </div>

      <!-- Mode Cards -->
      <div class="gms-modes">

        <!-- VIRTUAL MODE CARD -->
        <button class="gms-mode-card gms-virtual" id="gms-btn-virtual-mode" type="button" aria-label="Choose Virtual Mode">
          <div class="gms-mode-bg-virtual" aria-hidden="true"></div>
          <div class="gms-mode-shimmer" aria-hidden="true"></div>

          <div class="gms-mode-icon-wrap">
            <span class="gms-mode-emoji" aria-hidden="true">🌐</span>
            <div class="gms-mode-icon-glow gms-virtual-glow" aria-hidden="true"></div>
          </div>

          <div class="gms-mode-content">
            <div class="gms-badge-row">
              <span class="gms-mode-badge gms-badge-virtual">VIRTUAL REALM</span>
              <span class="gms-pill-options-count">4 Options</span>
            </div>
            <h3 class="gms-mode-title">Virtual Mode</h3>
            <p class="gms-mode-desc">Explore 3D models, quests, quizzes, and artifact puzzles from anywhere.</p>
            <ul class="gms-mode-features">
              <li><span aria-hidden="true">🧊</span> View 3D &nbsp;•&nbsp; ⚔️ Mission</li>
              <li><span aria-hidden="true">❓</span> Quiz &nbsp;•&nbsp; 🧩 Arrange</li>
            </ul>
          </div>

          <div class="gms-mode-xp-tag">
            <span>⭐ +${site.xpReward} XP</span>
          </div>

          <div class="gms-mode-arrow" aria-hidden="true">›</div>
        </button>

        <!-- PHYSICAL MODE CARD -->
        <button class="gms-mode-card gms-physical" id="gms-btn-physical-mode" type="button" aria-label="Choose Physical Mode">
          <div class="gms-mode-bg-physical" aria-hidden="true"></div>
          <div class="gms-mode-shimmer" aria-hidden="true"></div>

          <div class="gms-mode-icon-wrap">
            <span class="gms-mode-emoji" aria-hidden="true">📍</span>
            <div class="gms-mode-icon-glow gms-physical-glow" aria-hidden="true"></div>
          </div>

          <div class="gms-mode-content">
            <span class="gms-mode-badge gms-badge-physical">PHYSICAL GPS</span>
            <h3 class="gms-mode-title">Physical Mode</h3>
            <p class="gms-mode-desc">Visit the actual site in the real world and unlock on-site geolocation AR treasures.</p>
            <ul class="gms-mode-features">
              <li><span aria-hidden="true">🗺️</span> Real-world GPS navigation</li>
              <li><span aria-hidden="true">🏅</span> 1.5x Bonus XP rewards</li>
            </ul>
          </div>

          <div class="gms-mode-xp-tag gms-physical-xp">
            <span>⭐ +${Math.round(site.xpReward * 1.5)} XP</span>
          </div>

          <div class="gms-mode-arrow" aria-hidden="true">›</div>
        </button>

      </div>

      <!-- Difficulty & Era Footer -->
      <div class="gms-footer-info">
        <div class="gms-info-chip">
          <span>⚔️</span>
          <span>${site.difficulty}</span>
        </div>
        <div class="gms-info-chip">
          <span>🏛️</span>
          <span>${site.era}</span>
        </div>
      </div>
    </div>

    <!-- VIEW 2: VIRTUAL MODE 4 OPTIONS (View 3D, Mission, Quiz, Arrange) -->
    <div class="gms-view-container gms-view-hidden" id="view-virtual-hub">
      <!-- Back Button to Modes -->
      <button class="gms-back-btn" id="gms-back-to-modes" type="button" aria-label="Back to Mode Selection">
        <span class="gms-back-ico" aria-hidden="true">${SVG_ICONS.back}</span>
        <span>Back to Modes</span>
      </button>

      <!-- Virtual Hub Header -->
      <div class="gms-virtual-header">
        <div class="gms-vh-meta">
          <div class="gms-vh-badge">🌐 VIRTUAL EXPLORATION</div>
          <h2 class="gms-vh-title">${site.name}</h2>
          <p class="gms-vh-sub">Choose an activity to begin your virtual expedition:</p>
        </div>
        <div class="gms-vh-icon">${site.icon}</div>
      </div>

      <!-- 4 OPTIONS GRID -->
      <div class="gms-voptions-grid">

        <!-- 1. VIEW 3D -->
        <button class="gms-vopt-card gms-vopt-3d" id="btn-opt-3d" type="button">
          <div class="vopt-glow" aria-hidden="true"></div>
          <div class="vopt-top">
            <div class="vopt-ico-box">🧊</div>
            <span class="vopt-pill">3D REALM</span>
          </div>
          <div class="vopt-main">
            <h3 class="vopt-title">View 3D</h3>
            <p class="vopt-desc">Interactive 360° monument exploration and architectural inspection.</p>
          </div>
          <div class="vopt-foot">
            <span class="vopt-xp">⭐ +150 XP</span>
            <span class="vopt-action-arrow">Explore ›</span>
          </div>
        </button>

        <!-- 2. MISSION (ORIGINAL STORY QUEST) -->
        <button class="gms-vopt-card gms-vopt-mission" id="btn-opt-mission" type="button">
          <div class="vopt-glow" aria-hidden="true"></div>
          <div class="vopt-top">
            <div class="vopt-ico-box">⚔️</div>
            <span class="vopt-pill vopt-pill-gold">QUEST</span>
          </div>
          <div class="vopt-main">
            <h3 class="vopt-title">Mission</h3>
            <p class="vopt-desc">Story quests, hidden lore discovery, and multi-stage objectives.</p>
          </div>
          <div class="vopt-foot">
            <span class="vopt-xp">⭐ +300 XP</span>
            <span class="vopt-action-arrow">Start ›</span>
          </div>
        </button>

        <!-- 3. QUIZ (6 SERIAL QUESTIONS) -->
        <button class="gms-vopt-card gms-vopt-quiz" id="btn-opt-quiz" type="button">
          <div class="vopt-glow" aria-hidden="true"></div>
          <div class="vopt-top">
            <div class="vopt-ico-box">❓</div>
            <span class="vopt-pill vopt-pill-amber">6 QUESTIONS</span>
          </div>
          <div class="vopt-main">
            <h3 class="vopt-title">Quiz</h3>
            <p class="vopt-desc">Test your historical knowledge, construction secrets, and Odia terms.</p>
          </div>
          <div class="vopt-foot">
            <span class="vopt-xp">⭐ +300 XP</span>
            <span class="vopt-action-arrow">Play ›</span>
          </div>
        </button>

        <!-- 4. ARRANGE -->
        <button class="gms-vopt-card gms-vopt-arrange" id="btn-opt-arrange" type="button">
          <div class="vopt-glow" aria-hidden="true"></div>
          <div class="vopt-top">
            <div class="vopt-ico-box">🧩</div>
            <span class="vopt-pill vopt-pill-emerald">PUZZLE</span>
          </div>
          <div class="vopt-main">
            <h3 class="vopt-title">Arrange</h3>
            <p class="vopt-desc">Reconstruct historical timeline relics & architectural layers in order.</p>
          </div>
          <div class="vopt-foot">
            <span class="vopt-xp">⭐ +250 XP</span>
            <span class="vopt-action-arrow">Solve ›</span>
          </div>
        </button>

      </div>

      <!-- Floating AI Button on Virtual Hub -->
      <button type="button" class="gms-ai-fab" id="btn-ai-hub" aria-label="Ask AI">
        <span class="gms-ai-fab-icon">🤖</span>
        <span class="gms-ai-fab-label">AI</span>
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════
         MODALS FOR THE 4 OPTIONS
    ═══════════════════════════════════════════════════ -->

    <!-- MODAL 1: VIEW 3D -->
    <div class="vmodal-backdrop" id="modal-opt-3d" aria-hidden="true">
      <div class="vmodal-sheet">
        <div class="vmodal-handle"></div>
        <div class="vmodal-header">
          <div class="vmodal-htitle-wrap">
            <span style="font-size:22px;">🧊</span>
            <div>
              <h3 class="vmodal-title">${site.name} — 3D Viewer</h3>
              <p class="vmodal-sub">Drag to rotate 360° • Inspect architecture</p>
            </div>
          </div>
          <button type="button" class="vmodal-close-btn" data-close="modal-opt-3d">✕</button>
        </div>

        <div class="vmodal-3d-stage">
          <div class="vmodal-3d-pedestal">
            <div class="vmodal-3d-monument-icon">${site.icon}</div>
            <div class="vmodal-3d-rune-ring"></div>
            <div class="vmodal-3d-base"></div>
          </div>
          <div class="vmodal-3d-controls-hint">
            <span>🔄 360° Interactive View Active</span>
          </div>
        </div>

        <div class="vmodal-3d-specs">
          <div class="vspec-chip">
            <span class="vspec-lbl">Architectural Era</span>
            <span class="vspec-val">${site.era}</span>
          </div>
          <div class="vspec-chip">
            <span class="vspec-lbl">Heritage Type</span>
            <span class="vspec-val">${site.type}</span>
          </div>
        </div>

        <button type="button" class="btn btn-gold" id="btn-complete-3d" style="height:46px; margin-top:10px; width:100%; border-radius:10px; background:linear-gradient(135deg,#d4af37,#f59e0b); font-weight:bold; cursor:pointer; color:#000;">
          CLAIM 150 XP & FINISH TOUR
        </button>
      </div>
    </div>

    <!-- MODAL 2: ORIGINAL MISSION MODAL -->
    <div class="vmodal-backdrop" id="modal-opt-mission" aria-hidden="true">
      <div class="vmodal-sheet">
        <div class="vmodal-handle"></div>
        <div class="vmodal-header">
          <div class="vmodal-htitle-wrap">
            <span style="font-size:22px;">⚔️</span>
            <div>
              <h3 class="vmodal-title">Mission: Secrets of ${site.name}</h3>
              <p class="vmodal-sub">Multi-stage expedition quest briefing</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button type="button" class="vmodal-ai-btn" data-context="mission" aria-label="Ask AI">🤖 AI</button>
            <button type="button" class="vmodal-close-btn" data-close="modal-opt-mission">✕</button>
          </div>
        </div>

        <div class="mission-brief-card">
          <p class="mission-brief-text">${site.description}</p>
        </div>

        <div class="mission-steps-list">
          <div class="mstep-item">
            <span class="mstep-num">1</span>
            <div class="mstep-info">
              <span class="mstep-title">Survey the Outer Perimeter & Gateways</span>
              <span class="mstep-desc">Inspect historical architectural boundaries and cardinal alignments.</span>
            </div>
            <span class="mstep-status">COMPLETED</span>
          </div>
          <div class="mstep-item active">
            <span class="mstep-num">2</span>
            <div class="mstep-info">
              <span class="mstep-title">Decipher Ancient Inscriptions & Lore</span>
              <span class="mstep-desc">Identify master builder symbols engraved upon the stone facets.</span>
            </div>
            <span class="mstep-status in-progress">IN PROGRESS</span>
          </div>
          <div class="mstep-item">
            <span class="mstep-num">3</span>
            <div class="mstep-info">
              <span class="mstep-title">Recover the Lost Heritage Relic Cache</span>
              <span class="mstep-desc">Unlock the final expedition vault and claim the cartographer badge.</span>
            </div>
            <span class="mstep-status locked">LOCKED</span>
          </div>
        </div>

        <button type="button" class="btn btn-gold" id="btn-start-mission" style="height:46px; margin-top:10px; width:100%; border-radius:10px; background:linear-gradient(135deg,#d4af37,#f59e0b); font-weight:bold; cursor:pointer; color:#000;">
          BEGIN MISSION QUEST (+300 XP)
        </button>
      </div>
    </div>

    <!-- MODAL 3: 6-PART SERIAL QUIZ -->
    <div class="vmodal-backdrop" id="modal-opt-quiz" aria-hidden="true">
      <div class="vmodal-sheet">
        <div class="vmodal-handle"></div>
        <div class="vmodal-header">
          <div class="vmodal-htitle-wrap">
            <span style="font-size:22px;">❓</span>
            <div>
              <h3 class="vmodal-title">${site.name} — Heritage Quiz</h3>
              <p class="vmodal-sub">6 Serial Questions • Earn 50 XP per question</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button type="button" class="vmodal-ai-btn" data-context="quiz" aria-label="Ask AI">🤖 AI</button>
            <button type="button" class="vmodal-close-btn" data-close="modal-opt-quiz">✕</button>
          </div>
        </div>

        <div class="quiz-container">
          <div class="quiz-question-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span class="quiz-badge" id="quiz-counter">QUESTION 1 OF ${siteQuizList.length}</span>
              <span id="quiz-score-badge" style="font-size:10px; color:#ffd700; font-weight:bold;">XP: 0</span>
            </div>
            <div id="quiz-odia-wrap" style="display:none; margin: 4px 0 8px 0; background:rgba(255,152,0,0.12); border-left:3px solid #ff9800; padding:4px 8px; border-radius:0 6px 6px 0;">
              <span style="color:#ffb74d; font-size:11px; font-weight:bold;">🏛️ Local Heritage Term:</span>
              <span id="quiz-odia-text" style="color:#fff; font-size:12px; font-weight:bold; margin-left:4px;"></span>
            </div>
            <p class="quiz-qtext" id="quiz-qtext">${currentQuiz.question}</p>
          </div>

          <div class="quiz-options-list" id="quiz-options-wrap">
            ${currentQuiz.options.map((opt, idx) => `
              <button type="button" class="quiz-opt-btn" data-idx="${idx}">
                <span class="qopt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="qopt-text">${opt}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box" id="quiz-feedback" style="display:none;"></div>

          <button type="button" class="btn btn-gold" id="quiz-next-btn" style="height:42px; margin-top:10px; display:none; width:100%; border-radius:10px; background:linear-gradient(135deg,#d4af37,#f59e0b); font-weight:bold; cursor:pointer; color:#000;">
            <span id="quiz-next-label">NEXT QUESTION →</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 4: ARRANGE -->
    <div class="vmodal-backdrop" id="modal-opt-arrange" aria-hidden="true">
      <div class="vmodal-sheet">
        <div class="vmodal-handle"></div>
        <div class="vmodal-header">
          <div class="vmodal-htitle-wrap">
            <span style="font-size:22px;">🧩</span>
            <div>
              <h3 class="vmodal-title">${site.name} — Arrange Timeline</h3>
              <p class="vmodal-sub">Tap tiles to sort milestones from earliest to latest</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button type="button" class="vmodal-ai-btn" data-context="arrange" aria-label="Ask AI">🤖 AI</button>
            <button type="button" class="vmodal-close-btn" data-close="modal-opt-arrange">✕</button>
          </div>
        </div>

        <div class="arrange-container">
          <p class="arrange-hint">Tap any two tiles to swap their positions into correct chronological sequence:</p>
          
          <div class="arrange-list" id="arrange-list">
            ${arrangeItems.map((item, idx) => `
              <div class="arrange-item" data-id="${item.id}" data-idx="${idx}">
                <span class="arrange-item-icon">${item.icon}</span>
                <div class="arrange-item-meta">
                  <span class="arrange-item-title">${item.title}</span>
                </div>
                <span class="arrange-swap-handle">⇅ Swap</span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-gold" id="btn-verify-arrange" style="height:46px; margin-top:12px; width:100%; border-radius:10px; background:linear-gradient(135deg,#d4af37,#f59e0b); font-weight:bold; cursor:pointer; color:#000;">
            VERIFY ARRANGEMENT (+250 XP)
          </button>
        </div>
      </div>
    </div>

    <!-- SHARED AI DRAWER MODAL -->
    <div class="vmodal-backdrop" id="modal-ai-drawer" aria-hidden="true">
      <div class="vmodal-sheet vmodal-ai-sheet">
        <div class="vmodal-handle"></div>
        <div class="vmodal-header">
          <div class="vmodal-htitle-wrap">
            <span style="font-size:20px;">🤖</span>
            <div>
              <h3 class="vmodal-title">Heritage AI Guide</h3>
              <p class="vmodal-sub" id="ai-drawer-sub">Your AI companion for ${site.name}</p>
            </div>
          </div>
          <button type="button" class="vmodal-close-btn" data-close="modal-ai-drawer">✕</button>
        </div>

        <div class="ai-chat-messages" id="ai-chat-messages"></div>

        <div class="ai-prompts-section">
          <span class="ai-prompts-lbl">SUGGESTED QUESTIONS</span>
          <div class="ai-drawer-chips" id="ai-drawer-chips"></div>
        </div>

        <form class="ai-input-bar" id="ai-chat-form" onsubmit="return false;">
          <input 
            type="text" 
            id="ai-chat-input" 
            class="ai-chat-input" 
            placeholder="Ask AI about ${site.name}..." 
            autocomplete="off"
            maxlength="200"
          />
          <button type="submit" id="ai-chat-send" class="ai-chat-send" aria-label="Send message">
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>

  `;

  /* ─── Styles ─── */
  const style = document.createElement('style');
  style.textContent = `
  .gms {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: calc(var(--safe-top,24px) + 12px) 14px calc(var(--safe-bottom,24px) + 16px) 14px;
    gap: 10px;
    box-sizing: border-box;
  }

  .vmodal-sheet { scrollbar-width: none; -ms-overflow-style: none; }
  .vmodal-sheet::-webkit-scrollbar { display: none; }

  .gms-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(30,24,16,.98) 0%, #090705 100%);
    z-index: 0;
  }
  .gms-bg-glow {
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, ${site.glowColor || 'rgba(212,175,55,0.4)'} 0%, transparent 70%);
    z-index: 1;
    animation: gmsBgGlow 3s ease-in-out infinite alternate;
  }
  @keyframes gmsBgGlow {
    from { opacity: .5; transform: translateX(-50%) scale(.9); }
    to   { opacity: 1;  transform: translateX(-50%) scale(1.1); }
  }

  .gms-particles { position:absolute; inset:0; z-index:2; pointer-events:none; }
  .gp {
    position: absolute;
    border-radius: 50%;
    background: ${site.glowColor || '#d4af37'};
    opacity: 0;
    animation: gpFloat linear infinite;
  }
  @keyframes gpFloat {
    0%   { opacity:0;   transform:translateY(0) scale(1); }
    10%  { opacity:.75; }
    90%  { opacity:.4; }
    100% { opacity:0;   transform:translateY(-75vh) scale(.3); }
  }
  .gp1  { width:4px; height:4px; left:8%;  bottom:15%; animation-duration:6s; }
  .gp2  { width:3px; height:3px; left:25%; bottom:10%; animation-duration:8s; }
  .gp3  { width:5px; height:5px; left:45%; bottom:20%; animation-duration:7s; }
  .gp4  { width:3px; height:3px; left:65%; bottom:18%; animation-duration:9s; }
  .gp5  { width:4px; height:4px; left:85%; bottom:12%; animation-duration:6.5s; }

  /* Views container */
  .gms-view-container {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    transition: opacity .25s ease, transform .25s ease;
  }
  .gms-view-hidden {
    display: none !important;
  }

  /* Back Button */
  .gms-back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    background: rgba(18,14,10,.85);
    border: 1px solid rgba(212,175,55,.3);
    border-radius: 8px;
    color: #ffd700;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    transition: all .16s ease;
    backdrop-filter: blur(8px);
  }
  .gms-back-btn:hover {
    border-color: #ffd700;
    background: rgba(26,20,14,.95);
  }
  .gms-back-ico { display:flex; width:14px; height:14px; }

  /* Site Header */
  .gms-site-header {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(14,11,8,.85);
    border: 1.5px solid rgba(212,175,55,.3);
    border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 6px 24px rgba(0,0,0,.7), inset 0 1px 0 rgba(212,175,55,.15);
    backdrop-filter: blur(12px);
  }
  .gms-site-icon-wrap {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gms-site-icon { font-size: 26px; line-height: 1; z-index: 2; }
  .gms-site-icon-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid ${site.glowColor || '#d4af37'};
    box-shadow: 0 0 14px ${site.glowColor || 'rgba(212,175,55,0.4)'};
  }
  .gms-site-meta { display:flex; flex-direction:column; gap:2px; min-width:0; }
  .gms-site-name {
    font-family: var(--font-serif);
    font-size: 16px;
    font-weight: 900;
    color: #ffd700;
    line-height: 1.1;
    margin: 0;
  }
  .gms-site-loc { font-size: 10px; color: #a0aec0; margin:0; }
  .gms-site-type-pill {
    display: inline-block;
    font-size: 7.5px;
    font-weight: 800;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: #ffd700;
    background: rgba(0,0,0,.4);
    border: 1px solid rgba(212,175,55,.4);
    border-radius: 4px;
    padding: 1px 5px;
    align-self: flex-start;
  }

  /* Question Divider */
  .gms-question-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .gms-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,.35), transparent);
  }
  .gms-question {
    font-family: var(--font-serif);
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #a0aec0;
    white-space: nowrap;
    margin: 0;
  }

  /* Mode Cards Container */
  .gms-modes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .gms-mode-card {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1.5px solid transparent;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  }
  .gms-mode-card:hover {
    transform: scale(1.01) translateY(-2px);
  }
  .gms-virtual {
    border-color: rgba(99,179,237,.45);
    box-shadow: 0 8px 32px rgba(0,0,0,.75), 0 0 24px rgba(99,179,237,.15);
  }
  .gms-virtual:hover {
    border-color: rgba(99,179,237,.85);
    box-shadow: 0 12px 40px rgba(0,0,0,.8), 0 0 32px rgba(99,179,237,.3);
  }
  .gms-mode-bg-virtual {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(10,15,35,.96) 0%, rgba(20,30,55,.94) 50%, rgba(8,12,28,.98) 100%);
    border-radius: 14px;
  }
  .gms-physical {
    border-color: rgba(212,175,55,.45);
    box-shadow: 0 8px 32px rgba(0,0,0,.75), 0 0 24px rgba(212,175,55,.12);
  }
  .gms-mode-bg-physical {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(20,14,4,.96) 0%, rgba(35,24,8,.94) 50%, rgba(16,10,3,.98) 100%);
    border-radius: 14px;
  }
  .gms-mode-shimmer {
    position: absolute;
    top: 0; left: 0;
    width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.05), transparent);
    animation: shimmerSweep 4s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes shimmerSweep {
    0%   { transform:translateX(-100%) skewX(-15deg); }
    50%,100% { transform:translateX(280%) skewX(-15deg); }
  }
  .gms-mode-icon-wrap {
    position: relative;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .gms-mode-emoji { font-size: 24px; line-height: 1; }
  .gms-mode-icon-glow { position: absolute; inset: -4px; border-radius: 50%; }
  .gms-virtual-glow  { background: radial-gradient(circle, rgba(99,179,237,.35) 0%, transparent 70%); }
  .gms-physical-glow { background: radial-gradient(circle, rgba(212,175,55,.35) 0%, transparent 70%); }

  .gms-mode-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 2;
    min-width: 0;
  }
  .gms-badge-row { display:flex; align-items:center; gap:6px; margin-bottom:2px; }
  .gms-mode-badge {
    display: inline-block;
    font-size: 7px;
    font-weight: 900;
    letter-spacing: 1px;
    border-radius: 3px;
    padding: 1px 4px;
  }
  .gms-badge-virtual  { background: rgba(99,179,237,.2); color: #90cdf4; border: 1px solid rgba(99,179,237,.5); }
  .gms-badge-physical { background: rgba(212,175,55,.2);  color: #ebd07b; border: 1px solid rgba(212,175,55,.5); }
  .gms-pill-options-count {
    font-size: 7.5px;
    font-weight: 800;
    color: #6ee7b7;
    background: rgba(16,185,129,.15);
    border: 1px solid rgba(16,185,129,.4);
    border-radius: 3px;
    padding: 1px 4px;
  }
  .gms-mode-title {
    font-family: var(--font-serif);
    font-size: 14px;
    font-weight: 900;
    color: #f5f0e6;
    margin: 0;
  }
  .gms-mode-desc { font-size: 9px; color: #a0aec0; line-height: 1.35; margin: 0; }
  .gms-mode-features {
    list-style: none;
    padding: 0;
    margin: 3px 0 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .gms-mode-features li { font-size: 8.5px; color: #a0aec0; }
  .gms-mode-xp-tag {
    position: absolute;
    top: 8px;
    right: 28px;
    font-size: 8.5px;
    font-weight: 800;
    color: #fae4a8;
    background: rgba(212,175,55,.18);
    border: 1px solid rgba(212,175,55,.4);
    border-radius: 4px;
    padding: 1px 5px;
    z-index: 2;
  }
  .gms-mode-arrow {
    font-size: 20px;
    color: rgba(255,255,255,.35);
    line-height: 1;
    flex-shrink: 0;
    z-index: 2;
  }

  .gms-footer-info {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }
  .gms-info-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(14,11,8,.75);
    border: 1px solid rgba(212,175,55,.22);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 8.5px;
    font-weight: 700;
    color: #a0aec0;
  }

  /* ═══════════════════════════════════════════════════
     VIEW 2: VIRTUAL EXPLORATION 4 OPTIONS HUB
  ═══════════════════════════════════════════════════ */
  .gms-virtual-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(16,24,48,.92) 0%, rgba(10,14,30,.95) 100%);
    border: 1.5px solid rgba(99,179,237,.35);
    border-radius: 12px;
    padding: 10px 12px;
    box-shadow: 0 4px 18px rgba(0,0,0,.6);
  }
  .gms-vh-badge {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #90cdf4;
  }
  .gms-vh-title {
    font-family: var(--font-serif);
    font-size: 15px;
    font-weight: 900;
    color: #f5f0e6;
    margin: 2px 0;
  }
  .gms-vh-sub {
    font-size: 9.5px;
    color: #a0aec0;
    margin: 0;
  }
  .gms-vh-icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  /* 4 Options Grid */
  .gms-voptions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }
  .gms-vopt-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;
    padding: 12px;
    background: rgba(18, 14, 10, 0.9);
    border: 1.5px solid rgba(212,175,55,.28);
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition: all .18s cubic-bezier(.34,1.56,.64,1);
    overflow: hidden;
  }
  .gms-vopt-card:hover {
    transform: translateY(-3px) scale(1.02);
    border-color: rgba(212,175,55,.7);
    box-shadow: 0 8px 24px rgba(0,0,0,.8), 0 0 16px rgba(212,175,55,.25);
  }
  .gms-vopt-card:active { transform: scale(.97); }

  .vopt-glow {
    position: absolute;
    top: -20px; right: -20px;
    width: 70px; height: 70px;
    border-radius: 50%;
    pointer-events: none;
  }
  .gms-vopt-3d .vopt-glow      { background: radial-gradient(circle, rgba(99,179,237,.3) 0%, transparent 70%); }
  .gms-vopt-mission .vopt-glow { background: radial-gradient(circle, rgba(212,175,55,.35) 0%, transparent 70%); }
  .gms-vopt-quiz .vopt-glow    { background: radial-gradient(circle, rgba(249,115,22,.3) 0%, transparent 70%); }
  .gms-vopt-arrange .vopt-glow { background: radial-gradient(circle, rgba(74,222,128,.3) 0%, transparent 70%); }

  .vopt-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 6px;
    position: relative;
    z-index: 2;
  }
  .vopt-ico-box {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.45);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 8px;
    font-size: 16px;
  }
  .vopt-pill {
    font-size: 7.5px;
    font-weight: 800;
    letter-spacing: .8px;
    color: #90cdf4;
    background: rgba(99,179,237,.15);
    border: 1px solid rgba(99,179,237,.4);
    border-radius: 3px;
    padding: 1px 4px;
  }
  .vopt-pill-gold { color:#fae4a8; background:rgba(212,175,55,.15); border-color:rgba(212,175,55,.4); }
  .vopt-pill-amber { color:#fbd38d; background:rgba(249,115,22,.15); border-color:rgba(249,115,22,.4); }
  .vopt-pill-emerald { color:#6ee7b7; background:rgba(74,222,128,.15); border-color:rgba(74,222,128,.4); }

  .vopt-main {
    display: flex;
    flex-direction: column;
    gap: 3px;
    position: relative;
    z-index: 2;
  }
  .vopt-title {
    font-family: var(--font-serif);
    font-size: 13px;
    font-weight: 900;
    color: #fae4a8;
    margin: 0;
  }
  .vopt-desc {
    font-size: 8.5px;
    color: #a09080;
    line-height: 1.35;
    margin: 0;
  }
  .vopt-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid rgba(255,255,255,.07);
    position: relative;
    z-index: 2;
  }
  .vopt-xp {
    font-size: 8px;
    font-weight: 800;
    color: #d4af37;
  }
  .vopt-action-arrow {
    font-size: 9px;
    font-weight: 800;
    color: #fae4a8;
  }

  /* ═══════════════════════════════════════════════════
     OPTION MODALS & DRAWERS
  ═══════════════════════════════════════════════════ */
  .vmodal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(2, 4, 10, 0.95);
    z-index: 100;
    backdrop-filter: blur(8px);
    display: none;
    align-items: flex-end;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s ease;
  }
  .vmodal-backdrop.open {
    display: flex;
    opacity: 1;
    pointer-events: auto;
  }
  .vmodal-sheet {
    width: 100%;
    max-width: 430px;
    max-height: 92vh;
    overflow-y: auto;
    background: linear-gradient(180deg, #181410 0%, #0d0a07 100%);
    border-top: 1.5px solid rgba(212, 175, 55, 0.45);
    border-radius: 20px 20px 0 0;
    padding: 12px 16px calc(var(--safe-bottom, 24px) + 14px) 16px;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.15);
    transform: translateY(100%);
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .vmodal-backdrop.open .vmodal-sheet {
    transform: translateY(0);
  }
  .vmodal-handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: rgba(212, 175, 55, 0.4);
    margin: 0 auto 12px auto;
  }
  .vmodal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .vmodal-htitle-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .vmodal-title {
    font-family: var(--font-serif);
    font-size: 14px;
    font-weight: 800;
    color: #fae4a8;
    margin: 0;
  }
  .vmodal-sub {
    font-size: 9px;
    color: #94a3b8;
    margin: 1px 0 0;
  }
  .vmodal-close-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(212,175,55,.3);
    background: rgba(255,255,255,.05);
    color: #e2e8f0;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 3D Stage in Modal */
  .vmodal-3d-stage {
    position: relative;
    width: 100%;
    height: 180px;
    background: radial-gradient(circle at 50% 50%, #1c1813 0%, #0a0806 100%);
    border: 1px solid rgba(212,175,55,.3);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  .vmodal-3d-pedestal {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .vmodal-3d-monument-icon {
    font-size: 64px;
    line-height: 1;
    animation: iconBob 3s ease-in-out infinite;
    filter: drop-shadow(0 0 16px rgba(212,175,55,.6));
    z-index: 2;
  }
  .vmodal-3d-rune-ring {
    width: 110px;
    height: 30px;
    border-radius: 50%;
    border: 1.5px dashed #d4af37;
    margin-top: -12px;
    animation: runeRingSpin 10s linear infinite;
  }
  @keyframes runeRingSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .vmodal-3d-base {
    width: 130px;
    height: 16px;
    background: linear-gradient(180deg, #2a2015, #14100b);
    border-radius: 50%;
    box-shadow: 0 0 16px rgba(212,175,55,.35);
    margin-top: -14px;
  }
  .vmodal-3d-controls-hint {
    position: absolute;
    bottom: 8px;
    background: rgba(0,0,0,.6);
    border: 1px solid rgba(212,175,55,.3);
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 8.5px;
    color: #fae4a8;
  }
  .vmodal-3d-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
  .vspec-chip {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(212,175,55,.2);
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .vspec-lbl { font-size: 8px; color: #8a7a68; text-transform: uppercase; font-weight: 800; }
  .vspec-val { font-size: 10px; color: #fae4a8; font-weight: 700; }

  /* Mission Modal Styles */
  .mission-brief-card {
    background: rgba(212,175,55,.08);
    border: 1px solid rgba(212,175,55,.25);
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 10px;
  }
  .mission-brief-text { font-size: 10px; color: #cbd5e1; line-height: 1.45; margin:0; }
  .mission-steps-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
  .mstep-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px;
    padding: 8px 10px;
  }
  .mstep-item.active {
    background: rgba(212,175,55,.08);
    border-color: rgba(212,175,55,.4);
  }
  .mstep-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #2a2217;
    border: 1px solid #d4af37;
    color: #fae4a8;
    font-size: 9.5px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mstep-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .mstep-title { font-size: 10px; font-weight: 700; color: #fae4a8; }
  .mstep-desc { font-size: 8.5px; color: #94a3b8; }
  .mstep-status {
    font-size: 7.5px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(82,183,136,.15);
    color: #6ee7b7;
    border: 1px solid rgba(82,183,136,.4);
  }
  .mstep-status.in-progress { background: rgba(212,175,55,.15); color: #fae4a8; border-color: rgba(212,175,55,.4); }
  .mstep-status.locked { background: rgba(255,255,255,.05); color: #64748b; border-color: rgba(255,255,255,.1); }

  /* Quiz Modal Styles */
  .quiz-container { display: flex; flex-direction: column; gap: 10px; }
  .quiz-question-box {
    background: rgba(212,175,55,.08);
    border: 1px solid rgba(212,175,55,.3);
    border-radius: 10px;
    padding: 10px 12px;
  }
  .quiz-badge { font-size: 8px; font-weight: 800; letter-spacing: 1px; color: #d4af37; }
  .quiz-qtext { font-size: 11.5px; font-weight: 700; color: #f5f0e6; margin: 4px 0 0; line-height: 1.4; }
  .quiz-options-list { display: flex; flex-direction: column; gap: 6px; }
  .quiz-opt-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(26,20,14,.85);
    border: 1px solid rgba(212,175,55,.25);
    border-radius: 8px;
    padding: 8px 12px;
    color: #e2e8f0;
    font-size: 10.5px;
    text-align: left;
    cursor: pointer;
    transition: all .15s ease;
  }
  .quiz-opt-btn:hover {
    border-color: #d4af37;
    background: rgba(40,30,20,.95);
    transform: translateX(3px);
  }
  .quiz-opt-btn.correct {
    background: rgba(16,185,129,.2);
    border-color: #10b981;
    color: #6ee7b7;
  }
  .quiz-opt-btn.wrong {
    background: rgba(239,68,68,.2);
    border-color: #ef4444;
    color: #fca5a5;
  }
  .qopt-letter {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(212,175,55,.15);
    border: 1px solid rgba(212,175,55,.4);
    color: #fae4a8;
    font-size: 9px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .quiz-feedback-box {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 9.5px;
    line-height: 1.4;
  }

  /* Arrange Modal Styles */
  .arrange-container { display: flex; flex-direction: column; gap: 8px; }
  .arrange-hint { font-size: 9.5px; color: #94a3b8; margin: 0; }
  .arrange-list { display: flex; flex-direction: column; gap: 6px; }
  .arrange-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(26,20,14,.9);
    border: 1px solid rgba(212,175,55,.28);
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all .15s ease;
  }
  .arrange-item.selected {
    border-color: #f59e0b;
    background: rgba(245,158,11,.15);
    transform: scale(1.02);
  }
  .arrange-item-icon { font-size: 18px; }
  .arrange-item-meta { flex: 1; display: flex; flex-direction: column; gap: 1px; }
  .arrange-item-title { font-size: 10.5px; font-weight: 700; color: #fae4a8; }
  .arrange-item-year { font-size: 8.5px; color: #94a3b8; }
  .arrange-swap-handle { font-size: 8px; font-weight: 800; color: #d4af37; background: rgba(212,175,55,.1); border: 1px solid rgba(212,175,55,.3); border-radius: 4px; padding: 2px 6px; }

  /* ═══════════════════════════════════════════════════
     AI FAB BUTTON (floating on Virtual Hub)
  ═══════════════════════════════════════════════════ */
  .gms-ai-fab {
    position: absolute;
    bottom: 18px;
    right: 14px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 13px 7px 10px;
    background: linear-gradient(135deg, rgba(30,20,5,.95) 0%, rgba(18,12,3,.98) 100%);
    border: 1.5px solid rgba(212,175,55,.6);
    border-radius: 24px;
    color: #fae4a8;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .5px;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(0,0,0,.7), 0 0 14px rgba(212,175,55,.25);
    transition: all .18s ease;
  }
  .gms-ai-fab:hover {
    transform: translateY(-2px) scale(1.04);
    border-color: #d4af37;
    box-shadow: 0 6px 24px rgba(0,0,0,.8), 0 0 20px rgba(212,175,55,.4);
  }
  .gms-ai-fab:active { transform: scale(.96); }
  .gms-ai-fab-icon { font-size: 15px; }
  .gms-ai-fab-label { font-size: 10px; font-weight: 900; letter-spacing: 1px; }

  /* AI button inside modal headers */
  .vmodal-ai-btn {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 4px 9px;
    background: rgba(212,175,55,.12);
    border: 1px solid rgba(212,175,55,.45);
    border-radius: 12px;
    color: #fae4a8;
    font-size: 9.5px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
    transition: all .15s ease;
  }
  .vmodal-ai-btn:hover {
    background: rgba(212,175,55,.22);
    border-color: #d4af37;
  }

  /* AI Drawer Sheet */
  .vmodal-ai-sheet {
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: calc(var(--safe-bottom, 24px) + 12px);
  }

  /* Chat Messages Container */
  .ai-chat-messages {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 220px;
    min-height: 120px;
    overflow-y: auto;
    padding: 6px 2px;
    scrollbar-width: none;
  }
  .ai-chat-messages::-webkit-scrollbar { display: none; }

  .ai-msg {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    animation: msgIn .2s ease-out;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ai-msg-user {
    flex-direction: row-reverse;
  }
  .ai-msg-bubble {
    max-width: 82%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 10.5px;
    line-height: 1.45;
  }
  .ai-msg-bot .ai-msg-bubble {
    background: rgba(26,20,14,.92);
    border: 1px solid rgba(212,175,55,.28);
    color: #f1e7d0;
    border-top-left-radius: 3px;
  }
  .ai-msg-user .ai-msg-bubble {
    background: linear-gradient(135deg, rgba(212,175,55,.3) 0%, rgba(245,158,11,.2) 100%);
    border: 1px solid rgba(212,175,55,.6);
    color: #fff9ea;
    border-top-right-radius: 3px;
  }
  .ai-msg-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    background: rgba(0,0,0,.45);
    border: 1px solid rgba(212,175,55,.35);
  }

  /* Typing animation */
  .ai-typing-dots {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 4px;
  }
  .ai-typing-dots span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #d4af37;
    animation: typingBlink 1.2s infinite ease-in-out;
  }
  .ai-typing-dots span:nth-child(2) { animation-delay: .2s; }
  .ai-typing-dots span:nth-child(3) { animation-delay: .4s; }
  @keyframes typingBlink {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1.2); opacity: 1; }
  }

  /* Suggested Prompts Section */
  .ai-prompts-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ai-prompts-lbl {
    font-size: 7.5px;
    font-weight: 800;
    letter-spacing: .8px;
    color: #94a3b8;
  }
  .ai-drawer-chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 3px;
    scrollbar-width: none;
  }
  .ai-drawer-chips::-webkit-scrollbar { display: none; }
  .ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    background: rgba(18,14,10,.85);
    border: 1px solid rgba(212,175,55,.25);
    border-radius: 14px;
    color: #e2d5b0;
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all .15s ease;
  }
  .ai-chip:hover {
    border-color: #d4af37;
    background: rgba(212,175,55,.15);
    color: #fae4a8;
  }
  .ai-chip-ico { font-size: 11px; }

  /* Input Slot / Bar */
  .ai-input-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(14,11,8,.95);
    border: 1.5px solid rgba(212,175,55,.45);
    border-radius: 12px;
    padding: 4px 6px 4px 12px;
    margin-top: 2px;
    transition: border-color .18s ease, box-shadow .18s ease;
  }
  .ai-input-bar:focus-within {
    border-color: #d4af37;
    box-shadow: 0 0 12px rgba(212,175,55,.3);
  }
  .ai-chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff9ea;
    font-size: 11px;
    font-family: inherit;
    padding: 6px 0;
  }
  .ai-chat-send {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
    color: #120e09;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .14s ease, opacity .14s ease;
    flex-shrink: 0;
  }
  .ai-chat-send:active {
    transform: scale(0.92);
  }
  `;
  root.appendChild(style);

  /* ─── DOM References & Logic ─── */
  const viewModeSelection = root.querySelector('#view-mode-selection');
  const viewVirtualHub = root.querySelector('#view-virtual-hub');

  // Navigation: Back to Map
  root.querySelector('#gms-back-to-map')?.addEventListener('click', () => {
    sound.playTap();
    appState.navigate('map');
  });

  // Navigation: Back from Virtual Hub to Mode Selection
  root.querySelector('#gms-back-to-modes')?.addEventListener('click', () => {
    sound.playTap();
    viewVirtualHub.classList.add('gms-view-hidden');
    viewModeSelection.classList.remove('gms-view-hidden');
  });

  // Clicking VIRTUAL MODE card -> opens Virtual Hub with the 4 options!
  root.querySelector('#gms-btn-virtual-mode')?.addEventListener('click', () => {
    sound.playChime();
    viewModeSelection.classList.add('gms-view-hidden');
    viewVirtualHub.classList.remove('gms-view-hidden');
  });

  // Clicking PHYSICAL MODE card
  root.querySelector('#gms-btn-physical-mode')?.addEventListener('click', () => {
    sound.playChime();
    appState.showToast(`📍 Physical expedition to ${site.name} launching soon! Get ready to travel!`, 'info');
  });

  // Modal helpers
  const openOptionModal = (modalId) => {
    sound.playTap();
    const modal = root.querySelector(`#${modalId}`);
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        modal.classList.add('open');
      });
    }
  };

  const closeOptionModal = (modalId) => {
    const modal = root.querySelector(`#${modalId}`);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        if (!modal.classList.contains('open')) {
          modal.style.display = 'none';
        }
      }, 280);
    }
  };

  // Wire close buttons & backdrop click
  root.querySelectorAll('.vmodal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      closeOptionModal(btn.dataset.close);
    });
  });

  root.querySelectorAll('.vmodal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeOptionModal(modal.id);
      }
    });
  });

  // Wire 4 Option Cards
  root.querySelector('#btn-opt-3d')?.addEventListener('click', () => openOptionModal('modal-opt-3d'));
  root.querySelector('#btn-opt-mission')?.addEventListener('click', () => openOptionModal('modal-opt-mission'));
  root.querySelector('#btn-opt-arrange')?.addEventListener('click', () => openOptionModal('modal-opt-arrange'));

  // Option 1: View 3D finish
  root.querySelector('#btn-complete-3d')?.addEventListener('click', () => {
    sound.playChime();
    closeOptionModal('modal-opt-3d');
    appState.showToast('✨ 3D Tour completed! +150 XP awarded!', 'success');
  });

  // Option 2: Mission start
  root.querySelector('#btn-start-mission')?.addEventListener('click', () => {
    sound.playChime();
    closeOptionModal('modal-opt-mission');
    appState.showToast(`⚔️ Mission started for ${site.name}! +300 XP unlocked upon completion!`, 'success');
  });

  // Option 3: Quiz logic (6 multi-questions)
  let quizScore = 0;
  const quizFeedback = root.querySelector('#quiz-feedback');
  const quizCounter = root.querySelector('#quiz-counter');
  const quizScoreBadge = root.querySelector('#quiz-score-badge');
  const quizOdiaWrap = root.querySelector('#quiz-odia-wrap');
  const quizOdiaText = root.querySelector('#quiz-odia-text');
  const quizQtext = root.querySelector('#quiz-qtext');
  const quizOptWrap = root.querySelector('#quiz-options-wrap');
  const quizNextBtn = root.querySelector('#quiz-next-btn');
  const quizNextLbl = root.querySelector('#quiz-next-label');

  const renderQuizQuestion = () => {
    currentQuiz = siteQuizList[currentQuizIndex];
    quizCounter.textContent = `QUESTION ${currentQuizIndex + 1} OF ${siteQuizList.length}`;
    if (quizScoreBadge) quizScoreBadge.textContent = `XP: +${quizScore}`;
    quizQtext.textContent = currentQuiz.question;

    if (currentQuiz.localLanguageTerm) {
      quizOdiaWrap.style.display = 'block';
      quizOdiaText.textContent = currentQuiz.localLanguageTerm;
    } else {
      quizOdiaWrap.style.display = 'none';
    }

    quizOptWrap.innerHTML = currentQuiz.options.map((opt, idx) => `
      <button type="button" class="quiz-opt-btn" data-idx="${idx}">
        <span class="qopt-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="qopt-text">${opt}</span>
      </button>
    `).join('');

    quizFeedback.style.display = 'none';
    quizNextBtn.style.display = 'none';

    quizOptWrap.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.idx, 10);
        const isCorrect = selectedIdx === currentQuiz.correct;

        quizOptWrap.querySelectorAll('.quiz-opt-btn').forEach(b => {
          b.disabled = true;
          const idx = parseInt(b.dataset.idx, 10);
          if (idx === currentQuiz.correct) b.classList.add('correct');
          else if (b === btn && !isCorrect) b.classList.add('wrong');
        });

        const citationHtml = currentQuiz.sourceUrl ? `
          <div style="margin-top:6px; font-size:9.5px; color:#888; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">
            📜 <em>Verified Source:</em> <strong>${currentQuiz.verifiedSource || 'ASI / UNESCO'}</strong>
            <a href="${currentQuiz.sourceUrl}" target="_blank" style="color:#38bdf8; margin-left:4px; text-decoration:underline;">[View Source]</a>
          </div>
        ` : '';

        if (isCorrect) {
          sound.playChime();
          quizScore += 50;
          if (quizScoreBadge) quizScoreBadge.textContent = `XP: +${quizScore}`;
          quizFeedback.style.display = 'block';
          quizFeedback.style.background = 'rgba(16,185,129,.15)';
          quizFeedback.style.border = '1px solid rgba(16,185,129,.4)';
          quizFeedback.style.color = '#6ee7b7';
          quizFeedback.innerHTML = `<strong>✨ Correct! (+50 XP)</strong><br>${currentQuiz.fact}${citationHtml}`;
        } else {
          sound.playTap();
          quizFeedback.style.display = 'block';
          quizFeedback.style.background = 'rgba(239,68,68,.15)';
          quizFeedback.style.border = '1px solid rgba(239,68,68,.4)';
          quizFeedback.style.color = '#fca5a5';
          quizFeedback.innerHTML = `<strong>❌ Not quite!</strong><br>${currentQuiz.fact}${citationHtml}`;
        }

        quizNextBtn.style.display = 'block';
        const isLast = currentQuizIndex >= siteQuizList.length - 1;
        quizNextLbl.textContent = isLast ? `FINISH 6-QUESTION QUIZ (+${quizScore} XP)` : 'NEXT QUESTION →';
      });
    });
  };

  quizNextBtn?.addEventListener('click', () => {
    sound.playTap();
    const isLast = currentQuizIndex >= siteQuizList.length - 1;
    if (isLast) {
      closeOptionModal('modal-opt-quiz');
      appState.showToast(`🎉 6-Part Quiz complete! Total +${quizScore} XP earned!`, 'success');
      currentQuizIndex = 0;
      quizScore = 0;
    } else {
      currentQuizIndex++;
      renderQuizQuestion();
    }
  });

  root.querySelector('#btn-opt-quiz')?.addEventListener('click', () => {
    currentQuizIndex = 0;
    quizScore = 0;
    renderQuizQuestion();
    openOptionModal('modal-opt-quiz');
  });

  // Option 4: Arrange Swap Logic
  let selectedTile = null;

  root.querySelectorAll('.arrange-item').forEach(item => {
    item.addEventListener('click', () => {
      sound.playTap();
      if (!selectedTile) {
        selectedTile = item;
        item.classList.add('selected');
      } else if (selectedTile === item) {
        selectedTile.classList.remove('selected');
        selectedTile = null;
      } else {
        const tempHTML = selectedTile.innerHTML;
        const tempId = selectedTile.dataset.id;
        
        selectedTile.innerHTML = item.innerHTML;
        selectedTile.dataset.id = item.dataset.id;
        
        item.innerHTML = tempHTML;
        item.dataset.id = tempId;

        selectedTile.classList.remove('selected');
        selectedTile = null;
      }
    });
  });

  root.querySelector('#btn-verify-arrange')?.addEventListener('click', () => {
    sound.playChime();
    closeOptionModal('modal-opt-arrange');
    appState.showToast('🧩 Timeline and relics successfully arranged! +250 XP earned!', 'success');
  });

  // ── AI PROMPTS DATA ──
  const aiPrompts = {
    hub: [
      { ico: '🏛️', text: `What is the history of ${site.name}?` },
      { ico: '🎨', text: `Describe the architecture of ${site.name}` },
      { ico: '📖', text: `What is the cultural significance of ${site.name}?` },
      { ico: '🌍', text: `Why was ${site.name} named a UNESCO site?` },
    ],
    mission: [
      { ico: '🗺️', text: `Give me a hint for surveying the outer perimeter of ${site.name}` },
      { ico: '🔍', text: `What kind of inscriptions exist at ${site.name}?` },
      { ico: '📜', text: `Tell me about the builder of ${site.name}` },
    ],
    quiz: [
      { ico: '💡', text: `Give me a clue about the 8 major spokes` },
      { ico: '📚', text: `What does the Gajasimha lion represent?` },
      { ico: '🏆', text: `What makes Konark wheels tell exact time?` },
    ],
    arrange: [
      { ico: '⏳', text: `Explain the timeline of construction of ${site.name}` },
      { ico: '🧱', text: `What were the major phases of ${site.name}'s history?` },
      { ico: '📅', text: `Which era is most important in ${site.name}'s story?` },
    ],
  };

  // ── AI KNOWLEDGE BASE FOR DYNAMIC CONVERSATION ──
  const getAIResponse = (query, currentContext) => {
    const q = query.toLowerCase().trim();

    if (site.id === 'taj_mahal') {
      if (q.includes('who') || q.includes('built') || q.includes('shah jahan') || q.includes('commission')) {
        return `The Taj Mahal was commissioned by the Mughal Emperor **Shah Jahan** in 1632 in memory of his beloved wife **Mumtaz Mahal**. Over 20,000 artisans contributed to its construction over 22 years!`;
      }
      if (q.includes('material') || q.includes('marble') || q.includes('stone')) {
        return `It is crafted from translucent **white Makrana marble** brought from Rajasthan, intricately inlaid with semi-precious stones (pietra dura) such as lapis lazuli, jade, and crystal.`;
      }
      if (q.includes('architecture') || q.includes('dome') || q.includes('minaret') || q.includes('design')) {
        return `The Taj Mahal features symmetrical Mughal architecture with a massive central onion dome (35m tall), four tilting minarets designed to fall outward in earthquakes, and Persian charbagh gardens!`;
      }
    } else if (site.id === 'sun_temple') {
      if (q.includes('wheel') || q.includes('sundial') || q.includes('time') || q.includes('chaka') || q.includes('spoke')) {
        return `The Konark Sun Temple features **24 intricately carved stone wheels (ରଥ ଚକ)**, which function as precise sundials. Each wheel has **8 major spokes** (representing 8 Prahars of the day) and sub-spokes for minute calculations!`;
      }
      if (q.includes('dance') || q.includes('natya') || q.includes('mandapa') || q.includes('odissi')) {
        return `The **Natya Mandapa (ନାଟ୍ୟ ମଣ୍ଡପ)** at Konark is carved with 128 celestial dancers and musicians playing Mardala drums, depicting the pure origins of classical **Odissi dance**!`;
      }
      if (q.includes('gajasimha') || q.includes('lion') || q.includes('elephant')) {
        return `The **Gajasimha (ଗଜସିଂହ)** motif portrays a lion atop an elephant, symbolizing spiritual wisdom and strength subduing ego and ignorance!`;
      }
      if (q.includes('who') || q.includes('built') || q.includes('dynasty') || q.includes('king')) {
        return `It was built in the 13th century (c. 1250 CE) by **King Narasimhadeva I** of the **Eastern Ganga Dynasty** in Odisha, dedicated to the Sun God Surya.`;
      }
      if (q.includes('architecture') || q.includes('black pagoda') || q.includes('chariot') || q.includes('horse')) {
        return `Designed as a colossal chariot with 12 pairs of wheels pulled by seven spirited stone horses, representing the days of the week. European sailors called it the *'Black Pagoda'* as a navigation landmark!`;
      }
    } else if (site.id === 'ajanta_ellora') {
      if (q.includes('kailasa') || q.includes('cave 16') || q.includes('monolith') || q.includes('rock')) {
        return `**Kailasa Temple (Cave 16)** at Ellora is the world's largest monolithic rock-cut structure! Carved top-to-bottom from a single basalt cliff face by Rashtrakuta artisans without building materials!`;
      }
      if (q.includes('ajanta') || q.includes('painting') || q.includes('mural') || q.includes('buddhis')) {
        return `Ajanta consists of 30 Buddhist rock-cut caves famous for vivid fresco-style murals illustrating the Jataka tales (previous lives of Gautama Buddha) dating back to the 2nd century BCE.`;
      }
    } else if (site.id === 'kaziranga') {
      if (q.includes('rhino') || q.includes('animal') || q.includes('wildlife') || q.includes('species')) {
        return `Kaziranga is famous for housing over **2,600 Great Indian One-Horned Rhinoceroses** — two-thirds of the total global population! It also hosts Bengal tigers, wild water buffaloes, and Asian elephants!`;
      }
      if (q.includes('location') || q.includes('assam') || q.includes('river') || q.includes('where')) {
        return `Kaziranga is located in the **Golaghat and Nagaon districts of Assam**, situated alongside the floodplains of the mighty Brahmaputra River.`;
      }
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Greetings Explorer! I am your AI Heritage Guide for **${site.name}**. Ask me about the history, architecture, mission tips, or quiz clues!`;
    }

    return `Fascinating question! **${site.name}** (${site.location}) is an architectural and historical treasure dating to the **${site.era}**. Feel free to ask about its construction, builder, mission quests, or timeline!`;
  };

  // ── Interactive Chat State & UI ──
  const chatMessages = root.querySelector('#ai-chat-messages');
  const chatInput = root.querySelector('#ai-chat-input');
  const chatForm = root.querySelector('#ai-chat-form');
  const chipsWrap = root.querySelector('#ai-drawer-chips');

  const appendChatMessage = (sender, htmlContent) => {
    if (!chatMessages) return;
    const msgEl = document.createElement('div');
    msgEl.className = `ai-msg ${sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`;
    msgEl.innerHTML = `
      <div class="ai-msg-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
      <div class="ai-msg-bubble">${htmlContent}</div>
    `;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const showTypingIndicator = () => {
    const typingEl = document.createElement('div');
    typingEl.id = 'ai-typing-indicator';
    typingEl.className = 'ai-msg ai-msg-bot';
    typingEl.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-bubble"><span class="ai-typing-dots"><span></span><span></span><span></span></span></div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingEl;
  };

  const handleUserSend = (text, context = 'hub') => {
    const userText = text.trim();
    if (!userText) return;

    sound.playTap();
    appendChatMessage('user', userText);

    if (chatInput) chatInput.value = '';

    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
      typingIndicator.remove();
      const botResponse = getAIResponse(userText, context);
      sound.playChime();
      appendChatMessage('bot', botResponse);
    }, 450);
  };

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput && chatInput.value.trim()) {
      handleUserSend(chatInput.value);
    }
  });

  root.querySelector('#ai-chat-send')?.addEventListener('click', () => {
    if (chatInput && chatInput.value.trim()) {
      handleUserSend(chatInput.value);
    }
  });

  const openAIDrawer = (context = 'hub') => {
    sound.playTap();

    const prompts = aiPrompts[context] || aiPrompts.hub;
    if (chipsWrap) {
      chipsWrap.innerHTML = prompts.map(p => `
        <button type="button" class="ai-chip" data-prompt="${p.text}">
          <span class="ai-chip-ico">${p.ico}</span>
          <span>${p.text}</span>
        </button>
      `).join('');

      chipsWrap.querySelectorAll('.ai-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const promptText = chip.dataset.prompt;
          handleUserSend(promptText, context);
        });
      });
    }

    if (chatMessages && chatMessages.children.length === 0) {
      appendChatMessage('bot', `Greetings Explorer! I am your AI Heritage Guide for **${site.name}**. Ask me any question, request clues for your activity, or tap a prompt! ✨`);
    }

    openOptionModal('modal-ai-drawer');

    setTimeout(() => {
      chatInput?.focus();
    }, 300);
  };

  root.querySelector('#btn-ai-hub')?.addEventListener('click', () => openAIDrawer('hub'));

  root.querySelectorAll('.vmodal-ai-btn').forEach(btn => {
    btn.addEventListener('click', () => openAIDrawer(btn.dataset.context || 'hub'));
  });

  root.querySelectorAll('[data-close="modal-ai-drawer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playTap();
      closeOptionModal('modal-ai-drawer');
    });
  });

  return root;
}