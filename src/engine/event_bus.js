// =============================================================================
// GREY STRATUM — EVENT BUS
// /src/engine/event_bus.js
// =============================================================================
// Immutable event sourcing for provenance tracking and TCP preparation.
// Every meaningful state change emits a semantic event.

// =============================================================================
// EVENT TYPES
// =============================================================================

export const EVENT_TYPES = {
  // Game lifecycle
  GAME_STARTED: 'game.started',
  GAME_SAVED: 'game.saved',
  GAME_LOADED: 'game.loaded',
  
  // Navigation
  NODE_ENTERED: 'node.entered',
  ACT_STARTED: 'act.started',
  ACT_COMPLETED: 'act.completed',
  
  // Player actions
  CHOICE_MADE: 'choice.made',
  COMMAND_EXECUTED: 'command.executed',
  
  // Character changes
  SHADE_SHIFTED: 'shade.shifted',
  MANA_SPENT: 'mana.spent',
  MANA_RESTORED: 'mana.restored',
  DAMAGE_TAKEN: 'damage.taken',
  HEALED: 'healed',
  
  // Inventory
  ITEM_ACQUIRED: 'item.acquired',
  ITEM_USED: 'item.used',
  ITEM_COMBINED: 'item.combined',
  ITEM_REMOVED: 'item.removed',
  
  // World state
  FLAG_SET: 'flag.set',
  RELATIONSHIP_CHANGED: 'relationship.changed',
  SUBPLOT_ACTIVATED: 'subplot.activated',
  DEBT_CHANGED: 'debt.changed',
  MARKS_CHANGED: 'marks.changed',
  
  // Combat
  COMBAT_STARTED: 'combat.started',
  COMBAT_ROUND: 'combat.round',
  COMBAT_RESOLVED: 'combat.resolved',
  
  // Discovery
  LORE_UNLOCKED: 'lore.unlocked',
  INSIGHT_GAINED: 'insight.gained',
  SECRET_FOUND: 'secret.found',
  
  // Journal
  JOURNAL_ENTRY_ADDED: 'journal.entry.added',
  HINT_SHOWN: 'hint.shown',
};

// =============================================================================
// EVENT CREATION
// =============================================================================

/**
 * Create an immutable event with full context
 */
export const createEvent = (type, payload, gameState) => {
  const event = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    payload,
    timestamp: Date.now(),
    context: {
      shade: gameState?.shade ?? 0,
      actId: gameState?.currentAct ?? 'unknown',
      nodeId: gameState?.currentNodeId ?? 'unknown',
      characterClass: gameState?.character?.classId ?? 'unknown',
    },
  };
  
  // Freeze to ensure immutability
  return Object.freeze(event);
};

/**
 * Append event to log (returns new array, preserves immutability)
 */
export const appendEvent = (eventLog, event) => {
  return [...eventLog, event];
};

/**
 * Create initial event log with game start event
 */
export const createEventLog = (gameState) => {
  const startEvent = createEvent(EVENT_TYPES.GAME_STARTED, {
    characterName: gameState.character?.name,
    characterClass: gameState.character?.classId,
    startingAct: gameState.currentAct,
  }, gameState);
  
  return [startEvent];
};

// =============================================================================
// EVENT EMISSION HELPERS
// =============================================================================

/**
 * Emit a choice event
 */
export const emitChoice = (eventLog, gameState, choiceId, nodeId, consequences) => {
  const event = createEvent(EVENT_TYPES.CHOICE_MADE, {
    choiceId,
    nodeId,
    consequences: consequences || {},
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit a shade shift event
 */
export const emitShadeShift = (eventLog, gameState, oldShade, newShade, reason) => {
  const event = createEvent(EVENT_TYPES.SHADE_SHIFTED, {
    oldShade,
    newShade,
    delta: newShade - oldShade,
    reason,
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit an item acquisition event
 */
export const emitItemAcquired = (eventLog, gameState, itemId, source) => {
  const event = createEvent(EVENT_TYPES.ITEM_ACQUIRED, {
    itemId,
    source: source || 'unknown',
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit a relationship change event
 */
export const emitRelationshipChange = (eventLog, gameState, npcId, oldValue, newValue) => {
  const event = createEvent(EVENT_TYPES.RELATIONSHIP_CHANGED, {
    npcId,
    oldValue,
    newValue,
    delta: newValue - oldValue,
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit a flag set event
 */
export const emitFlagSet = (eventLog, gameState, flag, value = true) => {
  const event = createEvent(EVENT_TYPES.FLAG_SET, {
    flag,
    value,
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit node entered event
 */
export const emitNodeEntered = (eventLog, gameState, nodeId, visitCount) => {
  const event = createEvent(EVENT_TYPES.NODE_ENTERED, {
    nodeId,
    visitCount,
    isFirstVisit: visitCount === 1,
  }, gameState);
  
  return appendEvent(eventLog, event);
};

/**
 * Emit hint shown event
 */
export const emitHintShown = (eventLog, gameState, hintId, hintLevel) => {
  const event = createEvent(EVENT_TYPES.HINT_SHOWN, {
    hintId,
    hintLevel,
  }, gameState);
  
  return appendEvent(eventLog, event);
};

// =============================================================================
// STAT DERIVATION (for TCP cards)
// =============================================================================

/**
 * Derive character statistics from event log
 * These stats form the basis of the Tradable Character Protocol card
 */
export const deriveStats = (eventLog) => {
  const stats = {
    // Counts
    totalChoices: 0,
    totalCommands: 0,
    itemsAcquired: 0,
    itemsCombined: 0,
    secretsFound: 0,
    hintsUsed: 0,
    
    // Shade journey
    shadeShifts: [],
    maxShade: 0,
    minShade: 0,
    finalShade: 0,
    
    // Relationships
    relationships: {},
    
    // Flags/achievements
    flagsSet: [],
    subplotsActivated: [],
    
    // Combat
    combatsEntered: 0,
    combatsWon: 0,
    combatsLost: 0,
    combatsFled: 0,
    
    // Timeline
    gameStarted: null,
    lastEvent: null,
    totalPlaytimeEstimate: 0,
  };
  
  let currentShade = 0;
  let lastTimestamp = null;
  
  for (const event of eventLog) {
    // Track timestamps
    if (!stats.gameStarted) stats.gameStarted = event.timestamp;
    if (lastTimestamp) {
      // Add time between events (cap at 5 min to exclude AFK)
      const delta = event.timestamp - lastTimestamp;
      if (delta < 300000) stats.totalPlaytimeEstimate += delta;
    }
    lastTimestamp = event.timestamp;
    stats.lastEvent = event.timestamp;
    
    // Process by type
    switch (event.type) {
      case EVENT_TYPES.CHOICE_MADE:
        stats.totalChoices++;
        break;
        
      case EVENT_TYPES.COMMAND_EXECUTED:
        stats.totalCommands++;
        break;
        
      case EVENT_TYPES.SHADE_SHIFTED:
        currentShade = event.payload.newShade;
        stats.shadeShifts.push({
          shade: currentShade,
          timestamp: event.timestamp,
          reason: event.payload.reason,
        });
        stats.maxShade = Math.max(stats.maxShade, currentShade);
        stats.minShade = Math.min(stats.minShade, currentShade);
        stats.finalShade = currentShade;
        break;
        
      case EVENT_TYPES.ITEM_ACQUIRED:
        stats.itemsAcquired++;
        break;
        
      case EVENT_TYPES.ITEM_COMBINED:
        stats.itemsCombined++;
        break;
        
      case EVENT_TYPES.SECRET_FOUND:
        stats.secretsFound++;
        break;
        
      case EVENT_TYPES.HINT_SHOWN:
        stats.hintsUsed++;
        break;
        
      case EVENT_TYPES.RELATIONSHIP_CHANGED:
        stats.relationships[event.payload.npcId] = event.payload.newValue;
        break;
        
      case EVENT_TYPES.FLAG_SET:
        if (!stats.flagsSet.includes(event.payload.flag)) {
          stats.flagsSet.push(event.payload.flag);
        }
        break;
        
      case EVENT_TYPES.SUBPLOT_ACTIVATED:
        if (!stats.subplotsActivated.includes(event.payload.subplot)) {
          stats.subplotsActivated.push(event.payload.subplot);
        }
        break;
        
      case EVENT_TYPES.COMBAT_STARTED:
        stats.combatsEntered++;
        break;
        
      case EVENT_TYPES.COMBAT_RESOLVED:
        if (event.payload.outcome === 'victory') stats.combatsWon++;
        else if (event.payload.outcome === 'defeat') stats.combatsLost++;
        else if (event.payload.outcome === 'fled') stats.combatsFled++;
        break;
    }
  }
  
  // Convert playtime to minutes
  stats.totalPlaytimeEstimate = Math.round(stats.totalPlaytimeEstimate / 60000);
  
  return stats;
};

/**
 * Generate a character provenance summary for TCP card
 */
export const generateProvenance = (eventLog, character) => {
  const stats = deriveStats(eventLog);
  
  return {
    // Identity
    characterId: character?.id || 'unknown',
    characterName: character?.name || 'Unknown',
    characterClass: character?.classId || 'unknown',
    
    // Journey summary
    stats,
    
    // Shade alignment
    shadeAlignment: stats.finalShade > 3 ? 'luminous' 
                  : stats.finalShade < -3 ? 'void-touched' 
                  : 'balanced',
    
    // Playstyle indicators
    playstyle: {
      explorer: stats.totalCommands > stats.totalChoices * 2,
      decisive: stats.hintsUsed < 3,
      completionist: stats.secretsFound >= 5,
      pacifist: stats.combatsEntered > 0 && stats.combatsWon === 0,
      warrior: stats.combatsWon >= 5,
    },
    
    // Hash for verification (simplified)
    provenanceHash: generateHash(eventLog),
    
    // Metadata
    generatedAt: Date.now(),
    eventCount: eventLog.length,
  };
};

/**
 * Simple hash for event log verification
 */
const generateHash = (eventLog) => {
  const str = eventLog.map(e => `${e.type}:${e.timestamp}`).join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

// =============================================================================
// EVENT LOG QUERIES
// =============================================================================

/**
 * Get events of a specific type
 */
export const getEventsByType = (eventLog, type) => {
  return eventLog.filter(e => e.type === type);
};

/**
 * Get events in a time range
 */
export const getEventsInRange = (eventLog, startTime, endTime) => {
  return eventLog.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
};

/**
 * Get the most recent event of a type
 */
export const getMostRecentEvent = (eventLog, type) => {
  const events = getEventsByType(eventLog, type);
  return events.length > 0 ? events[events.length - 1] : null;
};

/**
 * Check if an event type has occurred
 */
export const hasEventOccurred = (eventLog, type, payload = null) => {
  return eventLog.some(e => {
    if (e.type !== type) return false;
    if (payload === null) return true;
    return Object.keys(payload).every(key => e.payload[key] === payload[key]);
  });
};
