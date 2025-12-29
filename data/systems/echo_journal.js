// =============================================================================
// GREY STRATUM — ECHO JOURNAL SYSTEM
// /data/systems/echo_journal.js
// =============================================================================
// Tracks player journey, provides hints, manages insights.
// Import and use via game state management.

// =============================================================================
// JOURNAL ENTRY TEMPLATES
// =============================================================================
// Entries are generated from these templates based on player choices

export const ENTRY_TEMPLATES = {
  // ─────────────────────────────────────────────────────────────────────────
  // PROLOGUE ENTRIES
  // ─────────────────────────────────────────────────────────────────────────
  'prologue-accept': {
    title: 'The Fall',
    content: 'Submitted to judgment. They saw compliance; I felt calculation.',
    category: 'reflection'
  },
  'prologue-demand': {
    title: 'The Fall',
    content: 'They fear what I carry. Even they don\'t fully understand it.',
    category: 'reflection'
  },
  'prologue-threaten': {
    title: 'The Fall',
    content: 'Made an enemy of the Spire. Good. Enemies are honest.',
    category: 'reflection'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACT 1 ENTRIES
  // ─────────────────────────────────────────────────────────────────────────
  'corso-meeting': {
    title: 'The Debt',
    content: 'Corso holds my debt. The Circuit runs on obligation. I\'ve learned its first lesson: everything is currency.',
    category: 'character'
  },
  'corso-hostile': {
    title: 'The Debt',
    content: 'Refused Corso\'s terms. The debt exists whether I acknowledge it or not. Now I\'m being watched.',
    category: 'character'
  },
  'corso-oracle-read': {
    title: 'The Debt',
    content: 'Saw Corso\'s Shade—pale grey, almost white. They were cast down too, once. Built themselves back through obligation. We understand each other now.',
    category: 'character'
  },

  // Job completion entries
  'escort-fight': {
    title: 'The Escort',
    content: 'Protected the cargo. The foreman seemed too pleased. Something about this job wasn\'t what it appeared.',
    category: 'event'
  },
  'escort-negotiate': {
    title: 'The Escort',
    content: 'A compromise. No blood. But I saw the foreman\'s face—I\'ve made an enemy.',
    category: 'event'
  },
  'escort-surrender': {
    title: 'The Escort',
    content: 'Let them have it. Some debts can\'t be measured in marks.',
    category: 'event'
  },
  'escort-assassinate': {
    title: 'The Escort',
    content: 'Clean and efficient. Harrow looked at me like I was one of them.',
    category: 'event'
  },
  'escort-sentinel': {
    title: 'The Escort',
    content: 'Stood between them. Sometimes protection is its own attack.',
    category: 'event'
  },

  'heist-file-only': {
    title: 'GREY-1',
    content: 'I was made. Designed. But by whom? And for what?',
    category: 'discovery'
  },
  'heist-everything': {
    title: 'The Temple',
    content: 'Took everything. Someone will pay for this information.',
    category: 'event'
  },
  'heist-delete': {
    title: 'Erasure',
    content: 'Deleted myself from their records. Maybe now they\'ll stop watching.',
    category: 'event'
  },
  'heist-oracle-vision': {
    title: 'The Core\'s Echo',
    content: 'Saw the Core. Something moves in the darkness. It\'s waiting.',
    category: 'discovery'
  },

  'collection-brutal': {
    title: 'The Collection',
    content: 'They looked at me like I was death. Maybe I am now.',
    category: 'event'
  },
  'collection-negotiate': {
    title: 'The Collection',
    content: 'Found a middle path. The Guild profits; Vasquez survives.',
    category: 'event'
  },
  'collection-mercy': {
    title: 'The Collection',
    content: 'Some prices aren\'t worth paying. Even when you\'re the one collecting.',
    category: 'event'
  },
  'collection-intel': {
    title: 'Grey Protocol',
    content: 'Made Vasquez betray someone else to save themselves. Mercy with teeth.',
    category: 'discovery'
  },
  'collection-pay': {
    title: 'The Collection',
    content: 'Paid for a stranger\'s grief. Not sure if I\'m generous or foolish.',
    category: 'event'
  },

  'package-complete': {
    title: 'The Package',
    content: 'Didn\'t ask questions. Maybe I should have.',
    category: 'event'
  },
  'package-astra-reveal': {
    title: 'Children of the Programme',
    content: 'Astra. Made like me. Running from the same architects. We\'re not alone.',
    category: 'discovery'
  },
  'package-oracle-future': {
    title: 'The Bridge',
    content: 'Saw Astra\'s future. They stand at the Core. A door that only opens for two Shades—theirs and mine.',
    category: 'discovery'
  }
};

// =============================================================================
// INSIGHT TEMPLATES
// =============================================================================
// Generated when player examines key items or discovers lore

export const INSIGHT_TEMPLATES = {
  'descent-records': {
    title: 'The Descent Manifest',
    content: 'The Descent Manifest listed six before me. All "resolved." What happens to those who come down but don\'t survive?',
    trigger: 'examine-descent-manifest'
  },
  'grey-1-origin': {
    title: 'GREY-1',
    content: 'The file calls me a "prototype." Implant origin: Core Research Division. Pre-Collapse. I\'m older than I remember.',
    trigger: 'discover-grey1'
  },
  'grey-protocol': {
    title: 'The Grey Protocol',
    content: 'The Spire is searching for something in the Abyss. Something from before. They call it the "Grey Protocol." And they\'re afraid of it.',
    trigger: 'learn-grey-protocol'
  },
  'shade-implant': {
    title: 'The Implant',
    content: 'The warmth behind my eyes isn\'t just technology. It\'s alive. It remembers things I don\'t.',
    trigger: 'examine-shade-deeply'
  },
  'benefactor-mystery': {
    title: 'The Benefactor',
    content: 'Someone in the Spire paid for my reception. Used a Spire cipher. Someone above still cares if I live. Why?',
    trigger: 'ask-corso-who-paid'
  }
};

// =============================================================================
// HINT SYSTEM
// =============================================================================
// Progressive hints for puzzles, triggered by idle time

export const HINTS = {
  'heist-navigation': {
    scene: 'scene-1-3b-heist',
    hints: [
      { delay: 30, text: 'The guards seem bored. Boredom breeds inattention...' },
      { delay: 60, text: 'Multiple paths here. Vents, bluffs, distractions...' },
      { delay: 90, text: 'The ration pack might make an interesting noise if thrown.' }
    ]
  },
  'grate-puzzle': {
    scene: 'grate-key-puzzle',
    hints: [
      { delay: 30, text: 'The key is just out of reach. If only I had something longer...' },
      { delay: 60, text: 'Sticky things adhere. Long things extend. Perhaps together...' },
      { delay: 90, text: 'Gum on wire. Reach extended. The key is snagable.' }
    ]
  },
  'tracker-detection': {
    scene: 'scene-1-3d-package',
    hints: [
      { delay: 30, text: 'Something about Astra feels... tracked. The Spire doesn\'t let assets go easily.' },
      { delay: 60, text: 'Their collar looks standard issue. But Spire standard issue often has extras.' },
      { delay: 90, text: 'A careful examination of the collar might reveal a beacon.' }
    ]
  }
};

// =============================================================================
// JOURNAL STATE MANAGER
// =============================================================================

export const createJournalState = () => ({
  entries: [],
  insights: [],
  currentHintScene: null,
  hintTimerStart: null,
  hintsShown: {}
});

export const addEntry = (journalState, templateId, customData = {}) => {
  const template = ENTRY_TEMPLATES[templateId];
  if (!template) {
    console.warn(`Unknown journal entry template: ${templateId}`);
    return journalState;
  }

  const entry = {
    id: `entry-${Date.now()}`,
    templateId,
    ...template,
    content: customData.content || template.content,
    timestamp: customData.timestamp || generateTimestamp(),
    shadeAtTime: customData.shade || 0
  };

  return {
    ...journalState,
    entries: [...journalState.entries, entry]
  };
};

export const addInsight = (journalState, insightId) => {
  const template = INSIGHT_TEMPLATES[insightId];
  if (!template) return journalState;
  if (journalState.insights.some(i => i.id === insightId)) return journalState;

  const insight = {
    id: insightId,
    ...template,
    discovered: generateTimestamp(),
    read: false
  };

  return {
    ...journalState,
    insights: [...journalState.insights, insight]
  };
};

export const getHint = (journalState, sceneId, elapsedSeconds) => {
  const hintConfig = HINTS[sceneId];
  if (!hintConfig) return null;

  const shownKey = `${sceneId}`;
  const alreadyShown = journalState.hintsShown[shownKey] || 0;

  for (let i = hintConfig.hints.length - 1; i >= 0; i--) {
    const hint = hintConfig.hints[i];
    if (elapsedSeconds >= hint.delay && i >= alreadyShown) {
      return {
        hint,
        hintIndex: i,
        updateState: {
          ...journalState,
          hintsShown: { ...journalState.hintsShown, [shownKey]: i + 1 }
        }
      };
    }
  }

  return null;
};

// =============================================================================
// HELPERS
// =============================================================================

const generateTimestamp = () => {
  // In-game date format: YYYY.MM.DD
  // Could be driven by game state; for now, static base + increment
  return '2847.03.15'; // Placeholder
};

export const getUnreadInsightsCount = (journalState) => {
  return journalState.insights.filter(i => !i.read).length;
};

export const markInsightRead = (journalState, insightId) => {
  return {
    ...journalState,
    insights: journalState.insights.map(i =>
      i.id === insightId ? { ...i, read: true } : i
    )
  };
};
