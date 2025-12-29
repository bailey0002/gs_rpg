import React, { useState, useCallback, useEffect, useRef } from 'react';

// =============================================================================
// MODULAR IMPORTS
// =============================================================================
// These would be actual imports in your project:
// import { createInitialGameState, getCurrentNode, processChoice, advanceNarrative, ... } from './game_engine.js';
// import { ACT_1_NODES, getAvailableChoices } from './data/acts/act1_circuit.js';
// import { ITEMS, getItem } from './data/content/items.js';
// import { ENTRY_TEMPLATES, INSIGHT_TEMPLATES } from './data/systems/echo_journal.js';

// For now, we'll inline the critical parts to make this file self-contained for testing
// Once confirmed working, you can split back to imports

// =============================================================================
// CLASS DEFINITIONS (existing)
// =============================================================================

const CLASS_DEFS = {
  sentinel: { 
    name: 'Sentinel', 
    stats: { str: 2, thm: 2, rsv: 4, agi: 2 }, 
    derived: { ton: 12, ult: 8, mana: 6 },
    hp: 12, 
    traits: ['Bulwark', 'Guardian Sense'], 
    gear: ['pulse-shield', 'stun-baton'],
    shadeAffinity: 'white',
    description: 'Protectors who stand between danger and the innocent.'
  },
  voidStalker: { 
    name: 'Void Stalker', 
    stats: { str: 3, thm: 2, rsv: 2, agi: 3 }, 
    derived: { ton: 10, ult: 6, mana: 4 },
    hp: 10, 
    traits: ['Shadow Step', 'Lethal Strike'], 
    gear: ['mono-blade', 'smoke-charges'],
    shadeAffinity: 'black',
    description: 'Assassins who embrace the darkness within.'
  },
  oracle: { 
    name: 'Oracle', 
    stats: { str: 1, thm: 4, rsv: 3, agi: 2 }, 
    derived: { ton: 8, ult: 12, mana: 10 },
    hp: 8, 
    traits: ['Shade Sight', 'Prophecy'], 
    gear: ['focus-crystal', 'data-slate'],
    shadeAffinity: 'grey',
    description: 'Seers who read the threads of fate and Shade.'
  },
  vanguard: { 
    name: 'Vanguard', 
    stats: { str: 4, thm: 1, rsv: 3, agi: 2 }, 
    derived: { ton: 14, ult: 4, mana: 4 },
    hp: 14, 
    traits: ['Breach', 'Intimidate'], 
    gear: ['heavy-blade', 'combat-armor'],
    shadeAffinity: 'white',
    description: 'Warriors who lead the charge and break the line.'
  },
  infiltrator: { 
    name: 'Infiltrator', 
    stats: { str: 2, thm: 3, rsv: 2, agi: 3 }, 
    derived: { ton: 9, ult: 9, mana: 6 },
    hp: 9, 
    traits: ['Bypass', 'Social Engineering'], 
    gear: ['lock-picks', 'holo-mask'],
    shadeAffinity: 'grey',
    description: 'Specialists who go where others cannot.'
  }
};

// =============================================================================
// SHADE SYSTEM
// =============================================================================

const getShadeLabel = (shade) => {
  if (shade >= 8) return { label: 'Luminous', color: '#ffffff' };
  if (shade >= 5) return { label: 'Radiant', color: '#e0e0ff' };
  if (shade >= 2) return { label: 'Light', color: '#a0a0e0' };
  if (shade >= -1) return { label: 'Grey', color: '#808080' };
  if (shade >= -4) return { label: 'Dim', color: '#606060' };
  if (shade >= -7) return { label: 'Dark', color: '#404040' };
  return { label: 'Void', color: '#1a1a1a' };
};

const ShadeBar = ({ shade }) => {
  const { label, color } = getShadeLabel(shade);
  const position = ((shade + 10) / 20) * 100; // Convert -10..10 to 0..100%
  
  return (
    <div className="shade-container">
      <div className="shade-label">
        <span>SHADE</span>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="shade-track">
        <div className="shade-gradient" />
        <div 
          className="shade-marker" 
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="shade-ends">
        <span>Void</span>
        <span>Luminous</span>
      </div>
    </div>
  );
};

// =============================================================================
// ITEMS CATALOG (inlined from items.js)
// =============================================================================

const ITEMS = {
  'med-stim': {
    id: 'med-stim', name: 'Med-Stim', category: 'consumable',
    description: 'Emergency medical injection. Restores 8 HP.',
    examineText: 'A pressurized injector filled with blue synth-fluid.',
    effect: { type: 'heal', amount: 8 }, value: 50
  },
  'ration-pack': {
    id: 'ration-pack', name: 'Ration Pack', category: 'consumable',
    description: 'Compressed nutrients. Restores 2 HP.',
    examineText: 'Circuit-standard meal replacement. Tastes like regret.',
    effect: { type: 'heal', amount: 2 }, value: 20
  },
  'lock-bypass': {
    id: 'lock-bypass', name: 'Lock Bypass', category: 'consumable',
    description: 'Single-use electronic lockpick.',
    examineText: 'A disposable circuit that tricks basic locks.',
    value: 100
  },
  'descent-manifest': {
    id: 'descent-manifest', name: 'Descent Manifest', category: 'lore',
    description: 'A cargo list of the condemned.',
    examineText: 'Six names before yours, all marked "RESOLVED." Your name is seventh.'
  },
  'corso-debt-marker': {
    id: 'corso-debt-marker', name: 'Debt Marker', category: 'key',
    description: 'You owe the Broker\'s Guild.',
    examineText: 'A digital token representing your debt to Corso.'
  }
};

// =============================================================================
// ACT 1 STORY NODES (inlined from act1_circuit.js)
// =============================================================================

const STORY_NODES = {
  // PROLOGUE
  'prologue-tribunal': {
    type: 'narrative',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: `The Spire's light is absolute. It reveals everything—including guilt.

Three Adjudicators sit above you, faces hidden behind mirrored masks. Your reflection stares back, fractured across their judgment.

"Shade contamination," the central figure intones. "Unauthorized integration with proscribed technology. Penalty: Descent."

You don't remember the crime. But the Shade coiled at the base of your skull pulses—it remembers something.

The floor beneath you begins to descend.`,
    visibleItems: [
      { id: 'adjudicator-masks', name: 'Adjudicator\'s Masks', text: 'Perfect mirrors. You see yourself but not them. This is intentional.' },
      { id: 'shade-implant', name: 'The Shade Implant', text: 'A warmth behind your eyes. It\'s been there since you woke in custody. It feels... expectant.' },
      { id: 'restraints', name: 'Your Restraints', text: 'Magnetic locks. They\'ll release when you reach your designated Stratum.' }
    ],
    nextNodeId: 'prologue-response'
  },

  'prologue-response': {
    type: 'choice',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: 'The descent begins. You have one last moment to respond.',
    choices: [
      { id: 'accept', text: 'Accept in silence', shadeChange: 1, nextNodeId: 'prologue-descent', journalEntry: 'Submitted to judgment. They saw compliance; I felt calculation.' },
      { id: 'demand', text: 'Demand explanation', shadeChange: 0, nextNodeId: 'prologue-demand-response', journalEntry: 'They fear what I carry. Even they don\'t fully understand it.' },
      { id: 'threaten', text: 'Threaten retribution', shadeChange: -1, nextNodeId: 'prologue-descent', journalEntry: 'Made an enemy of the Spire. Good. Enemies are honest.' }
    ]
  },

  'prologue-demand-response': {
    type: 'narrative',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: `"What evidence? What 'proscribed technology'? I have the right to know."

The central Adjudicator pauses. For a moment, silence.

"Your implant itself is the evidence. It should not exist."

The words hang in the air as the floor continues its descent.`,
    nextNodeId: 'prologue-descent'
  },

  'prologue-descent': {
    type: 'narrative',
    location: 'DESCENT SHAFT',
    text: `The platform descends. Light fades to amber, then rust, then darkness relieved only by your Shade's faint pulse.

Hours pass. Or days. The distinction loses meaning in the dark.

When the platform finally stops, you smell recycled air and machine oil.

You've arrived in The Circuit.`,
    nextNodeId: 'circuit-arrival'
  },

  // SCENE 1.1: ARRIVAL
  'circuit-arrival': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `The platform locks into a receiving bay. Red emergency lights. The smell of recycled air and machine oil.

A figure waits—angular, patient. Their coat bears the sigil of the Broker's Guild: an open hand holding a closed eye.

"Another one from above," they say, not unkindly. "I am Corso. I've been paid to receive you. By whom, I'm not permitted to say."

They gesture to the hub beyond. "The Circuit runs on obligation. You now have one. To me."`,
    visibleItems: [
      { id: 'corso-sigil', name: 'Corso\'s Guild Sigil', text: 'The Broker\'s Guild. Neutral arbiters of trade. They honor contracts—but only contracts.' },
      { id: 'transit-terminal', name: 'Transit Hub Terminal', text: 'Locked. Requires authorization or bypass.' },
      { id: 'descent-manifest', name: 'Discarded Manifest', text: 'Lists recent "descents." Your name is seventh. The first six are crossed out.', canTake: true, itemId: 'descent-manifest' },
      { id: 'corso-satchel', name: 'Corso\'s Satchel', text: 'Medical supplies. Your supplies. They\'re already calculating your debt.' }
    ],
    nextNodeId: 'corso-response'
  },

  'corso-response': {
    type: 'choice',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: 'Corso waits for your response.',
    choices: [
      { id: 'grateful', text: '"Thank you. I\'ll repay this."', shadeChange: 1, nextNodeId: 'corso-grateful-response', consequence: { debt: 350, corsoRelation: 10 } },
      { id: 'question', text: '"Who paid for this? I need to know."', shadeChange: 0, nextNodeId: 'corso-question-response', consequence: { subplot: 'the-benefactor' } },
      { id: 'refuse', text: '"I didn\'t ask for this debt."', shadeChange: -1, nextNodeId: 'corso-refuse-response', consequence: { debt: 350, corsoRelation: -10 } },
      { id: 'oracle-read', text: '[ORACLE] Read Corso\'s Shade', classRequired: 'oracle', manaCost: 2, shadeChange: 0, nextNodeId: 'corso-oracle-response' }
    ]
  },

  'corso-grateful-response': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Corso nods. "Spoken correctly. Your debt is logged. 350 marks, including interest. I'll collect when you can pay."

They produce a small token—your debt marker.

"The Hub is through there. Work is available for those who look. Find me when you're ready to pay."`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-question-response': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `"The Guild's discretion is absolute." Corso pauses, considering. "But I can tell you this—they used a Spire cipher. Someone above still cares if you live."

Why would anyone in the Spire want you alive after casting you down?

"Make of that what you will. The Hub is through there."`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-refuse-response': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Corso's expression doesn't change. "The debt exists whether you acknowledge it or not. This is how the Circuit works."

They lean closer.

"Refuse, and I'll sell your location to the Spire Hunters instead. Your choice."

The debt marker appears in their hand.`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-oracle-response': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Your Shade flickers. You see Corso's—pale grey, almost white. They were once like you. Cast down. They built themselves back through the only currency that matters here: obligation.

"You see it," Corso says quietly. "Good. Then you understand."

There's something like kinship in their eyes now.

"The Hub is through there. And... if you need guidance, come to me. Not as debtor. As someone who knows the descent."`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  // SCENE 1.2: THE HUB
  'circuit-hub': {
    type: 'choice',
    location: 'THE CIRCUIT — TRADE HUB ALPHA',
    text: `The Circuit is alive. Cargo drones hum overhead. Merchants hawk modified tech, food paste, information. A massive display shows exchange rates—resources, favors, debts—all fluctuating in real time.

A notice board catches your eye. Job postings. The way to earn marks and pay debts.

Three paths diverge from the hub:

EAST — The Fabrication Yards. Workers emerge exhausted but employed.
NORTH — The Data Temples. Information brokers trade in secrets.
WEST — The Descent Shafts. The way down. Guarded, but not impassably so.`,
    visibleItems: [
      { id: 'exchange-board', name: 'Exchange Board', text: 'Labor: 15 marks/shift. Information: Variable. Shade Services: Unlisted but whispered.' },
      { id: 'street-vendor', name: 'Street Vendor', text: 'Basic supplies available.', isShop: true },
      { id: 'notice-board', name: 'Notice Board', text: 'Job postings. Opportunities and dangers.' }
    ],
    choices: [
      { id: 'job-escort', text: '[JOB] Cargo Security — 200 marks', nextNodeId: 'job-escort-start' },
      { id: 'job-heist', text: '[JOB] Data Extraction — 150 marks + intel', requirement: { stat: 'thm', min: 3 }, nextNodeId: 'job-heist-start' },
      { id: 'job-collection', text: '[JOB] Debt Collection — 100 marks', requirement: { stat: 'str', min: 3 }, nextNodeId: 'job-collection-start' },
      { id: 'job-package', text: '[JOB] Smuggle a Person — 300 marks', requirement: { stat: 'rsv', min: 3 }, nextNodeId: 'job-package-start' }
    ]
  },

  // JOB: ESCORT
  'job-escort-start': {
    type: 'narrative',
    location: 'FABRICATION YARDS — LOADING BAY',
    text: `The cargo is sealed containers—medical supplies, the foreman says. Destination: a Midway clinic. Three days through maintenance corridors.

Your fellow guards: Harrow (veteran, tired eyes, steady hands) and Pell (young, nervous, talks too much).

Day one: uneventful.

Day two: you hear them.`,
    nextNodeId: 'job-escort-raiders'
  },

  'job-escort-raiders': {
    type: 'choice',
    location: 'MAINTENANCE CORRIDOR — DAY 2',
    text: `Raiders. Murk-descended, by their patchwork gear. They block the corridor ahead.

"Medical supplies," their leader calls out. "We need them more than whatever clinic you're feeding. Give them up and walk away."`,
    visibleItems: [
      { id: 'raider-leader', name: 'Raider Leader', text: 'Scarred, but not cruel-looking. Desperate. A child\'s drawing is tucked into their belt.' },
      { id: 'harrow', name: 'Harrow\'s Stance', text: 'Ready to fight. This isn\'t their first escort.' },
      { id: 'pell', name: 'Pell\'s Hands', text: 'Shaking. They\'ve never seen real violence.' }
    ],
    choices: [
      { id: 'fight', text: 'Fight to protect the cargo', shadeChange: 2, nextNodeId: 'escort-combat' },
      { id: 'negotiate', text: 'Negotiate a split', requirement: { stat: 'thm', min: 3 }, shadeChange: 0, nextNodeId: 'escort-negotiate' },
      { id: 'surrender', text: 'Let them take it', shadeChange: -1, nextNodeId: 'escort-surrender' },
      { id: 'assassinate', text: '[VOID STALKER] Eliminate the leader', classRequired: 'voidStalker', shadeChange: -3, nextNodeId: 'escort-assassinate' },
      { id: 'shield', text: '[SENTINEL] Shield Pell and hold the line', classRequired: 'sentinel', manaCost: 2, shadeChange: 3, nextNodeId: 'escort-sentinel' }
    ]
  },

  'escort-combat': {
    type: 'combat',
    location: 'MAINTENANCE CORRIDOR — COMBAT',
    text: `You and Harrow move forward. The raiders are desperate but outmatched.`,
    enemy: { name: 'Murk Raiders (3)', hp: 15, str: 2, def: 1 },
    victoryNodeId: 'escort-combat-victory',
    defeatNodeId: 'escort-combat-defeat',
    fleeNodeId: 'escort-surrender',
    victoryXp: 25
  },

  'escort-combat-victory': {
    type: 'reward',
    location: 'MAINTENANCE CORRIDOR — AFTERMATH',
    text: `The raiders fall. Harrow wipes their blade, expressionless. Pell stares at the bodies, pale.

The cargo is safe. The job continues.

But you notice Pell's eyes have changed. Something innocent died here.`,
    rewards: [{ type: 'marks', amount: 200 }, { type: 'xp', amount: 25 }],
    nextNodeId: 'circuit-hub-return'
  },

  'escort-combat-defeat': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — DEFEAT',
    text: `You fall. The raiders take everything.

Harrow drags you back to the hub. The job is failed. Corso will hear.`,
    nextNodeId: 'circuit-hub-return'
  },

  'escort-negotiate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — NEGOTIATION',
    text: `"Half the medical supplies. You keep the antibiotics, we keep the experimental stuff. Everyone walks."

The raider leader considers. Then nods.

"Fair enough. We remember this."

Harrow looks at you with something like approval. Pell exhales.`,
    rewards: [{ type: 'marks', amount: 100 }, { type: 'xp', amount: 20 }],
    nextNodeId: 'circuit-hub-return'
  },

  'escort-surrender': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — SURRENDER',
    text: `"Harrow, stand down. It's just cargo."

Harrow looks at you, then at Pell. Slowly lowers their weapon.

The raiders take everything. Their leader nods—almost grateful.

"We won't forget this."

You return empty-handed. Corso will hear.`,
    consequence: { debt: 50 },
    nextNodeId: 'circuit-hub-return'
  },

  'escort-assassinate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — SHADOWS',
    text: `You slip into shadow. The leader's companions don't see you until it's too late. One precise strike.

The others flee. Harrow stares at you.

"Who are you?"

The cargo is safe. The bonus is significant. But Harrow keeps their distance now.`,
    rewards: [{ type: 'marks', amount: 250 }, { type: 'xp', amount: 30 }],
    nextNodeId: 'circuit-hub-return'
  },

  'escort-sentinel': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — THE WALL',
    text: `You activate Bulwark. Your Shade extends, solidifying into a barrier of force.

"Pell, behind me. Harrow, flank left."

The raiders hesitate. This isn't a fight—it's a wall. They didn't come here to die.

One by one, they lower their weapons and back away.

No blood. The cargo is safe. And Pell looks at you like you're something more than human.`,
    rewards: [{ type: 'marks', amount: 200 }, { type: 'xp', amount: 30 }],
    nextNodeId: 'circuit-hub-return'
  },

  // PLACEHOLDER NODES for other jobs
  'job-heist-start': {
    type: 'narrative',
    location: 'DATA TEMPLES — ENTRANCE',
    text: `[Data Extraction job path - Coming in next update]

The Temple looms before you, its walls covered in flowing data streams...`,
    nextNodeId: 'circuit-hub-return'
  },

  'job-collection-start': {
    type: 'narrative',
    location: 'LOWER CIRCUIT — DEBT DISTRICT',
    text: `[Debt Collection job path - Coming in next update]

The address leads to a cramped hab-block...`,
    nextNodeId: 'circuit-hub-return'
  },

  'job-package-start': {
    type: 'narrative',
    location: 'THE CIRCUIT — ANONYMOUS MEET',
    text: `[Package job path - Coming in next update]

The contact is waiting in the shadows...`,
    nextNodeId: 'circuit-hub-return'
  },

  // HUB RETURN
  'circuit-hub-return': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRADE HUB ALPHA',
    text: `You return to the Hub. The job is done—whatever form that took.

Corso finds you, as they always do.

"You've seen what the Circuit is now. Labor, secrets, and violence dressed in commerce. You can stay here, grind marks, pay your debts slowly."

They lean closer.

"Or you can go deeper. The Midway awaits."`,
    nextNodeId: 'descent-decision'
  },

  // DESCENT DECISION
  'descent-decision': {
    type: 'choice',
    location: 'THE CIRCUIT — DESCENT SHAFTS',
    text: `The shafts plunge into darkness. Makeshift elevators run on stolen power.

Corso stands at the threshold.

"I've met one person who came back from the Abyss. They couldn't speak anymore. But they smiled. Like they'd seen something beautiful."

Your Shade pulses. It wants to go down.`,
    choices: [
      { id: 'stay', text: 'Stay in the Circuit (End Act 1)', requirement: { marks: 350 }, nextNodeId: 'act1-survivor-ending' },
      { id: 'truth', text: '"I need to know what I am."', shadeChange: 1, nextNodeId: 'act1-descent-transition' },
      { id: 'vengeance', text: '"The Spire made a mistake."', shadeChange: -1, nextNodeId: 'act1-descent-transition' }
    ]
  },

  'act1-survivor-ending': {
    type: 'outcome',
    location: 'THE CIRCUIT — YOUR NEW HOME',
    text: `You transfer the marks. Corso nods.

"Smart. Boring, but smart. Good luck, Shifter."

You live in the Circuit for years. You never learn the truth about your implant, the Core, or your purpose. But you survive.

Some descents end in survival. Not all stories need to reach the bottom.`,
    outcome: 'early-ending',
    xpAwarded: 50
  },

  'act1-descent-transition': {
    type: 'outcome',
    location: 'DESCENT SHAFT',
    text: `The elevator groans as it descends. Light fades.

When it stops, you emerge into a cavern the size of a cathedral. Refugee camps and diplomatic pavilions crowd together.

Welcome to the Midway.

ACT 1 COMPLETE — The Circuit

Your choices have shaped who you're becoming. The Midway will test that further.`,
    outcome: 'act-complete',
    xpAwarded: 100
  }
};

// =============================================================================
// SVG CHARACTER CREATOR (existing - abbreviated for space)
// =============================================================================

const createSVGCharacter = (config) => {
  const { colors } = config;
  
  const backgrounds = {
    'corridor': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:#0a0a15"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><path d="M0 50 L80 100 L80 350 L0 400" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.3"/><path d="M320 50 L240 100 L240 350 L320 400" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.3"/>`,
    'station': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#12122a"/><stop offset="100%" style="stop-color:#1a0a1a"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><rect x="20" y="30" width="80" height="60" rx="5" fill="#000010" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>`,
    'space': `<rect width="320" height="400" fill="#050510"/><circle cx="30" cy="40" r="1" fill="white" opacity="0.8"/><circle cx="80" cy="70" r="1.5" fill="white" opacity="0.6"/><circle cx="150" cy="30" r="1" fill="white" opacity="0.9"/>`,
    'planet': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#1a0a2e"/><stop offset="60%" style="stop-color:#2a1a3e"/><stop offset="100%" style="stop-color:#3a2520"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/>`,
    'abstract': `<rect width="320" height="400" fill="#0a0a15"/><polygon points="0,0 100,0 50,80" fill="${colors.accent}" opacity="0.1"/>`
  };

  const bodyBase = `<rect x="145" y="180" width="30" height="25" fill="${colors.skin}"/><path d="M100 205 L105 320 L215 320 L220 205 Q160 195 100 205" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/>`;
  const faceBase = `<ellipse cx="160" cy="120" rx="45" ry="55" fill="${colors.skin}"/><ellipse cx="145" cy="110" rx="8" ry="5" fill="${colors.eyes}"/><ellipse cx="175" cy="110" rx="8" ry="5" fill="${colors.eyes}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400">${backgrounds[config.background] || backgrounds.corridor}${bodyBase}${faceBase}</svg>`;
};

// =============================================================================
// ECHO JOURNAL COMPONENT
// =============================================================================

const EchoJournal = ({ entries, insights, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('entries');
  
  if (!isOpen) return null;
  
  return (
    <div className="journal-overlay">
      <div className="journal-panel">
        <div className="journal-header">
          <h2>◈ ECHO JOURNAL</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="journal-tabs">
          <button 
            className={activeTab === 'entries' ? 'active' : ''} 
            onClick={() => setActiveTab('entries')}
          >
            Entries ({entries.length})
          </button>
          <button 
            className={activeTab === 'insights' ? 'active' : ''} 
            onClick={() => setActiveTab('insights')}
          >
            Insights ({insights.length})
          </button>
        </div>
        <div className="journal-content">
          {activeTab === 'entries' && (
            entries.length === 0 ? (
              <p className="journal-empty">Your journey has just begun...</p>
            ) : (
              entries.map((entry, i) => (
                <div key={i} className="journal-entry">
                  <div className="entry-title">{entry.title || 'Entry'}</div>
                  <div className="entry-text">{entry.text}</div>
                </div>
              ))
            )
          )}
          {activeTab === 'insights' && (
            insights.length === 0 ? (
              <p className="journal-empty">Examine objects to gain insights...</p>
            ) : (
              insights.map((insight, i) => (
                <div key={i} className="journal-insight">
                  <div className="insight-title">◆ {insight.title}</div>
                  <div className="insight-text">{insight.text}</div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// VISIBLE ITEMS COMPONENT
// =============================================================================

const VisibleItems = ({ items, onExamine, onTake }) => {
  const [expanded, setExpanded] = useState(null);
  
  if (!items || items.length === 0) return null;
  
  return (
    <div className="visible-items">
      <div className="visible-items-header">◇ VISIBLE</div>
      <div className="visible-items-list">
        {items.map((item) => (
          <div key={item.id} className="visible-item">
            <button 
              className="item-name"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              [{item.name}]
            </button>
            {expanded === item.id && (
              <div className="item-detail">
                <p>{item.text}</p>
                {item.canTake && (
                  <button className="item-take" onClick={() => onTake(item)}>
                    + Take
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// INVENTORY COMPONENT
// =============================================================================

const InventoryPanel = ({ inventory, marks, debt, isOpen, onClose, onUseItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  if (!isOpen) return null;
  
  return (
    <div className="inventory-overlay">
      <div className="inventory-panel">
        <div className="inventory-header">
          <h2>◈ INVENTORY</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="inventory-currency">
          <span className="marks">◆ {marks} marks</span>
          {debt > 0 && <span className="debt">◇ {debt} debt</span>}
        </div>
        <div className="inventory-grid">
          {inventory.length === 0 ? (
            <p className="inventory-empty">No items</p>
          ) : (
            inventory.map((inv, i) => {
              const item = ITEMS[inv.itemId];
              if (!item) return null;
              return (
                <div 
                  key={i} 
                  className={`inventory-item ${selectedItem === i ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(selectedItem === i ? null : i)}
                >
                  <div className="item-icon">{item.category === 'consumable' ? '◉' : '◆'}</div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {inv.quantity > 1 && <div className="item-qty">x{inv.quantity}</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {selectedItem !== null && inventory[selectedItem] && (
          <div className="item-details">
            <p>{ITEMS[inventory[selectedItem].itemId]?.examineText}</p>
            {ITEMS[inventory[selectedItem].itemId]?.category === 'consumable' && (
              <button onClick={() => onUseItem(inventory[selectedItem].itemId)}>Use</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// CHARACTER CREATOR (simplified)
// =============================================================================

const PALETTES = {
  primary: [{ value: '#2a3a5a' }, { value: '#3a2a4a' }, { value: '#4a3a3a' }, { value: '#2a4a3a' }, { value: '#4a4a4a' }],
  accent: [{ value: '#00f0ff' }, { value: '#ff6600' }, { value: '#00ff88' }, { value: '#ff3366' }, { value: '#ffaa00' }],
  skin: [{ value: '#f5d0c5' }, { value: '#d4a574' }, { value: '#8d5524' }, { value: '#c68642' }, { value: '#e0ac69' }],
  eyes: [{ value: '#4a90d9' }, { value: '#2ecc71' }, { value: '#9b59b6' }, { value: '#34495e' }, { value: '#e74c3c' }]
};

function CharacterCreator({ onComplete, onCancel }) {
  const [name, setName] = useState('');
  const [config, setConfig] = useState({
    class: 'sentinel',
    gender: 'male',
    background: 'corridor',
    colors: { primary: '#2a3a5a', accent: '#00f0ff', skin: '#f5d0c5', eyes: '#4a90d9' }
  });
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const svg = createSVGCharacter(config);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    setPreview(URL.createObjectURL(blob));
  }, [config]);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const updateColor = (key, value) => setConfig(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }));

  const handleCreate = () => {
    if (!name.trim()) return;
    onComplete({ name: name.trim(), class: config.class, portraitUrl: preview, config });
  };

  const cls = CLASS_DEFS[config.class];

  return (
    <div className="creator">
      <div className="creator-header">
        <h1>CREATE OPERATIVE</h1>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="creator-body">
        <div className="preview-panel">
          <div className="preview-frame">
            {preview && <img src={preview} alt="Preview" />}
          </div>
          <div className="preview-stats">
            <span>STR {cls.stats.str}</span>
            <span>THM {cls.stats.thm}</span>
            <span>RSV {cls.stats.rsv}</span>
            <span>AGI {cls.stats.agi}</span>
          </div>
          <div className="class-desc">{cls.description}</div>
        </div>
        <div className="options-panel">
          <div className="opt-group">
            <label>CLASS</label>
            <select value={config.class} onChange={e => updateConfig('class', e.target.value)}>
              {Object.entries(CLASS_DEFS).map(([id, c]) => <option key={id} value={id}>{c.name}</option>)}
            </select>
          </div>
          <div className="opt-section">COLORS</div>
          <div className="color-row">
            <label>ARMOR</label>
            <div className="swatches">{PALETTES.primary.map(c => <button key={c.value} className={`swatch ${config.colors.primary === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('primary', c.value)} />)}</div>
          </div>
          <div className="color-row">
            <label>ACCENT</label>
            <div className="swatches">{PALETTES.accent.map(c => <button key={c.value} className={`swatch ${config.colors.accent === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('accent', c.value)} />)}</div>
          </div>
          <div className="color-row">
            <label>SKIN</label>
            <div className="swatches">{PALETTES.skin.map(c => <button key={c.value} className={`swatch ${config.colors.skin === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('skin', c.value)} />)}</div>
          </div>
          <div className="opt-section">BACKGROUND</div>
          <div className="opt-group">
            <select value={config.background} onChange={e => updateConfig('background', e.target.value)}>
              <option value="corridor">Corridor</option>
              <option value="station">Station</option>
              <option value="space">Space</option>
              <option value="planet">Planet</option>
            </select>
          </div>
        </div>
      </div>
      <div className="creator-footer">
        <input type="text" placeholder="Enter name..." value={name} onChange={e => setName(e.target.value)} />
        <button className="create-btn" onClick={handleCreate} disabled={!name.trim()}>CREATE</button>
      </div>
    </div>
  );
}

// =============================================================================
// GAME LOGIC
// =============================================================================

const generateId = () => Math.random().toString(36).substr(2, 9);

function createCharacter(name, classId, portraitUrl) {
  const cls = CLASS_DEFS[classId];
  const now = new Date().toISOString();
  return {
    id: generateId(), name, class: classId, version: '2.0', portraitUrl,
    stats: { ...cls.stats },
    derived: { ...cls.derived },
    hp: { current: cls.hp, max: cls.hp },
    mana: { current: cls.derived.mana, max: cls.derived.mana },
    xp: { current: 0, toNextLevel: 100 }, 
    level: 1,
    traits: [...cls.traits],
    provenance: [{ id: generateId(), timestamp: now, version: '2.0', eventType: 'created', description: 'Created' }],
    questsCompleted: 0, enemiesDefeated: 0
  };
}

const doCheck = (char, type, diff) => {
  const stat = char.stats[type] || 0;
  const roll = Math.floor(Math.random() * 6) + 1;
  const total = stat + roll;
  const target = diff + 6;
  return { stat, roll, total, target, success: total >= target };
};

const doCombat = (char, enemy) => {
  let pHp = char.hp.current, eHp = enemy.hp;
  const rounds = [];
  const pStr = char.stats.str || 2;
  const pDef = char.derived.ton ? Math.floor(char.derived.ton / 5) : 1;
  
  while (pHp > 0 && eHp > 0 && rounds.length < 10) {
    const pRoll = Math.floor(Math.random() * 6) + 1;
    const pDmg = Math.max(0, pStr + pRoll - (enemy.def || 1));
    eHp -= pDmg;
    let eDmg = 0;
    if (eHp > 0) {
      const eRoll = Math.floor(Math.random() * 6) + 1;
      eDmg = Math.max(0, (enemy.str || 2) + eRoll - pDef);
      pHp -= eDmg;
    }
    rounds.push({ pRoll, pDmg, eDmg, pHp, eHp });
  }
  return { rounds, victory: eHp <= 0, pHp, dmgTaken: char.hp.current - pHp };
};

// =============================================================================
// QUEST SCREEN (INTEGRATED)
// =============================================================================

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('prologue-tribunal');
  const [gameState, setGameState] = useState({
    shade: 0,
    marks: 0,
    debt: 0,
    flags: {},
    relationships: {},
    subplots: []
  });
  const [inventory, setInventory] = useState([]);
  const [journal, setJournal] = useState({ entries: [], insights: [] });
  const [sysOut, setSysOut] = useState(null);
  const [combat, setCombat] = useState(null);
  const [busy, setBusy] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const node = STORY_NODES[nodeId];

  const goTo = async (id) => { 
    setBusy(true); 
    await new Promise(r => setTimeout(r, 300)); 
    setNodeId(id); 
    setSysOut(null); 
    setCombat(null); 
    setBusy(false); 
  };

  const handleChoice = async (choice) => {
    // Check class requirement
    if (choice.classRequired && character.class !== choice.classRequired) {
      return;
    }
    
    // Check stat requirement
    if (choice.requirement?.stat) {
      const statValue = character.stats[choice.requirement.stat] || 0;
      if (statValue < choice.requirement.min) return;
    }
    
    // Check marks requirement
    if (choice.requirement?.marks && gameState.marks < choice.requirement.marks) {
      return;
    }
    
    // Check mana cost
    if (choice.manaCost) {
      if (character.mana.current < choice.manaCost) return;
      setCharacter(c => ({ 
        ...c, 
        mana: { ...c.mana, current: c.mana.current - choice.manaCost } 
      }));
    }
    
    // Apply shade change
    if (choice.shadeChange) {
      setGameState(gs => ({
        ...gs,
        shade: Math.max(-10, Math.min(10, gs.shade + choice.shadeChange))
      }));
    }
    
    // Apply consequences
    if (choice.consequence) {
      setGameState(gs => {
        const newState = { ...gs };
        if (choice.consequence.debt) newState.debt += choice.consequence.debt;
        if (choice.consequence.subplot) {
          newState.subplots = [...newState.subplots, choice.consequence.subplot];
        }
        return newState;
      });
    }
    
    // Add journal entry
    if (choice.journalEntry) {
      setJournal(j => ({
        ...j,
        entries: [...j.entries, { title: node.location, text: choice.journalEntry }]
      }));
    }
    
    goTo(choice.nextNodeId);
  };

  const handleTakeItem = (item) => {
    if (item.itemId) {
      setInventory(inv => [...inv, { itemId: item.itemId, quantity: 1 }]);
      setJournal(j => ({
        ...j,
        insights: [...j.insights, { title: item.name, text: item.text }]
      }));
    }
  };

  const handleUseItem = (itemId) => {
    const item = ITEMS[itemId];
    if (!item || item.category !== 'consumable') return;
    
    if (item.effect?.type === 'heal') {
      setCharacter(c => ({
        ...c,
        hp: { ...c.hp, current: Math.min(c.hp.max, c.hp.current + item.effect.amount) }
      }));
      setInventory(inv => {
        const idx = inv.findIndex(i => i.itemId === itemId);
        if (idx === -1) return inv;
        const newInv = [...inv];
        if (newInv[idx].quantity > 1) {
          newInv[idx] = { ...newInv[idx], quantity: newInv[idx].quantity - 1 };
        } else {
          newInv.splice(idx, 1);
        }
        return newInv;
      });
    }
  };

  const runCheck = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    const res = doCheck(character, n.checkType, n.difficulty);
    setSysOut({ ...res, checkType: n.checkType, difficulty: n.difficulty });
    if (res.success && n.successXp) {
      setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + n.successXp } }));
    }
    await new Promise(r => setTimeout(r, 1200));
    setNodeId(res.success ? n.successNodeId : n.failureNodeId);
    setBusy(false);
  };

  const runCombat = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    const res = doCombat(character, n.enemy);
    setCombat({ enemy: n.enemy, ...res });
    setCharacter(c => ({ ...c, hp: { ...c.hp, current: Math.max(0, res.pHp) } }));
    if (res.victory && n.victoryXp) {
      setCharacter(c => ({ 
        ...c, 
        xp: { ...c.xp, current: c.xp.current + n.victoryXp }, 
        enemiesDefeated: c.enemiesDefeated + 1 
      }));
    }
    setBusy(false);
  };

  const claimReward = (n) => {
    n.rewards?.forEach(r => {
      if (r.type === 'item') setInventory(inv => [...inv, { itemId: r.itemId, quantity: 1 }]);
      if (r.type === 'xp') setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + r.amount } }));
      if (r.type === 'marks') setGameState(gs => ({ ...gs, marks: gs.marks + r.amount }));
    });
    goTo(n.nextNodeId);
  };

  const finishQuest = () => {
    if (node.xpAwarded) {
      setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + node.xpAwarded } }));
    }
    const prov = { 
      id: generateId(), 
      timestamp: new Date().toISOString(), 
      version: character.version, 
      eventType: node.outcome === 'act-complete' ? 'act_completed' : 'quest_ended', 
      description: node.outcome === 'act-complete' ? 'Completed: Act 1 - The Circuit' : 'Ended: The Circuit' 
    };
    setCharacter(c => ({ 
      ...c, 
      provenance: [...c.provenance, prov], 
      questsCompleted: c.questsCompleted + 1 
    }));
    onComplete(node.outcome, node.xpAwarded);
  };

  // Handle narrative items
  useEffect(() => {
    if (node?.addItem && !inventory.some(i => i.itemId === node.addItem)) {
      setInventory(inv => [...inv, { itemId: node.addItem, quantity: 1 }]);
    }
  }, [nodeId]);

  useEffect(() => {
    if (node?.type === 'check' && !sysOut && !busy) runCheck(node);
    if (node?.type === 'combat' && !combat && !busy) runCombat(node);
  }, [nodeId]);

  const meetsRequirement = (choice) => {
    if (choice.classRequired && character.class !== choice.classRequired) return false;
    if (choice.requirement?.stat) {
      const statValue = character.stats[choice.requirement.stat] || 0;
      if (statValue < choice.requirement.min) return false;
    }
    if (choice.requirement?.marks && gameState.marks < choice.requirement.marks) return false;
    if (choice.manaCost && character.mana.current < choice.manaCost) return false;
    return true;
  };

  const hpPct = (character.hp.current / character.hp.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNextLevel) * 100;
  const manaPct = (character.mana.current / character.mana.max) * 100;

  if (!node) return <div className="error">Node not found: {nodeId}</div>;

  return (
    <div className="game-layout">
      <aside className="sidebar">
        <div className="card">
          <div className="card-top">
            <span>◇ GREY STRATUM</span>
            <span>v{character.version}</span>
          </div>
          {character.portraitUrl ? (
            <img src={character.portraitUrl} alt="" className="portrait" />
          ) : (
            <div className="portrait-placeholder">{CLASS_DEFS[character.class]?.name[0]}</div>
          )}
          <div className="card-name">{character.name}</div>
          <div className="card-class">{CLASS_DEFS[character.class]?.name}</div>
          
          <ShadeBar shade={gameState.shade} />
          
          <div className="bars">
            <div className="bar"><span>HP</span><span>{character.hp.current}/{character.hp.max}</span></div>
            <div className="bar-track">
              <div className="bar-fill hp" style={{ width: `${hpPct}%`, background: hpPct > 50 ? '#00ff88' : hpPct > 25 ? '#ffaa00' : '#ff3366' }} />
            </div>
            <div className="bar"><span>MANA</span><span>{character.mana.current}/{character.mana.max}</span></div>
            <div className="bar-track">
              <div className="bar-fill mana" style={{ width: `${manaPct}%` }} />
            </div>
            <div className="bar"><span>XP</span><span>{character.xp.current}/{character.xp.toNextLevel}</span></div>
            <div className="bar-track">
              <div className="bar-fill xp" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
          
          <div className="stats-row">
            <div><span>STR</span><b>{character.stats.str}</b></div>
            <div><span>THM</span><b>{character.stats.thm}</b></div>
            <div><span>RSV</span><b>{character.stats.rsv}</b></div>
            <div><span>AGI</span><b>{character.stats.agi}</b></div>
          </div>
          
          <div className="sidebar-buttons">
            <button onClick={() => setJournalOpen(true)}>
              ◈ Journal {journal.entries.length > 0 && `(${journal.entries.length})`}
            </button>
            <button onClick={() => setInventoryOpen(true)}>
              ◆ Inventory {inventory.length > 0 && `(${inventory.length})`}
            </button>
          </div>
        </div>
      </aside>
      
      <main className="narrative">
        {node.location && <div className="location">◆ {node.location}</div>}
        <div className="text">{node.text}</div>
        
        <VisibleItems 
          items={node.visibleItems} 
          onExamine={() => {}} 
          onTake={handleTakeItem} 
        />
        
        {sysOut && (
          <div className="sys-out">
            <div className="sys-head">◈ SYSTEM</div>
            <div>{sysOut.checkType.toUpperCase()} CHECK — Diff {sysOut.difficulty}</div>
            <div>Base {sysOut.stat} + Roll {sysOut.roll} = {sysOut.total} vs {sysOut.target}</div>
            <div className={sysOut.success ? 'win' : 'lose'}>
              {sysOut.success ? '██ SUCCESS ██' : '░░ FAILURE ░░'}
            </div>
          </div>
        )}
        
        {combat && (
          <div className="sys-out">
            <div className="sys-head">◈ COMBAT — {combat.enemy.name}</div>
            <div className="combat-log">
              {combat.rounds.map((r, i) => (
                <div key={i}>R{i + 1}: You {r.pDmg} dmg, Enemy {r.eDmg} dmg — HP {r.pHp}/{r.eHp}</div>
              ))}
            </div>
            <div className={combat.victory ? 'win' : 'lose'}>
              {combat.victory ? '██ VICTORY ██' : '░░ DEFEAT ░░'}
            </div>
          </div>
        )}
        
        <div className="choices">
          {node.type === 'choice' && node.choices.map(c => {
            const ok = meetsRequirement(c);
            const isClassLocked = c.classRequired && character.class !== c.classRequired;
            const isStatLocked = c.requirement?.stat && (character.stats[c.requirement.stat] || 0) < c.requirement.min;
            
            return (
              <button 
                key={c.id} 
                disabled={busy || !ok} 
                onClick={() => handleChoice(c)}
                className={c.shadeChange ? (c.shadeChange > 0 ? 'choice-light' : 'choice-dark') : ''}
              >
                <span>[{c.id.toUpperCase()}]</span> 
                {c.text}
                {isClassLocked && <span className="req">🔒 {c.classRequired}</span>}
                {isStatLocked && <span className="req">⚡ {c.requirement.stat.toUpperCase()} {c.requirement.min}+</span>}
                {c.manaCost && <span className="mana-cost">◇{c.manaCost}</span>}
              </button>
            );
          })}
          
          {node.type === 'narrative' && (
            <button disabled={busy} onClick={() => goTo(node.nextNodeId)}>Continue...</button>
          )}
          
          {node.type === 'reward' && (
            <>
              <div className="reward">
                {node.rewards?.map((r, i) => (
                  <div key={i}>+ {r.type === 'marks' ? `${r.amount} marks` : r.type === 'xp' ? `${r.amount} XP` : r.itemId}</div>
                ))}
              </div>
              <button disabled={busy} onClick={() => claimReward(node)}>Continue...</button>
            </>
          )}
          
          {node.type === 'combat' && combat && !busy && (
            combat.victory ? (
              <button onClick={() => goTo(node.victoryNodeId)}>Continue...</button>
            ) : (
              <>
                <button onClick={() => goTo(node.defeatNodeId)}>Accept defeat...</button>
                {node.fleeNodeId && <button onClick={() => goTo(node.fleeNodeId)}>Flee!</button>}
              </>
            )
          )}
          
          {node.type === 'outcome' && (
            <>
              <div className="xp-award">+{node.xpAwarded} XP</div>
              <button onClick={finishQuest}>
                {node.outcome === 'act-complete' ? 'Continue to Act 2...' : 'Return to Menu'}
              </button>
            </>
          )}
        </div>
      </main>
      
      <EchoJournal 
        entries={journal.entries} 
        insights={journal.insights} 
        isOpen={journalOpen} 
        onClose={() => setJournalOpen(false)} 
      />
      
      <InventoryPanel 
        inventory={inventory} 
        marks={gameState.marks} 
        debt={gameState.debt}
        isOpen={inventoryOpen} 
        onClose={() => setInventoryOpen(false)}
        onUseItem={handleUseItem}
      />
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [character, setCharacter] = useState(null);
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('gs-char-v2');
    if (saved) try { setCharacter(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    if (character) localStorage.setItem('gs-char-v2', JSON.stringify(character));
  }, [character]);

  const handleCreatorDone = (data) => {
    const char = createCharacter(data.name, data.class, data.portraitUrl);
    setCharacter(char);
    setScreen('menu');
  };

  const handleQuestDone = (result, xp) => {
    setOutcome({ result, xp });
    setScreen('outcome');
  };

  return (
    <>
      <style>{appStyles}</style>
      <div className="app">
        <header>
          <div className="brand">GREY STRATUM</div>
          <div className="sub">THE DESCENT v2.0</div>
        </header>
        
        {screen === 'menu' && (
          <div className="menu">
            <h1>GREY STRATUM</h1>
            <p className="tagline">What does humanity owe itself when survival is uncertain?</p>
            {character && (
              <div className="menu-card">
                {character.portraitUrl && <img src={character.portraitUrl} alt="" />}
                <div>
                  <b>{character.name}</b><br />
                  {CLASS_DEFS[character.class]?.name} Lv{character.level}
                </div>
              </div>
            )}
            <button onClick={() => setScreen('quest')} disabled={!character}>▸ BEGIN DESCENT</button>
            <button onClick={() => setScreen('create')}>▸ NEW OPERATIVE</button>
          </div>
        )}
        
        {screen === 'create' && (
          <CharacterCreator onComplete={handleCreatorDone} onCancel={() => setScreen('menu')} />
        )}
        
        {screen === 'quest' && character && (
          <QuestScreen character={character} setCharacter={setCharacter} onComplete={handleQuestDone} />
        )}
        
        {screen === 'outcome' && (
          <div className="outcome">
            <h1 className={outcome?.result}>
              {outcome?.result === 'act-complete' ? 'ACT 1 COMPLETE' : 
               outcome?.result === 'early-ending' ? 'THE SURVIVOR' : 'JOURNEY ENDS'}
            </h1>
            <div className="xp">+{outcome?.xp} XP</div>
            <button onClick={() => setScreen('menu')}>Menu</button>
          </div>
        )}
        
        <footer>
          <span>● ONLINE</span>
          <span>THE CIRCUIT</span>
        </footer>
      </div>
    </>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const appStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600&family=Share+Tech+Mono&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--panel:#12121a;--card:#1a1a25;--border:#2a2a3a;--cyan:#00f0ff;--amber:#ffaa00;--green:#00ff88;--red:#ff3366;--text:#c0c0d0;--dim:#606080;--mana:#a855f7}
body{background:var(--bg);color:var(--text);font-family:'Rajdhani',sans-serif}
.app{min-height:100vh;display:flex;flex-direction:column}
header{padding:.75rem 1.5rem;background:var(--panel);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Orbitron',sans-serif;color:var(--cyan);letter-spacing:.2em}
.sub{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--dim)}
footer{padding:.5rem 1.5rem;background:var(--panel);border-top:1px solid var(--border);display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--dim)}
footer span:first-child::before{content:'';display:inline-block;width:6px;height:6px;background:var(--green);border-radius:50%;margin-right:.4rem}

.menu{max-width:500px;margin:3rem auto;padding:2rem;text-align:center}
.menu h1{font-family:'Orbitron',sans-serif;font-size:1.8rem;color:var(--cyan);letter-spacing:.3em;margin-bottom:.5rem}
.menu .tagline{font-size:.9rem;color:var(--dim);margin-bottom:2rem;font-style:italic}
.menu button{display:block;width:100%;padding:.9rem;margin:.5rem 0;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.8rem;color:var(--text);letter-spacing:.1em;cursor:pointer}
.menu button:hover{border-color:var(--cyan);color:var(--cyan)}
.menu button:disabled{opacity:.4;cursor:not-allowed}
.menu-card{display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--card);border-radius:6px;margin-bottom:1.5rem;text-align:left}
.menu-card img{width:80px;height:100px;object-fit:cover;border-radius:4px}

.outcome{max-width:500px;margin:3rem auto;padding:2rem;text-align:center}
.outcome h1{font-family:'Orbitron',sans-serif;font-size:1.3rem;letter-spacing:.2em;margin-bottom:1rem}
.outcome h1.act-complete{color:var(--cyan)}
.outcome h1.early-ending{color:var(--amber)}
.outcome .xp{font-family:'Share Tech Mono',monospace;color:var(--cyan);margin-bottom:2rem}
.outcome button{padding:.75rem 2rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer}

/* Creator styles */
.creator{max-width:850px;margin:1rem auto;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.creator-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.creator-header h1{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan);letter-spacing:.15em}
.creator-header button{background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:pointer}
.creator-body{display:grid;grid-template-columns:300px 1fr;gap:1px;background:var(--border)}
.preview-panel{background:var(--bg);padding:1rem;display:flex;flex-direction:column;align-items:center}
.preview-frame{width:240px;height:300px;background:#000;border:2px solid var(--border);border-radius:6px;overflow:hidden}
.preview-frame img{width:100%;height:100%;object-fit:cover}
.preview-stats{display:flex;gap:.75rem;margin-top:.75rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.class-desc{margin-top:.5rem;font-size:.75rem;color:var(--dim);text-align:center;padding:0 1rem}
.options-panel{background:var(--panel);padding:1rem;overflow-y:auto;max-height:420px}
.opt-section{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--cyan);letter-spacing:.1em;margin:1rem 0 .5rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)}
.opt-group{margin-bottom:.6rem}
.opt-group label{display:block;font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--dim);letter-spacing:.08em;margin-bottom:.2rem}
.opt-group select{width:100%;padding:.4rem;background:var(--card);border:1px solid var(--border);border-radius:3px;color:var(--text);font-size:.8rem}
.color-row{margin-bottom:.6rem}
.color-row label{display:block;font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--dim);margin-bottom:.3rem}
.swatches{display:flex;gap:.3rem;flex-wrap:wrap}
.swatch{width:24px;height:24px;border:2px solid transparent;border-radius:3px;cursor:pointer}
.swatch:hover{transform:scale(1.1)}
.swatch.sel{border-color:#fff;box-shadow:0 0 8px rgba(255,255,255,.3)}
.creator-footer{padding:.75rem 1rem;background:var(--card);border-top:1px solid var(--border);display:flex;gap:.75rem}
.creator-footer input{flex:1;padding:.6rem;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:#fff;font-size:.9rem}
.creator-footer input::placeholder{color:var(--dim)}
.create-btn{padding:.6rem 1.5rem;background:linear-gradient(90deg,#00a0aa,var(--cyan));border:none;border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.75rem;color:var(--bg);cursor:pointer}
.create-btn:disabled{opacity:.5}

/* Game layout */
.game-layout{flex:1;display:grid;grid-template-columns:280px 1fr;background:var(--border);gap:1px}
.sidebar{background:var(--panel);padding:1rem;overflow-y:auto}
.card{background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden}
.card-top{display:flex;justify-content:space-between;padding:.5rem .6rem;background:#1a1a25;border-bottom:1px solid var(--border);font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--cyan)}
.card-top span:last-child{color:var(--amber);background:rgba(255,170,0,.1);padding:.1rem .3rem;border-radius:2px}
.portrait{width:100%;height:180px;object-fit:cover}
.portrait-placeholder{height:140px;display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--dim);background:var(--bg)}
.card-name{text-align:center;font-family:'Orbitron',sans-serif;font-size:.9rem;color:#fff;padding:.5rem .5rem 0}
.card-class{text-align:center;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--cyan);padding-bottom:.5rem;border-bottom:1px solid var(--border)}

/* Shade bar */
.shade-container{padding:.5rem .6rem;border-bottom:1px solid var(--border)}
.shade-label{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--dim);margin-bottom:.25rem}
.shade-track{position:relative;height:8px;background:var(--bg);border-radius:4px;overflow:visible}
.shade-gradient{position:absolute;inset:0;background:linear-gradient(90deg,#1a1a1a,#404040,#808080,#a0a0e0,#ffffff);border-radius:4px;opacity:.6}
.shade-marker{position:absolute;top:-2px;width:4px;height:12px;background:var(--cyan);border-radius:2px;transform:translateX(-50%);box-shadow:0 0 6px var(--cyan)}
.shade-ends{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.45rem;color:var(--dim);margin-top:.2rem}

/* Bars */
.bars{padding:.6rem}
.bar{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--dim);margin-bottom:.15rem}
.bar-track{height:6px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:.4rem}
.bar-fill{height:100%;transition:width .3s}
.bar-fill.hp{background:var(--green)}
.bar-fill.mana{background:var(--mana)}
.bar-fill.xp{background:linear-gradient(90deg,#00a0aa,var(--cyan))}
.stats-row{display:flex;justify-content:space-around;padding:.5rem;border-top:1px solid var(--border)}
.stats-row div{text-align:center}
.stats-row span{display:block;font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--dim)}
.stats-row b{font-family:'Orbitron',sans-serif;font-size:1rem;color:#fff}

/* Sidebar buttons */
.sidebar-buttons{display:flex;gap:.5rem;padding:.5rem}
.sidebar-buttons button{flex:1;padding:.4rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--dim);cursor:pointer}
.sidebar-buttons button:hover{border-color:var(--cyan);color:var(--cyan)}

/* Narrative */
.narrative{background:var(--panel);padding:1.5rem;overflow-y:auto}
.location{font-family:'Orbitron',sans-serif;font-size:.65rem;color:var(--amber);letter-spacing:.2em;margin-bottom:1rem}
.text{font-size:1rem;line-height:1.7;white-space:pre-wrap;max-width:650px}

/* Visible items */
.visible-items{margin:1rem 0;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;max-width:500px}
.visible-items-header{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--amber);letter-spacing:.1em;margin-bottom:.5rem}
.visible-items-list{display:flex;flex-wrap:wrap;gap:.5rem}
.visible-item{margin-bottom:.25rem}
.item-name{background:none;border:none;color:var(--cyan);font-family:'Share Tech Mono',monospace;font-size:.8rem;cursor:pointer;padding:0}
.item-name:hover{text-decoration:underline}
.item-detail{margin-top:.25rem;padding:.5rem;background:var(--card);border-radius:4px;font-size:.85rem;color:var(--text)}
.item-take{margin-top:.5rem;padding:.25rem .5rem;background:var(--cyan);border:none;border-radius:2px;color:var(--bg);font-size:.7rem;cursor:pointer}

/* System output */
.sys-out{background:var(--bg);border:1px solid var(--border);border-left:3px solid var(--cyan);padding:.75rem;margin:1rem 0;font-family:'Share Tech Mono',monospace;font-size:.75rem;max-width:450px}
.sys-head{color:var(--cyan);margin-bottom:.5rem;font-size:.65rem;letter-spacing:.1em}
.sys-out .win{color:var(--green);margin-top:.5rem;font-weight:bold}
.sys-out .lose{color:var(--red);margin-top:.5rem;font-weight:bold}
.combat-log{max-height:120px;overflow-y:auto;margin:.5rem 0;font-size:.65rem;color:var(--dim)}

/* Choices */
.choices{margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1rem}
.choices button{display:flex;align-items:center;gap:.6rem;width:100%;padding:.65rem .8rem;margin-bottom:.4rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:.85rem;cursor:pointer;text-align:left}
.choices button:hover:not(:disabled){background:#222230;border-color:var(--cyan);transform:translateX(3px)}
.choices button:disabled{opacity:.4;cursor:not-allowed}
.choices button span:first-child{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.choices button.choice-light{border-left:3px solid #a0a0e0}
.choices button.choice-dark{border-left:3px solid #404040}
.choices .req{color:var(--amber);font-size:.7rem;margin-left:auto}
.choices .mana-cost{color:var(--mana);font-size:.7rem;margin-left:.5rem}
.choices .reward{color:var(--green);font-family:'Share Tech Mono',monospace;font-size:.8rem;margin-bottom:.5rem}
.choices .xp-award{color:var(--cyan);font-family:'Share Tech Mono',monospace;margin-bottom:.5rem}

/* Journal overlay */
.journal-overlay,.inventory-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:100}
.journal-panel,.inventory-panel{width:90%;max-width:500px;max-height:80vh;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column}
.journal-header,.inventory-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.journal-header h2,.inventory-header h2{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan)}
.journal-header button,.inventory-header button{background:none;border:none;color:var(--dim);font-size:1.2rem;cursor:pointer}
.journal-tabs{display:flex;border-bottom:1px solid var(--border)}
.journal-tabs button{flex:1;padding:.5rem;background:none;border:none;color:var(--dim);font-family:'Share Tech Mono',monospace;font-size:.75rem;cursor:pointer}
.journal-tabs button.active{color:var(--cyan);border-bottom:2px solid var(--cyan)}
.journal-content{flex:1;overflow-y:auto;padding:1rem}
.journal-empty{color:var(--dim);font-style:italic;text-align:center}
.journal-entry,.journal-insight{margin-bottom:1rem;padding:.75rem;background:var(--card);border-radius:4px}
.entry-title,.insight-title{font-family:'Orbitron',sans-serif;font-size:.7rem;color:var(--amber);margin-bottom:.5rem}
.entry-text,.insight-text{font-size:.85rem;line-height:1.5}

/* Inventory */
.inventory-currency{display:flex;gap:1rem;padding:.75rem 1rem;border-bottom:1px solid var(--border);font-family:'Share Tech Mono',monospace;font-size:.8rem}
.inventory-currency .marks{color:var(--amber)}
.inventory-currency .debt{color:var(--red)}
.inventory-grid{flex:1;overflow-y:auto;padding:1rem}
.inventory-empty{color:var(--dim);font-style:italic;text-align:center}
.inventory-item{display:flex;align-items:center;gap:.75rem;padding:.5rem;margin-bottom:.5rem;background:var(--card);border:1px solid var(--border);border-radius:4px;cursor:pointer}
.inventory-item:hover,.inventory-item.selected{border-color:var(--cyan)}
.item-icon{font-size:1.2rem;color:var(--cyan)}
.item-info{flex:1}
.item-info .item-name{font-size:.85rem}
.item-info .item-qty{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--dim)}
.item-details{padding:1rem;border-top:1px solid var(--border);background:var(--bg)}
.item-details p{font-size:.85rem;margin-bottom:.5rem}
.item-details button{padding:.4rem .75rem;background:var(--cyan);border:none;border-radius:4px;color:var(--bg);font-size:.75rem;cursor:pointer}

/* Error */
.error{padding:2rem;text-align:center;color:var(--red)}

@media(max-width:768px){
  .creator-body,.game-layout{grid-template-columns:1fr}
  .sidebar{display:none}
}
`;
