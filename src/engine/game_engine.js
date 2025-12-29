// =============================================================================
// GREY STRATUM — MODULAR GAME ENGINE
// /game_engine.js
// =============================================================================
// Core engine that loads acts, manages state, and runs the game loop.
// Acts, items, and systems are imported modularly.

// =============================================================================
// IMPORTS (adjust paths based on your project structure)
// =============================================================================

// Acts
import { ACT_1_NODES, ACT_1_META, getNode, getAvailableChoices } from '../data/acts/act1_circuit.js';
// Future acts would be imported similarly:
// import { ACT_2_NODES, ACT_2_META } from '../data/acts/act2_midway.js';

// Systems
import { 
  createJournalState, 
  addEntry, 
  addInsight, 
  getHint,
  ENTRY_TEMPLATES 
} from '../data/systems/echo_journal.js';

// Content
import { 
  ITEMS, 
  getItem, 
  canCombine, 
  getCombinationResult 
} from '../data/content/items.js';

// =============================================================================
// ACT REGISTRY
// =============================================================================
// Register all acts here. Engine loads them dynamically.

const ACT_REGISTRY = {
  act1: {
    meta: ACT_1_META,
    nodes: ACT_1_NODES
  }
  // act2: { meta: ACT_2_META, nodes: ACT_2_NODES },
  // act3: { meta: ACT_3_META, nodes: ACT_3_NODES },
  // etc.
};

// =============================================================================
// GAME STATE STRUCTURE
// =============================================================================

export const createInitialGameState = (character) => ({
  // Character data
  character: {
    ...character,
    marks: 0,
    debt: 0
  },
  
  // Current position
  currentAct: 'act1',
  currentNodeId: ACT_REGISTRY.act1.meta.startNode,
  
  // Shade tracking
  shade: 0,
  
  // Inventory (array of { itemId, quantity })
  inventory: [],
  
  // Echo Journal
  journal: createJournalState(),
  
  // Flags (story state, consequences)
  flags: {},
  
  // Relationships
  relationships: {},
  
  // Subplots activated
  subplots: [],
  
  // Statistics
  stats: {
    choicesMade: 0,
    combatsWon: 0,
    puzzlesSolved: 0,
    itemsFound: 0,
    secretsDiscovered: 0
  },
  
  // Scene timing (for hints)
  sceneEnteredAt: Date.now(),
  
  // Play history
  history: []
});

// =============================================================================
// CORE ENGINE FUNCTIONS
// =============================================================================

/**
 * Get the current node data
 */
export const getCurrentNode = (gameState) => {
  const act = ACT_REGISTRY[gameState.currentAct];
  if (!act) return null;
  return act.nodes[gameState.currentNodeId] || null;
};

/**
 * Process a choice and return updated game state
 */
export const processChoice = (gameState, choiceId) => {
  const node = getCurrentNode(gameState);
  if (!node || node.type !== 'choice') return gameState;
  
  const choice = node.choices.find(c => c.id === choiceId);
  if (!choice) return gameState;
  
  let newState = { ...gameState };
  
  // Apply Shade change
  if (choice.shadeChange) {
    newState.shade = Math.max(-10, Math.min(10, newState.shade + choice.shadeChange));
  }
  
  // Apply mana cost
  if (choice.manaCost) {
    newState.character = {
      ...newState.character,
      mana: Math.max(0, newState.character.mana - choice.manaCost)
    };
  }
  
  // Apply consequences
  if (choice.consequence) {
    newState = applyConsequence(newState, choice.consequence);
  }
  
  // Add journal entry
  if (choice.journalEntry) {
    newState.journal = addEntry(newState.journal, choice.journalEntry, {
      shade: newState.shade
    });
  }
  
  // Add insight
  if (choice.insight) {
    newState.journal = addInsight(newState.journal, choice.insight);
  }
  
  // Update history
  newState.history = [...newState.history, {
    nodeId: gameState.currentNodeId,
    choiceId,
    timestamp: Date.now()
  }];
  
  // Move to next node
  if (choice.nextNodeId) {
    newState.currentNodeId = choice.nextNodeId;
    newState.sceneEnteredAt = Date.now();
  }
  
  // Increment stats
  newState.stats = {
    ...newState.stats,
    choicesMade: newState.stats.choicesMade + 1
  };
  
  return newState;
};

/**
 * Process a narrative node and advance
 */
export const advanceNarrative = (gameState) => {
  const node = getCurrentNode(gameState);
  if (!node || node.type !== 'narrative') return gameState;
  
  let newState = { ...gameState };
  
  // Add item if specified
  if (node.addItem) {
    newState = addItemToInventory(newState, node.addItem);
  }
  
  // Apply consequence
  if (node.consequence) {
    newState = applyConsequence(newState, node.consequence);
  }
  
  // Move to next node
  if (node.nextNodeId) {
    newState.currentNodeId = node.nextNodeId;
    newState.sceneEnteredAt = Date.now();
  }
  
  return newState;
};

/**
 * Apply consequence flags and relationship changes
 */
const applyConsequence = (gameState, consequence) => {
  let newState = { ...gameState };
  
  // Set flags
  if (consequence.flag) {
    newState.flags = { ...newState.flags, [consequence.flag]: true };
  }
  
  // Update relationships
  const relationshipKeys = Object.keys(consequence).filter(k => k.endsWith('Relation'));
  relationshipKeys.forEach(key => {
    const npcId = key.replace('Relation', '');
    const currentValue = newState.relationships[npcId] || 0;
    newState.relationships = {
      ...newState.relationships,
      [npcId]: currentValue + consequence[key]
    };
  });
  
  // Add subplot
  if (consequence.subplot) {
    if (!newState.subplots.includes(consequence.subplot)) {
      newState.subplots = [...newState.subplots, consequence.subplot];
    }
  }
  
  // Modify debt
  if (consequence.debt !== undefined) {
    if (consequence.debt === 0) {
      newState.character = { ...newState.character, debt: 0 };
    } else {
      newState.character = { 
        ...newState.character, 
        debt: newState.character.debt + consequence.debt 
      };
    }
  }
  
  return newState;
};

// =============================================================================
// INVENTORY FUNCTIONS
// =============================================================================

export const addItemToInventory = (gameState, itemId, quantity = 1) => {
  const item = getItem(itemId);
  if (!item) return gameState;
  
  const newInventory = [...gameState.inventory];
  const existingIndex = newInventory.findIndex(i => i.itemId === itemId);
  
  if (existingIndex >= 0 && item.stackable) {
    // Stack existing item
    const maxStack = item.maxStack || 99;
    newInventory[existingIndex] = {
      ...newInventory[existingIndex],
      quantity: Math.min(maxStack, newInventory[existingIndex].quantity + quantity)
    };
  } else if (existingIndex < 0) {
    // Add new item
    newInventory.push({ itemId, quantity: item.stackable ? quantity : 1 });
  }
  
  return {
    ...gameState,
    inventory: newInventory,
    stats: {
      ...gameState.stats,
      itemsFound: gameState.stats.itemsFound + 1
    }
  };
};

export const removeItemFromInventory = (gameState, itemId, quantity = 1) => {
  const newInventory = gameState.inventory.map(item => {
    if (item.itemId !== itemId) return item;
    return { ...item, quantity: item.quantity - quantity };
  }).filter(item => item.quantity > 0);
  
  return { ...gameState, inventory: newInventory };
};

export const combineItems = (gameState, itemId1, itemId2) => {
  const result = getCombinationResult(itemId1, itemId2);
  if (!result) return { success: false, gameState, message: 'Those items can\'t be combined.' };
  
  let newState = { ...gameState };
  
  // Remove consumed items
  if (result.consumeItems === true) {
    newState = removeItemFromInventory(newState, itemId1);
    newState = removeItemFromInventory(newState, itemId2);
  } else if (Array.isArray(result.consumeItems)) {
    result.consumeItems.forEach(id => {
      newState = removeItemFromInventory(newState, id);
    });
  }
  
  // Add result item
  if (result.result) {
    newState = addItemToInventory(newState, result.result);
  }
  
  // Apply effect
  if (result.effect) {
    newState.flags = { ...newState.flags, [result.effect]: true };
  }
  
  return { success: true, gameState: newState, message: result.message };
};

export const hasItem = (gameState, itemId) => {
  return gameState.inventory.some(i => i.itemId === itemId);
};

// =============================================================================
// SKILL CHECK FUNCTIONS
// =============================================================================

export const performCheck = (gameState, stat, difficulty) => {
  const statValue = gameState.character.stats[stat] || 0;
  const roll = Math.floor(Math.random() * 6) + 1; // d6
  const total = roll + statValue;
  const target = difficulty + 6;
  const success = total >= target;
  
  return {
    success,
    roll,
    statValue,
    total,
    target,
    margin: total - target
  };
};

// =============================================================================
// COMBAT FUNCTIONS (simplified)
// =============================================================================

export const initiateCombat = (gameState, enemies) => {
  return {
    ...gameState,
    combat: {
      active: true,
      enemies: enemies.map(e => ({ ...e, currentHp: e.hp })),
      round: 1,
      log: []
    }
  };
};

export const processCombatRound = (gameState, playerAction) => {
  // Combat logic here - attack, defend, use item, flee
  // Returns updated gameState with combat results
  // This would be expanded based on your combat system needs
  return gameState;
};

// =============================================================================
// HINT SYSTEM
// =============================================================================

export const checkForHint = (gameState) => {
  const elapsed = Math.floor((Date.now() - gameState.sceneEnteredAt) / 1000);
  const node = getCurrentNode(gameState);
  
  if (!node) return null;
  
  // Check for scene-specific hints
  const hintResult = getHint(gameState.journal, gameState.currentNodeId, elapsed);
  
  if (hintResult) {
    return {
      hint: hintResult.hint.text,
      updatedJournal: hintResult.updateState
    };
  }
  
  return null;
};

// =============================================================================
// SAVE/LOAD
// =============================================================================

export const saveGame = (gameState, slot = 'autosave') => {
  const saveData = JSON.stringify(gameState);
  localStorage.setItem(`grey-stratum-save-${slot}`, saveData);
  return true;
};

export const loadGame = (slot = 'autosave') => {
  const saveData = localStorage.getItem(`grey-stratum-save-${slot}`);
  if (!saveData) return null;
  try {
    return JSON.parse(saveData);
  } catch {
    return null;
  }
};

export const listSaves = () => {
  const saves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('grey-stratum-save-')) {
      saves.push(key.replace('grey-stratum-save-', ''));
    }
  }
  return saves;
};

// =============================================================================
// ACT MANAGEMENT
// =============================================================================

export const loadAct = (gameState, actId) => {
  const act = ACT_REGISTRY[actId];
  if (!act) {
    console.error(`Act not found: ${actId}`);
    return gameState;
  }
  
  return {
    ...gameState,
    currentAct: actId,
    currentNodeId: act.meta.startNode,
    sceneEnteredAt: Date.now()
  };
};

export const getActProgress = (gameState) => {
  const act = ACT_REGISTRY[gameState.currentAct];
  if (!act) return null;
  
  return {
    actId: gameState.currentAct,
    actName: act.meta.name,
    theme: act.meta.theme,
    centralQuestion: act.meta.centralQuestion
  };
};

// =============================================================================
// EXPORT REGISTRY FOR REACT COMPONENTS
// =============================================================================

export { ACT_REGISTRY, ITEMS, getItem };
