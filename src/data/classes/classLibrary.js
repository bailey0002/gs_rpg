// =============================================================================
// GREY STRATUM — CLASS LIBRARY
// /src/data/classes/classLibrary.js
// =============================================================================
// Character classes with Grok-generated portrait paths.
// DO NOT MODIFY class IDs - they are referenced by story nodes and saves.

export const CLASS_LIBRARY = {
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Frontline Guardian',
    description: 'Absorbs damage and protects allies with unbreakable resolve. Masters of defensive Shade techniques.',
    shadeAffinity: 'light', // Tends toward protective, lawful choices
    baseStats: { phy: 4, int: 2, def: 4 },
    baseHp: 13,
    baseMana: 6,
    abilities: ['bulwark', 'shield-ally'],
    images: [
      { id: 's1', name: 'Iron Wall', file: 'character-images/sentinel/s1.jpg' },
      { id: 's2', name: 'Aegis Bearer', file: 'character-images/sentinel/s2.jpg' },
      { id: 's3', name: 'Dawn Guard', file: 'character-images/sentinel/s3.jpg' },
    ],
  },

  'void-stalker': {
    id: 'void-stalker',
    name: 'Void Stalker',
    role: 'Shadow Assassin',
    description: 'Strikes from darkness with lethal precision. Can slip between shadows using forbidden Shade techniques.',
    shadeAffinity: 'dark', // Tends toward pragmatic, ends-justify-means choices
    baseStats: { phy: 4, int: 3, def: 2 },
    baseHp: 10,
    baseMana: 8,
    abilities: ['shadow-step', 'assassinate'],
    images: [
      { id: 'st1', name: 'Crimson Shadow', file: 'character-images/stalker/st1.jpg' },
      { id: 'st2', name: 'Night Phantom', file: 'character-images/stalker/st2.jpg' },
      { id: 'st3', name: 'Abyss Walker', file: 'character-images/stalker/st3.jpg' },
      { id: 'st4', name: 'Eclipse Blade', file: 'character-images/stalker/st4.jpg' },
    ],
  },

  oracle: {
    id: 'oracle',
    name: 'Oracle',
    role: 'Reality Manipulator',
    description: 'Bends probability and perceives hidden truths. Can read the Shade alignment of others.',
    shadeAffinity: 'neutral', // Choices reveal truth regardless of comfort
    baseStats: { phy: 2, int: 5, def: 2 },
    baseHp: 9,
    baseMana: 12,
    abilities: ['shade-read', 'foresight', 'probability-shift'],
    images: [
      { id: 'o1', name: 'Fate Weaver', file: 'character-images/oracle/o1.jpg' },
      { id: 'o2', name: 'Void Seer', file: 'character-images/oracle/o2.jpg' },
    ],
  },

  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    role: 'Tech Warrior',
    description: 'Augmented soldier combining combat prowess with tactical systems. Balanced offense and defense.',
    shadeAffinity: 'neutral',
    baseStats: { phy: 3, int: 4, def: 3 },
    baseHp: 11,
    baseMana: 7,
    abilities: ['tactical-scan', 'power-strike'],
    images: [
      { id: 'v1', name: 'Chrome Blade', file: 'character-images/vanguard/v1.jpg' },
      { id: 'v2', name: 'Steel Pioneer', file: 'character-images/vanguard/v2.jpg' },
    ],
  },

  forger: {
    id: 'forger',
    name: 'Forger',
    role: 'Combat Engineer',
    description: 'Creates and repairs technology. Can craft items and disable electronic systems.',
    shadeAffinity: 'neutral',
    baseStats: { phy: 5, int: 3, def: 3 },
    baseHp: 13,
    baseMana: 5,
    abilities: ['craft', 'disable-tech', 'jury-rig'],
    images: [
      { id: 'f1', name: 'Spark Wright', file: 'character-images/forger/f1.jpg' },
      { id: 'f2', name: 'Iron Smith', file: 'character-images/forger/f2.jpg' },
    ],
  },

  cleric: {
    id: 'cleric',
    name: 'Cleric',
    role: 'Shade Healer',
    description: 'Channels Shade energy for restoration and protection. Can sense corruption and purify it.',
    shadeAffinity: 'light',
    baseStats: { phy: 2, int: 5, def: 2 },
    baseHp: 10,
    baseMana: 10,
    abilities: ['heal', 'purify', 'sense-corruption'],
    images: [
      { id: 'c1', name: 'Void Priestess', file: 'character-images/cleric/c1.jpg' },
      { id: 'c2', name: 'Star Mender', file: 'character-images/cleric/c2.jpg' },
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a class by ID
 */
export const getClass = (classId) => CLASS_LIBRARY[classId] || null;

/**
 * Get all classes as array
 */
export const getAllClasses = () => Object.values(CLASS_LIBRARY);

/**
 * Get all class IDs
 */
export const getClassIds = () => Object.keys(CLASS_LIBRARY);

/**
 * Check if class ID is valid
 */
export const isValidClass = (classId) => classId in CLASS_LIBRARY;

/**
 * Get images for a specific class
 */
export const getClassImages = (classId) => {
  const cls = CLASS_LIBRARY[classId];
  return cls ? cls.images : [];
};

/**
 * Create a character from class selection
 * Includes provenance log for TCP card tracking
 */
export const createCharacterFromClass = (classId, name, selectedImageId) => {
  const cls = CLASS_LIBRARY[classId];
  if (!cls) return null;

  const selectedImage = cls.images.find(img => img.id === selectedImageId) || cls.images[0];
  const creationDate = new Date().toISOString();

  return {
    id: `char-${Date.now()}`,
    name,
    classId: cls.id,
    className: cls.name,
    role: cls.role,
    portraitPath: selectedImage.file,
    portraitName: selectedImage.name,
    stats: { ...cls.baseStats },
    hp: cls.baseHp,
    maxHp: cls.baseHp,
    mana: cls.baseMana,
    maxMana: cls.baseMana,
    xp: 0,
    level: 1,
    abilities: [...cls.abilities],
    version: '1.0',
    createdAt: creationDate,
    
    // TCP Card Provenance - tracks character history for trading
    provenanceLog: [
      {
        event: 'created',
        date: creationDate,
        details: {
          classId: cls.id,
          className: cls.name,
          portraitId: selectedImageId,
          portraitName: selectedImage.name,
          initialStats: { ...cls.baseStats },
          initialHp: cls.baseHp,
          initialMana: cls.baseMana,
        }
      }
    ],
  };
};

/**
 * Add a provenance event to a character's log
 * Use for level ups, major choices, trades, etc.
 */
export const addProvenanceEvent = (character, event, details = {}) => {
  if (!character || !character.provenanceLog) return character;
  
  return {
    ...character,
    provenanceLog: [
      ...character.provenanceLog,
      {
        event,
        date: new Date().toISOString(),
        details,
      }
    ]
  };
};

/**
 * Get a summary of character provenance for display
 */
export const getProvenanceSummary = (character) => {
  if (!character?.provenanceLog) return null;
  
  const log = character.provenanceLog;
  return {
    totalEvents: log.length,
    createdAt: log[0]?.date || character.createdAt,
    lastEvent: log[log.length - 1],
    levelUps: log.filter(e => e.event === 'level-up').length,
    majorChoices: log.filter(e => e.event === 'major-choice').length,
    trades: log.filter(e => e.event === 'traded').length,
  };
};

// =============================================================================
// EXPORT DEFAULT FOR CONVENIENCE
// =============================================================================

export default CLASS_LIBRARY;
