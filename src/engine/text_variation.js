// =============================================================================
// GREY STRATUM — TEXTURAL VARIATION SYSTEM
// /src/engine/text_variation.js
// =============================================================================
// Provides non-authoritative descriptive variation for backtracking.
// Keeps exploration fresh without changing game state or puzzle-relevant facts.

// =============================================================================
// LOCATION VARIATIONS
// =============================================================================
// Key = nodeId, Value = array of atmospheric variations for revisits
// First visit always shows canonical node.text

export const LOCATION_VARIATIONS = {
  // ─────────────────────────────────────────────────────────────────────────
  // CIRCUIT HUB (main hub location)
  // ─────────────────────────────────────────────────────────────────────────
  'circuit-hub': [
    "The Hub's usual chaos. Today the crowd seems thinner—or maybe you're just used to it now.",
    "Market day. Voices echo off metal walls, haggling in a dozen dialects.",
    "A maintenance drone whirs past overhead. Business as usual in the Circuit.",
    "The air tastes of recycled oxygen and desperation. Home, such as it is.",
    "Corso's usual spot by the water reclaimer is empty. They'll be back.",
    "Someone's cooking synth-protein nearby. Your stomach reminds you it exists.",
  ],
  
  'circuit-hub-return': [
    "Back in the Hub. The familiar press of bodies and commerce surrounds you.",
    "The Hub welcomes you back with its usual indifference.",
    "Returning to the Hub feels like slipping into old clothes—worn, but familiar.",
    "The crowds part and reform around you. Just another face in the Circuit.",
  ],
  
  // ─────────────────────────────────────────────────────────────────────────
  // TRANSIT HUB (arrival area)
  // ─────────────────────────────────────────────────────────────────────────
  'circuit-arrival': [
    "The receiving bay. Red emergency lights still pulse their endless rhythm.",
    "This is where you arrived. The descent platform sits dormant now.",
    "The transit hub. A one-way door to a world you're still learning.",
    "Recycled air and machine oil. The smell of the Circuit's welcome.",
  ],
  
  // ─────────────────────────────────────────────────────────────────────────
  // TRIBUNAL (prologue - rarely revisited)
  // ─────────────────────────────────────────────────────────────────────────
  'prologue-tribunal': [
    "The memory of this place still burns. Mirrored masks. Absolute light.",
  ],
  
  // ─────────────────────────────────────────────────────────────────────────
  // DESCENT AREAS
  // ─────────────────────────────────────────────────────────────────────────
  'descent-decision': [
    "The descent shafts. Darkness below promises answers—or oblivion.",
    "Standing at the edge again. The Shade pulses, eager to descend.",
    "The makeshift elevators creak in the darkness. Someone's always going down.",
  ],
  
  // ─────────────────────────────────────────────────────────────────────────
  // JOB LOCATIONS
  // ─────────────────────────────────────────────────────────────────────────
  'escort-start': [
    "The maintenance corridor stretches ahead. Shadows move in the periphery.",
    "Back in the tunnels. The cargo route feels more familiar now.",
  ],
  
  'escort-ambush': [
    "The ambush site. Scorch marks on the walls remember what happened here.",
  ],
};

// =============================================================================
// ATMOSPHERIC ADDITIONS
// =============================================================================
// Short phrases that can be appended to any location description

const ATMOSPHERIC_ADDITIONS = {
  // Time-based
  early: [
    "The shift change hasn't happened yet—the corridors are quiet.",
    "Early risers move with purpose. The Circuit never truly sleeps.",
  ],
  late: [
    "The lights have dimmed to night-cycle. Shadows grow longer.",
    "Most have retreated to their bunks. Only the desperate still move.",
  ],
  
  // Shade-based
  lowShade: [
    "Your Shade feels heavy today, pulsing with dark resonance.",
    "The darkness in you recognizes the darkness here.",
  ],
  highShade: [
    "Your Shade burns bright. Some turn away from its glow.",
    "The light behind your eyes draws curious glances.",
  ],
  
  // Random atmospheric
  general: [
    "A distant rumble echoes from somewhere deeper.",
    "The air recyclers hum their eternal song.",
    "Somewhere, a child is crying. The sound fades.",
    "A flickering light panel strobes erratically, then steadies.",
    "The metallic taste of filtered air coats your tongue.",
    "Pipes groan overhead, carrying water to places you'll never see.",
  ],
};

// =============================================================================
// DIEGETIC ERROR MESSAGES
// =============================================================================
// In-world responses for parser failures

export const DIEGETIC_ERRORS = {
  // Unknown command
  unknown: [
    "Your Shade flickers—that action doesn't parse in this reality.",
    "The Circuit doesn't respond to that. The walls absorb your intent.",
    "Static. The command fails to register in the local system.",
    "Your words dissipate into the recycled air. Try something else.",
    "The implant behind your eyes pulses once. Not understood.",
    "That input returns null. The Circuit demands clearer instruction.",
  ],
  
  // Can't see target
  cantSee: [
    "Your eyes scan the space. Whatever you're looking for isn't here.",
    "The Shade reveals nothing matching that description.",
    "You search, but find only shadows and recycled air.",
    "Not here. Perhaps somewhere else in the Circuit.",
  ],
  
  // Can't take
  cantTake: [
    "Your fingers close on nothing. That's not something you can carry.",
    "Some things aren't meant to be taken. This is one of them.",
    "The object resists your attempt to claim it.",
    "Taking that would solve nothing. Leave it.",
  ],
  
  // Can't go back
  cantGoBack: [
    "The path behind has closed. Only forward remains.",
    "There's no returning from here. The Circuit flows one way.",
    "Your footsteps echo, but the way back is gone.",
  ],
  
  // Can't use
  cantUse: [
    "The object sits inert in your hands. Not like this.",
    "You turn it over, but find no application here.",
    "The use eludes you. Perhaps in another context.",
  ],
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Get location text with variation for revisits
 * @param {Object} node - The current story node
 * @param {number} visitCount - How many times player has visited this node
 * @param {Object} gameState - Current game state (for context)
 * @returns {string} - The text to display
 */
export const getLocationText = (node, visitCount, gameState = null) => {
  // First visit: always show canonical text
  if (visitCount <= 1) {
    return node.text;
  }
  
  // Check for variations
  const variations = LOCATION_VARIATIONS[node.id];
  if (!variations || variations.length === 0) {
    return node.text; // No variations defined, use canonical
  }
  
  // Rotate through variations (deterministic based on visit count)
  const variationIndex = (visitCount - 2) % variations.length;
  let text = variations[variationIndex];
  
  // Optionally add atmospheric element
  if (gameState && Math.random() < 0.3) {
    const addition = getAtmosphericAddition(gameState);
    if (addition) {
      text += '\n\n' + addition;
    }
  }
  
  return text;
};

/**
 * Get an atmospheric addition based on game state
 */
const getAtmosphericAddition = (gameState) => {
  const additions = [];
  
  // Shade-based
  if (gameState.shade <= -5) {
    additions.push(...ATMOSPHERIC_ADDITIONS.lowShade);
  } else if (gameState.shade >= 5) {
    additions.push(...ATMOSPHERIC_ADDITIONS.highShade);
  }
  
  // Always include general atmosphere options
  additions.push(...ATMOSPHERIC_ADDITIONS.general);
  
  // Pick one randomly
  return additions[Math.floor(Math.random() * additions.length)];
};

/**
 * Get a diegetic error message
 * @param {string} errorType - Type of error (unknown, cantSee, cantTake, etc.)
 * @returns {string} - In-world error message
 */
export const getDiegeticError = (errorType) => {
  const messages = DIEGETIC_ERRORS[errorType] || DIEGETIC_ERRORS.unknown;
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get a contextual "can't see" error
 * @param {string} target - What the player was looking for
 * @returns {string} - Diegetic response
 */
export const getCantSeeError = (target) => {
  const base = getDiegeticError('cantSee');
  // Sometimes include what they were looking for
  if (Math.random() < 0.5 && target) {
    return `"${target}"? ${base}`;
  }
  return base;
};

/**
 * Get a contextual "can't take" error
 */
export const getCantTakeError = () => {
  return getDiegeticError('cantTake');
};

/**
 * Get a contextual "can't go back" error
 */
export const getCantGoBackError = () => {
  return getDiegeticError('cantGoBack');
};

/**
 * Get a contextual unknown command error
 */
export const getUnknownCommandError = () => {
  return getDiegeticError('unknown');
};
