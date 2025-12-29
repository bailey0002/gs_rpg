// =============================================================================
// GREY STRATUM — ITEM CATALOG
// /data/content/items.js
// =============================================================================
// All items defined here. Import into acts as needed.
// To add new items: add entry here, reference by ID in act files.

export const ITEMS = {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSUMABLES (stackable, usable anytime)
  // ─────────────────────────────────────────────────────────────────────────
  'med-stim': {
    id: 'med-stim',
    name: 'Med-Stim',
    category: 'consumable',
    stackable: true,
    maxStack: 5,
    description: 'Emergency medical injection. Crude but effective.',
    examineText: 'A pressurized injector filled with blue synth-fluid. The label says "FOR EXTERNAL USE ONLY" but everyone ignores that.',
    effect: { type: 'heal', stat: 'tonitrus', amount: 8 },
    value: 50
  },

  'ration-pack': {
    id: 'ration-pack',
    name: 'Ration Pack',
    category: 'consumable',
    stackable: true,
    maxStack: 5,
    description: 'Compressed nutrients. Tastes like regret.',
    examineText: 'Circuit-standard meal replacement. The wrapper promises "all essential nutrients." It doesn\'t promise flavor.',
    effect: { type: 'heal', stat: 'tonitrus', amount: 2 },
    useInWorld: true, // Can be used as distraction
    value: 20
  },

  'mana-crystal': {
    id: 'mana-crystal',
    name: 'Shade Crystal',
    category: 'consumable',
    stackable: true,
    maxStack: 3,
    description: 'Crystallized Shade energy. Restores your reserves.',
    examineText: 'It pulses in your hand, resonating with the implant behind your eyes. The Core made these, once.',
    effect: { type: 'restore', stat: 'mana', amount: 5 },
    value: 100
  },

  'lock-bypass': {
    id: 'lock-bypass',
    name: 'Lock Bypass',
    category: 'consumable',
    stackable: true,
    maxStack: 3,
    description: 'Single-use electronic lockpick.',
    examineText: 'A disposable circuit that tricks basic locks into thinking they\'re authorized. Won\'t work on anything serious.',
    effect: { type: 'unlock', level: 'basic' },
    value: 100
  },

  // ─────────────────────────────────────────────────────────────────────────
  // KEY ITEMS (non-stackable, quest-related)
  // ─────────────────────────────────────────────────────────────────────────
  'descent-manifest': {
    id: 'descent-manifest',
    name: 'Descent Manifest',
    category: 'lore',
    stackable: false,
    description: 'A cargo list of the condemned.',
    examineText: 'Six names before yours, all marked "RESOLVED." The word feels euphemistic. Your name is seventh. The ink is still fresh.',
    loreUnlock: 'descent-records'
  },

  'broken-bird-toy': {
    id: 'broken-bird-toy',
    name: 'Broken Bird Toy',
    category: 'key',
    stackable: false,
    description: 'A mechanical bird with a snapped wing.',
    examineText: 'Pre-Collapse craftsmanship. Someone loved this once. A child, probably. The wing mechanism still twitches if you press the belly.',
    passiveEffect: { type: 'stat_bonus', stat: 'rsv', amount: 1, context: 'emotional' }
  },

  'acolyte-access-card': {
    id: 'acolyte-access-card',
    name: 'Acolyte\'s Access Card',
    category: 'key',
    stackable: false,
    description: 'Temple clearance. Level 1 only.',
    examineText: 'Seven\'s card. The holographic seal shows a praying figure surrounded by data streams. "ACOLYTE - LIMITED ACCESS" is printed in small text.',
    unlocks: ['temple-level-1']
  },

  'data-chip-grey1': {
    id: 'data-chip-grey1',
    name: 'GREY-1 Data Chip',
    category: 'key',
    stackable: false,
    description: 'Contains your file. And questions.',
    examineText: 'The chip is warm to the touch. Your Shade responds to it—recognition? The data inside rewrites everything you thought you knew.',
    loreUnlock: 'grey-1-origin',
    questFlag: 'discovered-grey1'
  },

  'spire-tracker': {
    id: 'spire-tracker',
    name: 'Spire Tracker',
    category: 'key',
    stackable: false,
    description: 'Micro-beacon. Someone wants to find you.',
    examineText: 'Smaller than a fingernail. Broadcasting on Spire frequencies. You could destroy it, misdirect it, or let it lead them to you.',
    canCombine: ['cargo-drone']
  },

  'corso-debt-marker': {
    id: 'corso-debt-marker',
    name: 'Debt Marker',
    category: 'key',
    stackable: false,
    description: 'You owe the Broker\'s Guild.',
    examineText: 'A digital token representing your debt to Corso. The number fluctuates slightly—interest, probably. Current balance: {debtAmount} marks.',
    dynamic: true // Value updates based on game state
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMBINATION ITEMS (can be combined with others)
  // ─────────────────────────────────────────────────────────────────────────
  'adhesive-gum': {
    id: 'adhesive-gum',
    name: 'Adhesive Gum',
    category: 'tool',
    stackable: false,
    description: 'Industrial nano-adhesive. Very sticky.',
    examineText: 'Circuit workers use this to patch everything from pipes to wounds. Bonds to almost any surface and holds indefinitely.',
    canCombine: ['wire-coil', 'branch']
  },

  'wire-coil': {
    id: 'wire-coil',
    name: 'Wire Coil',
    category: 'tool',
    stackable: false,
    description: 'Flexible conductive wire. Multiple uses.',
    examineText: 'About two meters of thin, strong wire. Good for repairs, traps, or reaching things you can\'t quite grasp.',
    canCombine: ['adhesive-gum']
  },

  'sticky-wire-tool': {
    id: 'sticky-wire-tool',
    name: 'Sticky Wire Tool',
    category: 'tool',
    stackable: false,
    description: 'Improvised reaching tool. Gum + wire.',
    examineText: 'Your creation. The gum adheres to the wire tip, letting you snag small objects from a distance. Clever.',
    madeFrom: ['adhesive-gum', 'wire-coil'],
    useFor: ['retrieve-from-grate', 'grab-distant-object']
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EQUIPMENT (non-stackable, equippable)
  // ─────────────────────────────────────────────────────────────────────────
  'maintenance-tool': {
    id: 'maintenance-tool',
    name: 'Maintenance Tool',
    category: 'equipment',
    slot: 'tool',
    stackable: false,
    description: 'Multi-purpose repair device.',
    examineText: 'Standard issue for anyone who works with their hands. Can disable minor electronics, open panels, and perform basic repairs.',
    abilities: ['disable-electronics', 'open-panel', 'basic-repair']
  }
};

// =============================================================================
// ITEM COMBINATIONS
// =============================================================================
// Define what happens when items are combined

export const COMBINATIONS = {
  'adhesive-gum+wire-coil': {
    result: 'sticky-wire-tool',
    message: 'The gum adheres to the wire, creating a sticky extension tool. Clever.',
    consumeItems: true
  },
  'spire-tracker+cargo-drone': {
    result: null, // No new item, just an effect
    effect: 'misdirect-hunters',
    message: 'You attach the tracker to a departing drone. The Hunters will follow the wrong signal.',
    consumeItems: ['spire-tracker']
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getItem = (id) => ITEMS[id] || null;

export const canCombine = (item1Id, item2Id) => {
  const key1 = `${item1Id}+${item2Id}`;
  const key2 = `${item2Id}+${item1Id}`;
  return COMBINATIONS[key1] || COMBINATIONS[key2] || null;
};

export const getCombinationResult = (item1Id, item2Id) => {
  const combo = canCombine(item1Id, item2Id);
  if (!combo) return null;
  return {
    ...combo,
    resultItem: combo.result ? ITEMS[combo.result] : null
  };
};
