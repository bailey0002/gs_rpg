// =============================================================================
// GREY STRATUM — ACT 1: THE CIRCUIT
// /data/acts/act1_circuit.js
// =============================================================================
// All story nodes for Act 1. Import into main game engine.
// Structure inspired by Colossal Cave's "excursion loop":
// Enter area → explore/solve → return with progress → repeat

import { ITEMS } from '../content/items.js';

// =============================================================================
// ACT METADATA
// =============================================================================

export const ACT_1_META = {
  id: 'act1',
  name: 'The Circuit',
  theme: 'Establishment & Obligation',
  centralQuestion: 'Who do you owe?',
  startNode: 'prologue-tribunal',
  endNodes: ['act1-survivor-ending', 'act1-descent-transition'],
  estimatedLength: '45-60 minutes'
};

// =============================================================================
// STORY NODES
// =============================================================================
// Node types: narrative, choice, check, combat, puzzle, reward, outcome

export const ACT_1_NODES = {
  // ─────────────────────────────────────────────────────────────────────────
  // PROLOGUE: THE FALL
  // ─────────────────────────────────────────────────────────────────────────
  'prologue-tribunal': {
    type: 'narrative',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: `The Spire's light is absolute. It reveals everything—including guilt.

Three Adjudicators sit above you, faces hidden behind mirrored masks. Your reflection stares back, fractured across their judgment.

"Shade contamination," the central figure intones. "Unauthorized integration with proscribed technology. Penalty: Descent."

You don't remember the crime. But the Shade coiled at the base of your skull pulses—it remembers something.

The floor beneath you begins to descend.`,
    visibleItems: [
      { id: 'adjudicator-masks', name: 'Adjudicator\'s Masks', action: 'examine', text: 'Perfect mirrors. You see yourself but not them. This is intentional.' },
      { id: 'shade-implant', name: 'The Shade Implant', action: 'examine', text: 'A warmth behind your eyes. It\'s been there since you woke in custody. It feels... expectant.' },
      { id: 'restraints', name: 'Your Restraints', action: 'examine', text: 'Magnetic locks. They\'ll release when you reach your designated Stratum. The system is efficient.' }
    ],
    nextNodeId: 'prologue-response'
  },

  'prologue-response': {
    type: 'choice',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: 'The descent begins. You have one last moment to respond.',
    choices: [
      {
        id: 'accept',
        text: 'Accept in silence',
        shadeChange: 1,
        consequence: { flag: 'prologue-accepted', spireRelation: 5, murkRelation: -5 },
        journalEntry: 'prologue-accept',
        nextNodeId: 'prologue-descent'
      },
      {
        id: 'demand',
        text: 'Demand explanation',
        shadeChange: 0,
        consequence: { flag: 'prologue-demanded', subplot: 'implant-origin' },
        journalEntry: 'prologue-demand',
        nextNodeId: 'prologue-demand-response'
      },
      {
        id: 'threaten',
        text: 'Threaten retribution',
        shadeChange: -1,
        consequence: { flag: 'prologue-threatened', subplot: 'spire-hunters', abyssRelation: 10 },
        journalEntry: 'prologue-threaten',
        nextNodeId: 'prologue-descent'
      }
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

  // ─────────────────────────────────────────────────────────────────────────
  // SCENE 1.1: ARRIVAL
  // ─────────────────────────────────────────────────────────────────────────
  'circuit-arrival': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `The platform locks into a receiving bay. Red emergency lights. The smell of recycled air and machine oil.

A figure waits—angular, patient. Their coat bears the sigil of the Broker's Guild: an open hand holding a closed eye.

"Another one from above," they say, not unkindly. "I am Corso. I've been paid to receive you. By whom, I'm not permitted to say."

They gesture to the hub beyond. "The Circuit runs on obligation. You now have one. To me."`,
    visibleItems: [
      { id: 'corso-sigil', name: 'Corso\'s Guild Sigil', action: 'examine', text: 'The Broker\'s Guild. Neutral arbiters of trade. They honor contracts—but only contracts.' },
      { id: 'transit-terminal', name: 'Transit Hub Terminal', action: 'examine', text: 'Locked. Requires authorization or bypass.' },
      { id: 'descent-manifest', name: 'Discarded Manifest', action: 'take', itemId: 'descent-manifest', text: 'Lists recent "descents." Your name is seventh. The first six are crossed out.' },
      { id: 'corso-satchel', name: 'Corso\'s Satchel', action: 'examine', text: 'Medical supplies. Your supplies. They\'re already calculating your debt.' }
    ],
    nextNodeId: 'corso-response'
  },

  'corso-response': {
    type: 'choice',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: 'Corso waits for your response.',
    choices: [
      {
        id: 'grateful',
        text: '"Thank you. I\'ll repay this."',
        shadeChange: 1,
        consequence: { flag: 'corso-grateful', corsoRelation: 10, debt: 350 },
        journalEntry: 'corso-meeting',
        nextNodeId: 'corso-grateful-response'
      },
      {
        id: 'question',
        text: '"Who paid for this? I need to know."',
        shadeChange: 0,
        consequence: { flag: 'corso-questioned', corsoRelation: 5, subplot: 'the-benefactor' },
        journalEntry: 'corso-meeting',
        insight: 'benefactor-mystery',
        nextNodeId: 'corso-question-response'
      },
      {
        id: 'refuse',
        text: '"I didn\'t ask for this debt."',
        shadeChange: -1,
        consequence: { flag: 'corso-refused', corsoRelation: -10, debt: 350, debtThreat: true },
        journalEntry: 'corso-hostile',
        nextNodeId: 'corso-refuse-response'
      },
      {
        id: 'oracle-read',
        text: '[ORACLE] Read Corso\'s Shade',
        classRequired: 'oracle',
        manaCost: 2,
        shadeChange: 0,
        consequence: { flag: 'corso-read', corsoRelation: 20, subplot: 'corso-ally' },
        journalEntry: 'corso-oracle-read',
        nextNodeId: 'corso-oracle-response'
      }
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

  // ─────────────────────────────────────────────────────────────────────────
  // SCENE 1.2: THE HUB
  // ─────────────────────────────────────────────────────────────────────────
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
      { id: 'exchange-board', name: 'Exchange Board', action: 'examine', text: 'Labor: 15 marks/shift. Information: Variable. Shade Services: Unlisted but whispered.' },
      { id: 'street-vendor', name: 'Street Vendor', action: 'shop', text: 'Basic supplies available.' },
      { id: 'notice-board', name: 'Notice Board', action: 'examine', text: 'Job postings. Opportunities and dangers.' }
    ],
    shop: {
      vendorName: 'Street Vendor',
      items: [
        { itemId: 'ration-pack', price: 20 },
        { itemId: 'med-stim', price: 50 },
        { itemId: 'lock-bypass', price: 100 }
      ]
    },
    choices: [
      {
        id: 'job-escort',
        text: '[JOB] Cargo Security — Fabrication Yards (200 marks)',
        nextNodeId: 'job-escort-start'
      },
      {
        id: 'job-heist',
        text: '[JOB] Data Extraction — Temple Request (150 marks + intel)',
        requirement: { stat: 'thm', min: 3, orClass: 'infiltrator' },
        nextNodeId: 'job-heist-start'
      },
      {
        id: 'job-collection',
        text: '[JOB] Debt Collection — Broker\'s Guild (100 marks)',
        requirement: { stat: 'str', min: 3, orClass: 'voidStalker' },
        nextNodeId: 'job-collection-start'
      },
      {
        id: 'job-package',
        text: '[JOB] Smuggle a Person — Anonymous (300 marks)',
        requirement: { stat: 'rsv', min: 3 },
        nextNodeId: 'job-package-start'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SCENE 1.3A: THE ESCORT
  // ─────────────────────────────────────────────────────────────────────────
  'job-escort-start': {
    type: 'narrative',
    location: 'FABRICATION YARDS — LOADING BAY',
    text: `The cargo is sealed containers—medical supplies, the foreman says. Destination: a Midway clinic. Three days through maintenance corridors.

Your fellow guards: Harrow (veteran, tired eyes, steady hands) and Pell (young, nervous, talks too much).

Day one: uneventful.

Day two: you hear them.`,
    consequence: { flag: 'job-escort-accepted' },
    nextNodeId: 'job-escort-raiders'
  },

  'job-escort-raiders': {
    type: 'choice',
    location: 'MAINTENANCE CORRIDOR — DAY 2',
    text: `Raiders. Murk-descended, by their patchwork gear. They block the corridor ahead.

"Medical supplies," their leader calls out. "We need them more than whatever clinic you're feeding. Give them up and walk away."`,
    visibleItems: [
      { id: 'raider-leader', name: 'Raider Leader', action: 'examine', text: 'Scarred, but not cruel-looking. Desperate. A child\'s drawing is tucked into their belt.' },
      { id: 'harrow', name: 'Harrow\'s Stance', action: 'examine', text: 'Ready to fight. This isn\'t their first escort. Won\'t be their last.' },
      { id: 'pell', name: 'Pell\'s Hands', action: 'examine', text: 'Shaking. They\'ve never seen real violence.' },
      { id: 'cargo-manifest', name: 'Cargo Manifest', action: 'examine', text: 'Medical supplies: antibiotics, surgical tools, blood synth. Standard clinic stock.' }
    ],
    preCheck: {
      type: 'check',
      stat: 'thm',
      difficulty: 3,
      successReveal: 'Your Shade pulses. You read the raiders—genuine desperation, not malice. And you notice the foreman\'s manifest had a second page. This cargo includes experimental Spire medications.\n\nSomeone\'s smuggling, and you\'re the cover.'
    },
    choices: [
      {
        id: 'fight',
        text: 'Fight to protect the cargo',
        shadeChange: 2,
        nextNodeId: 'escort-combat'
      },
      {
        id: 'negotiate',
        text: 'Negotiate a split',
        requirement: { stat: 'thm', min: 3 },
        shadeChange: 0,
        nextNodeId: 'escort-negotiate'
      },
      {
        id: 'surrender',
        text: 'Let them take it',
        shadeChange: -1,
        nextNodeId: 'escort-surrender'
      },
      {
        id: 'assassinate',
        text: '[VOID STALKER] Eliminate the leader silently',
        classRequired: 'voidStalker',
        shadeChange: -3,
        nextNodeId: 'escort-assassinate'
      },
      {
        id: 'shield',
        text: '[SENTINEL] Shield Pell and hold the line',
        classRequired: 'sentinel',
        manaCost: 2,
        shadeChange: 3,
        nextNodeId: 'escort-sentinel'
      }
    ]
  },

  'escort-combat': {
    type: 'combat',
    location: 'MAINTENANCE CORRIDOR — COMBAT',
    text: `You and Harrow move forward. The raiders are desperate but outmatched.`,
    enemies: [
      { id: 'raider-1', name: 'Murk Raider', hp: 5, str: 2, def: 1 },
      { id: 'raider-2', name: 'Murk Raider', hp: 5, str: 2, def: 1 },
      { id: 'raider-3', name: 'Murk Raider', hp: 5, str: 2, def: 1 }
    ],
    victoryNodeId: 'escort-combat-victory',
    defeatNodeId: 'escort-combat-defeat',
    fleeNodeId: 'escort-surrender'
  },

  'escort-combat-victory': {
    type: 'reward',
    location: 'MAINTENANCE CORRIDOR — AFTERMATH',
    text: `The raiders fall. Harrow wipes their blade, expressionless. Pell stares at the bodies, pale.

The cargo is safe. The job continues.

But you notice Pell's eyes have changed. Something innocent died here.`,
    rewards: [
      { type: 'marks', amount: 200 },
      { type: 'xp', amount: 25 }
    ],
    consequence: { 
      flag: 'escort-fought',
      pellRelation: -5,
      harrowRelation: 10,
      murkRelation: -15
    },
    journalEntry: 'escort-fight',
    nextNodeId: 'circuit-hub-return'
  },

  'escort-negotiate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — NEGOTIATION',
    text: `"Half the medical supplies. You keep the antibiotics, we keep the experimental stuff. Everyone walks."

The raider leader considers. Then nods.

"Fair enough. We remember this."

Harrow looks at you with something like approval. Pell exhales.

The foreman, later, does not approve. But a deal is a deal.`,
    rewards: [
      { type: 'marks', amount: 100 },
      { type: 'xp', amount: 20 }
    ],
    consequence: {
      flag: 'escort-negotiated',
      murkRelation: 15,
      circuitRelation: -10,
      pellRelation: 10,
      harrowRelation: 5
    },
    journalEntry: 'escort-negotiate',
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
    rewards: [
      { type: 'xp', amount: 10 }
    ],
    consequence: {
      flag: 'escort-surrendered',
      murkRelation: 25,
      debt: 50, // Increases debt
      pellRelation: 10,
      raiderFavor: true
    },
    journalEntry: 'escort-surrender',
    nextNodeId: 'circuit-hub-return'
  },

  'escort-assassinate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — SHADOWS',
    text: `You slip into shadow. The leader's companions don't see you until it's too late. One precise strike.

The others flee. Harrow stares at you.

"Who are you?"

The cargo is safe. The bonus is significant. But Harrow keeps their distance now. And the Murk will remember the name of the one who killed in shadow.`,
    rewards: [
      { type: 'marks', amount: 250 },
      { type: 'xp', amount: 30 }
    ],
    consequence: {
      flag: 'escort-assassinated',
      harrowRelation: -15,
      murkRelation: -30,
      murkEnemy: true
    },
    journalEntry: 'escort-assassinate',
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
    rewards: [
      { type: 'marks', amount: 200 },
      { type: 'xp', amount: 30 }
    ],
    consequence: {
      flag: 'escort-shielded',
      pellRelation: 25,
      harrowRelation: 15,
      murkRelation: 5
    },
    journalEntry: 'escort-sentinel',
    nextNodeId: 'circuit-hub-return'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HUB RETURN (after any job)
  // ─────────────────────────────────────────────────────────────────────────
  'circuit-hub-return': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRADE HUB ALPHA',
    text: `You return to the Hub. The job is done—whatever form that took.

Corso finds you, as they always do.

"You've seen what the Circuit is now. Labor, secrets, and violence dressed in commerce. You can stay here, grind marks, pay your debts slowly."

They lean closer.

"Or you can go deeper. The Midway brokers passage freely. And below that—" they pause. "Below that is where answers live. And die."`,
    nextNodeId: 'descent-decision'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SCENE 1.4: THE DESCENT DECISION
  // ─────────────────────────────────────────────────────────────────────────
  'descent-decision': {
    type: 'choice',
    location: 'THE CIRCUIT — DESCENT SHAFTS',
    text: `The shafts plunge into darkness. Makeshift elevators run on stolen power.

Corso stands at the threshold.

"I've met one person who came back from the Abyss. They couldn't speak anymore. But they smiled. Like they'd seen something beautiful."

Your Shade pulses. It wants to go down.`,
    choices: [
      {
        id: 'stay',
        text: 'Pay off Corso and stay in the Circuit',
        requirement: { marks: 350 }, // Must have enough to pay debt
        nextNodeId: 'act1-survivor-ending'
      },
      {
        id: 'truth',
        text: '"I need to know what I am."',
        shadeChange: 1,
        consequence: { subplot: 'identity-search' },
        nextNodeId: 'act1-descent-transition'
      },
      {
        id: 'vengeance',
        text: '"The Spire made a mistake. I\'m fixing it."',
        shadeChange: -1,
        consequence: { subplot: 'vengeance-path' },
        nextNodeId: 'act1-descent-transition'
      },
      {
        id: 'protect',
        text: '"Someone needs my help down there."',
        requirement: { flag: 'astra-protected' },
        shadeChange: 2,
        consequence: { subplot: 'protector-path', debt: 0 },
        nextNodeId: 'act1-descent-transition'
      }
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
    endingName: 'The Survivor',
    xpAwarded: 50
  },

  'act1-descent-transition': {
    type: 'narrative',
    location: 'DESCENT SHAFT',
    text: `The descent is long. The shaft creaks. Light fades to amber, then rust, then the blue-green of bioluminescent growths.

You emerge into a cavern the size of a cathedral. Refugee camps and diplomatic pavilions crowd together. A dozen languages clash.

Welcome to the Midway.

Here, everyone is between places—between strata, between factions, between choices.

And here, you'll decide who you serve.`,
    consequence: { 
      flag: 'act1-complete',
      nextAct: 'act2'
    },
    nextNodeId: null // End of Act 1, triggers Act 2 load
  }

  // Additional job paths (heist, collection, package) would follow same pattern...
  // Abbreviated for modularity demonstration
};

// =============================================================================
// ACT 1 HELPER FUNCTIONS
// =============================================================================

export const getNode = (nodeId) => ACT_1_NODES[nodeId] || null;

export const getStartNode = () => ACT_1_NODES[ACT_1_META.startNode];

export const isEndNode = (nodeId) => ACT_1_META.endNodes.includes(nodeId);

export const getAvailableChoices = (node, playerState) => {
  if (node.type !== 'choice') return [];
  
  return node.choices.filter(choice => {
    // Check class requirement
    if (choice.classRequired && playerState.classId !== choice.classRequired) {
      return false;
    }
    // Check stat requirement
    if (choice.requirement?.stat) {
      const statValue = playerState.stats[choice.requirement.stat] || 0;
      if (statValue < choice.requirement.min) {
        // Check if class bypass applies
        if (!choice.requirement.orClass || playerState.classId !== choice.requirement.orClass) {
          return false;
        }
      }
    }
    // Check flag requirement
    if (choice.requirement?.flag && !playerState.flags[choice.requirement.flag]) {
      return false;
    }
    // Check marks requirement
    if (choice.requirement?.marks && playerState.marks < choice.requirement.marks) {
      return false;
    }
    // Check mana cost
    if (choice.manaCost && playerState.mana < choice.manaCost) {
      return false;
    }
    return true;
  });
};
