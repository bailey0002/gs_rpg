import React, { useState, useEffect } from 'react';

// =============================================================================
// GREY STRATUM v2.0 - WITH GROK CHARACTER ART
// =============================================================================

// =============================================================================
// CHARACTER CLASS DEFINITIONS (Based on Grok's optimized table)
// =============================================================================

const CLASS_LIBRARY = {
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Frontline Guardian',
    description: 'Absorbs damage and protects allies with unbreakable resolve.',
    baseStats: { phy: 4, int: 2, def: 4 },
    baseHp: 14,
    images: [
      { id: 's1', name: 'Iron Guardian', file: 'character-images/sentinel/s1.jpg' },
      { id: 's2', name: 'Steel Warden', file: 'character-images/sentinel/s2.jpg' },
      { id: 's3', name: 'Bastion Prime', file: 'character-images/sentinel/s3.jpg' },
    ],
  },
  cleric: {
    id: 'cleric',
    name: 'Cosmic Cleric',
    role: 'Ethereal Healer',
    description: 'Channels cosmic energies to mend allies and balance life forces.',
    baseStats: { phy: 2, int: 5, def: 2 },
    baseHp: 10,
    images: [
      { id: 'c1', name: 'Void Priestess', file: 'character-images/cleric/c1.jpg' },
      { id: 'c2', name: 'Star Mender', file: 'character-images/cleric/c2.jpg' },
    ],
  },
  stalker: {
    id: 'stalker',
    name: 'Void Stalker',
    role: 'Shadow Assassin',
    description: 'Strikes from darkness with lethal precision and void-touched blades.',
    baseStats: { phy: 4, int: 3, def: 2 },
    baseHp: 10,
    images: [
      { id: 'st1', name: 'Crimson Shadow', file: 'character-images/stalker/st1.jpg' },
      { id: 'st2', name: 'Night Phantom', file: 'character-images/stalker/st2.jpg' },
      { id: 'st3', name: 'Abyss Walker', file: 'character-images/stalker/st3.jpg' },
      { id: 'st4', name: 'Eclipse Blade', file: 'character-images/stalker/st4.jpg' },
    ],
  },
  vanguard: {
    id: 'vanguard',
    name: 'Arc Vanguard',
    role: 'Ranged Striker',
    description: 'Delivers devastating electrical firepower from optimal range.',
    baseStats: { phy: 3, int: 4, def: 3 },
    baseHp: 11,
    images: [
      { id: 'v1', name: 'Storm Striker', file: 'character-images/vanguard/v1.jpg' },
      { id: 'v2', name: 'Thunder Lance', file: 'character-images/vanguard/v2.jpg' },
    ],
  },
  forger: {
    id: 'forger',
    name: 'Stratum Forge',
    role: 'Master Crafter',
    description: 'Shapes stratum metal into weapons and battlefield constructs.',
    baseStats: { phy: 5, int: 3, def: 3 },
    baseHp: 13,
    images: [
      { id: 'f1', name: 'Iron Smith', file: 'character-images/forger/f1.jpg' },
      { id: 'f2', name: 'Anvil Lord', file: 'character-images/forger/f2.jpg' },
    ],
  },
  oracle: {
    id: 'oracle',
    name: 'Nexus Oracle',
    role: 'Reality Manipulator',
    description: 'Bends probability and controls the battlefield through foresight.',
    baseStats: { phy: 2, int: 5, def: 2 },
    baseHp: 9,
    images: [
      { id: 'o1', name: 'Fate Weaver', file: 'character-images/oracle/o1.jpg' },
      { id: 'o2', name: 'Void Seer', file: 'character-images/oracle/o2.jpg' },
    ],
  },
};

// =============================================================================
// QUEST DATA - The Silent Station
// =============================================================================

const QUEST = {
  nodes: {
    'start': { 
      type: 'narrative', 
      location: 'SECTOR 7 — APPROACH', 
      text: `Your shuttle cuts through debris surrounding Station Omega-7. Dark except for a blinking light.\n\nThirty years ago—a xenobiology lab. Then silence.\n\nThree days ago: "EXPERIMENT VIABLE. AWAITING RETRIEVAL."\n\nYour mission: Find out why.`, 
      nextNodeId: 'airlock' 
    },
    'airlock': { 
      type: 'choice', 
      location: 'STATION — AIRLOCK', 
      text: `Stale air. Amber emergency lights. Scanner shows faint power signatures deeper in.\n\nMain corridor ahead. Maintenance shaft with fresh scrape marks to the left.\n\nMetal groans in the distance.`, 
      choices: [
        { id: 'a', text: 'Main corridor, weapon ready', nextNodeId: 'corridor-check' },
        { id: 'b', text: 'Maintenance shaft', nextNodeId: 'shaft-check' },
        { id: 'c', text: 'Scan for life signs', nextNodeId: 'scan-check' },
        { id: 'd', text: 'Return to ship', nextNodeId: 'retreat' }
      ]
    },
    'corridor-check': { 
      type: 'check', 
      text: 'Advancing. Scraping from overhead vent. Something watching.\n\nCombat instincts engage.', 
      checkType: 'phy', 
      difficulty: 3, 
      successNodeId: 'corridor-win', 
      failureNodeId: 'corridor-ambush', 
      successXp: 15 
    },
    'corridor-win': { 
      type: 'narrative', 
      text: 'Spin and strike. Blade through grate as drone drops—claws miss. It sparks and dies.\n\nContinue forward.', 
      nextNodeId: 'main-lab' 
    },
    'corridor-ambush': { 
      type: 'combat', 
      text: 'Too slow. Drone on your back, claws raking armor. Roll to throw it off.\n\nRed sensors. Feral.', 
      enemy: { name: 'Feral Drone', hp: 6, phy: 2, def: 1 }, 
      victoryNodeId: 'drone-win', 
      defeatNodeId: 'defeat', 
      fleeNodeId: 'main-lab', 
      victoryXp: 25 
    },
    'drone-win': { 
      type: 'reward', 
      text: 'Drone sparks out. Among parts: intact med-stim.', 
      rewards: [{ type: 'item', itemId: 'med-stim' }], 
      nextNodeId: 'main-lab' 
    },
    'shaft-check': { 
      type: 'check', 
      location: 'MAINTENANCE SHAFT', 
      text: 'Tight space. Tally marks on walls. Junction box—wires rerouted.\n\nCan you trace the modification?', 
      checkType: 'int', 
      difficulty: 3, 
      successNodeId: 'shaft-win', 
      failureNodeId: 'shaft-fail', 
      successXp: 20 
    },
    'shaft-win': { 
      type: 'narrative', 
      text: 'All power routed to xenobiology lab. And you found a direct path—above the main lab. Drop in from above.', 
      nextNodeId: 'lab-above' 
    },
    'shaft-fail': { 
      type: 'narrative', 
      text: 'Wiring too corrupted. Dead ends. Eventually opens to main corridor.', 
      nextNodeId: 'main-lab' 
    },
    'scan-check': { 
      type: 'check', 
      text: 'Scanner sweeps corridor. Decades of ghosts to filter.\n\nTakes skill to get clear reading.', 
      checkType: 'int', 
      difficulty: 4, 
      successNodeId: 'scan-win', 
      failureNodeId: 'scan-fail', 
      successXp: 15 
    },
    'scan-win': { 
      type: 'choice', 
      text: 'Three signatures:\n\n• Vent contact—mechanical, erratic. Drone.\n• Main lab—active cryo. Something cold.\n• Secondary lab—organic. Alive.\n\nSomeone else is here.', 
      choices: [
        { id: 'a', text: 'Main lab carefully', nextNodeId: 'main-lab' },
        { id: 'b', text: 'Investigate survivor', nextNodeId: 'survivor' },
        { id: 'c', text: 'Clear drone first', nextNodeId: 'corridor-check' }
      ]
    },
    'scan-fail': { 
      type: 'narrative', 
      text: 'Static. No clear read. Old-fashioned way.', 
      nextNodeId: 'airlock' 
    },
    'survivor': { 
      type: 'choice', 
      location: 'SECONDARY LAB', 
      text: `Makeshift quarters. Cot, nutrient paste.\n\nGreyed woman, shock prod ready.\n\n"Thirty years containing it. Now they want it back?"\n\n"Cryo failing. When it wakes..." She shakes her head.`, 
      choices: [
        { id: 'a', text: '"What is it?"', nextNodeId: 'tanaka-info' },
        { id: 'b', text: '"Help me destroy it."', nextNodeId: 'tanaka-ally' },
        { id: 'c', text: 'Go to main lab', nextNodeId: 'main-lab' }
      ]
    },
    'tanaka-info': { 
      type: 'narrative', 
      text: `"Adaptive organism. Found dormant. Wasn't dormant—waiting.\n\nWhen thawed, it integrated. Equipment. Researchers. I reached the bulkheads.\n\nThirty years keeping cryo running. Hours until it wakes. And it remembers everything it absorbed."`, 
      nextNodeId: 'lab-choice' 
    },
    'tanaka-ally': { 
      type: 'reward', 
      text: `Hope in her eyes.\n\n"Overload reactor—vaporize the lab."\n\nShe hands you a keycard. "Control room. I'll start the sequence."`, 
      rewards: [{ type: 'item', itemId: 'keycard' }], 
      nextNodeId: 'lab-choice' 
    },
    'main-lab': { 
      type: 'choice', 
      location: 'MAIN LAB — EXTERIOR', 
      text: 'Through viewport: cryo pod failing. Condensation. Temperature climbing.\n\nDoor controls active.', 
      choices: [
        { id: 'a', text: 'Enter', nextNodeId: 'lab-interior' },
        { id: 'b', text: 'Hack cryo remotely', nextNodeId: 'hack-check' }
      ]
    },
    'lab-choice': { 
      type: 'choice', 
      location: 'MAIN LAB — EXTERIOR', 
      text: 'Cryo pod failing through viewport.', 
      choices: [
        { id: 'a', text: 'Enter and face it', nextNodeId: 'lab-interior' },
        { id: 'b', text: 'Overload reactor', nextNodeId: 'reactor', requirement: { itemId: 'keycard' } },
        { id: 'c', text: 'Hack cryo', nextNodeId: 'hack-check' }
      ]
    },
    'lab-above': { 
      type: 'choice', 
      location: 'MAIN LAB — CEILING', 
      text: 'Through grate: cryo pod. Something pressing against glass. Testing.\n\nAlready awake. Waiting.', 
      choices: [
        { id: 'a', text: 'Surprise attack', nextNodeId: 'boss-adv' },
        { id: 'b', text: 'Find another way', nextNodeId: 'lab-choice' }
      ]
    },
    'hack-check': { 
      type: 'check', 
      text: 'External panel. Reroute power to cryo. System fights back—corrupted code, active resistance.', 
      checkType: 'int', 
      difficulty: 5, 
      successNodeId: 'hack-win', 
      failureNodeId: 'hack-fail', 
      successXp: 25 
    },
    'hack-win': { 
      type: 'reward', 
      text: 'Cryo stabilizes. Downloaded research logs too.', 
      rewards: [{ type: 'xp', amount: 25 }, { type: 'item', itemId: 'data-chip' }], 
      nextNodeId: 'lab-choice' 
    },
    'hack-fail': { 
      type: 'narrative', 
      text: 'System rejects. Klaxons. Cryo emergency shutdown.\n\nPod opening.', 
      nextNodeId: 'lab-interior' 
    },
    'lab-interior': { 
      type: 'narrative', 
      location: 'MAIN LAB — INTERIOR', 
      text: `Lab preserved. Equipment running.\n\nExcept the bodies.\n\nThree researchers—part of the organism now. Fused with equipment, walls. Biomechanical roots from cryo pod.\n\nPod cracks.\n\nToo many limbs. Too many eyes. Absorbed faces.\n\n"NEW. NEW PATTERNS."`, 
      nextNodeId: 'boss-fight' 
    },
    'reactor': { 
      type: 'choice', 
      location: 'ENGINEERING', 
      text: 'Reactor hums. Enough for a century or instant vaporization.\n\nDisable safeties. Push critical. Three minutes.\n\nYour hand hovers.', 
      choices: [
        { id: 'a', text: 'Initiate overload', nextNodeId: 'victory-destroy' },
        { id: 'b', text: 'Face it directly', nextNodeId: 'boss-fight' }
      ]
    },
    'boss-adv': { 
      type: 'combat', 
      location: 'MAIN LAB — SURPRISE', 
      text: 'Drop, blade first. Strike through limb before it knows.\n\nThree-voiced scream.', 
      enemy: { name: 'Amalgam (Wounded)', hp: 8, phy: 4, def: 1 }, 
      victoryNodeId: 'victory-combat', 
      defeatNodeId: 'defeat', 
      victoryXp: 40 
    },
    'boss-fight': { 
      type: 'combat', 
      location: 'MAIN LAB — CONFRONTATION', 
      text: 'Creature flows toward you. Victims\' faces swim across surface.\n\nThirty years absorbing knowledge. It knows how to fight.\n\nSo do you.', 
      enemy: { name: 'The Amalgam', hp: 12, phy: 4, def: 2 }, 
      victoryNodeId: 'victory-combat', 
      defeatNodeId: 'defeat', 
      fleeNodeId: 'reactor', 
      victoryXp: 50 
    },
    'victory-combat': { 
      type: 'outcome', 
      location: 'AFTERMATH', 
      text: 'Creature collapses. Stolen forms silent.\n\nGather salvageable data. Shuttle pulls away.\n\nYou did your job.\n\nMISSION COMPLETE', 
      outcome: 'victory', 
      xpAwarded: 50 
    },
    'victory-destroy': { 
      type: 'outcome', 
      location: 'ESCAPE POD', 
      text: 'Overload irreversible. Two minutes.\n\nThrough corridors, past the shambling thing, into pod. Doors seal as it reaches airlock.\n\nStation comes apart. White light. Vaporized.\n\nDr. Tanaka watches with peace.\n\n"Thank you."\n\nMISSION COMPLETE', 
      outcome: 'victory', 
      xpAwarded: 50 
    },
    'defeat': { 
      type: 'outcome', 
      text: 'You fall. It looms.\n\n"NEW PATTERNS. THANK YOU."\n\nMISSION FAILED\n\nRescued by beacon. Creature escaped.', 
      outcome: 'defeat', 
      xpAwarded: 10 
    },
    'retreat': { 
      type: 'outcome', 
      location: 'SHUTTLE', 
      text: 'Something wrong. It waited thirty years. Can wait more.\n\nReturn to shuttle.\n\nPulling away—shape in viewport. Watching.\n\nIt waves.\n\nMISSION INCOMPLETE', 
      outcome: 'retreat', 
      xpAwarded: 5 
    }
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const generateId = () => Math.random().toString(36).substr(2, 9);

function createCharacter(name, classId, portraitUrl, portraitName) {
  const cls = CLASS_LIBRARY[classId];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    class: classId,
    className: cls.name,
    portraitName,
    version: '1.0',
    portraitUrl,
    stats: { ...cls.baseStats },
    hp: { current: cls.baseHp, max: cls.baseHp },
    xp: { current: 0, toNextLevel: 100 },
    level: 1,
    traits: [],
    inventory: [],
    provenance: [{
      id: generateId(),
      timestamp: now,
      version: '1.0',
      eventType: 'created',
      description: `Created as ${cls.name}`
    }],
    questsCompleted: 0,
    enemiesDefeated: 0
  };
}

const doCheck = (char, type, diff) => {
  const stat = char.stats[type];
  const roll = Math.floor(Math.random() * 6) + 1;
  const total = stat + roll;
  const target = diff + 6;
  return { stat, roll, total, target, success: total >= target };
};

const doCombat = (char, enemy) => {
  let pHp = char.hp.current, eHp = enemy.hp;
  const rounds = [];
  while (pHp > 0 && eHp > 0 && rounds.length < 10) {
    const pRoll = Math.floor(Math.random() * 6) + 1;
    const pDmg = Math.max(0, char.stats.phy + pRoll - enemy.def);
    eHp -= pDmg;
    let eDmg = 0;
    if (eHp > 0) {
      const eRoll = Math.floor(Math.random() * 6) + 1;
      eDmg = Math.max(0, enemy.phy + eRoll - char.stats.def);
      pHp -= eDmg;
    }
    rounds.push({ pRoll, pDmg, eDmg, pHp, eHp });
  }
  return { rounds, victory: eHp <= 0, pHp, dmgTaken: char.hp.current - pHp };
};

// =============================================================================
// CHARACTER CREATOR COMPONENT
// =============================================================================

function CharacterCreator({ onComplete, onCancel }) {
  const [selectedClass, setSelectedClass] = useState('sentinel');
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');

  const cls = CLASS_LIBRARY[selectedClass];

  // Auto-select first image when class changes
  useEffect(() => {
    if (cls.images.length > 0) {
      setSelectedImage(cls.images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [selectedClass, cls.images]);

  const handleCreate = () => {
    if (!name.trim() || !selectedImage) return;
    onComplete({
      name: name.trim(),
      classId: selectedClass,
      portraitUrl: selectedImage.file,
      portraitName: selectedImage.name
    });
  };

  return (
    <div className="creator">
      <div className="creator-header">
        <h1>CREATE OPERATIVE</h1>
        <button onClick={onCancel}>✕</button>
      </div>

      <div className="creator-body">
        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-card">
            <div className="preview-card-header">
              <span>◇ GREY STRATUM</span>
              <span className="version-tag">v1.0</span>
            </div>
            <div className="preview-portrait">
              {selectedImage ? (
                <img src={selectedImage.file} alt={selectedImage.name} />
              ) : (
                <div className="no-image">No images available</div>
              )}
            </div>
            <div className="preview-nameplate">
              <div className="preview-name">{name || 'Enter Name...'}</div>
              <div className="preview-class">{cls.name}</div>
            </div>
            <div className="preview-stats-bar">
              <div className="hp-bar">
                <div className="hp-fill" style={{ width: '100%' }}></div>
                <span>HP {cls.baseHp}/{cls.baseHp}</span>
              </div>
            </div>
            <div className="preview-stats">
              <div className="stat-box">
                <span className="stat-label">PHY</span>
                <span className="stat-value">{cls.baseStats.phy}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">INT</span>
                <span className="stat-value">{cls.baseStats.int}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">DEF</span>
                <span className="stat-value">{cls.baseStats.def}</span>
              </div>
            </div>
            <div className="preview-frame"></div>
          </div>
        </div>

        {/* Options Panel */}
        <div className="options-panel">
          {/* Class Selection */}
          <div className="option-section">
            <div className="section-title">SELECT CLASS</div>
            <div className="class-grid">
              {Object.values(CLASS_LIBRARY).map(c => (
                <button
                  key={c.id}
                  className={`class-btn ${selectedClass === c.id ? 'selected' : ''} ${c.images.length === 0 ? 'disabled' : ''}`}
                  onClick={() => c.images.length > 0 && setSelectedClass(c.id)}
                  disabled={c.images.length === 0}
                >
                  <div className="class-btn-name">{c.name}</div>
                  <div className="class-btn-role">{c.role}</div>
                  <div className="class-btn-stats">
                    PHY {c.baseStats.phy} • INT {c.baseStats.int} • DEF {c.baseStats.def}
                  </div>
                  {c.images.length === 0 && <div className="coming-soon">Coming Soon</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Portrait Selection */}
          <div className="option-section">
            <div className="section-title">SELECT PORTRAIT</div>
            <div className="portrait-grid">
              {cls.images.map(img => (
                <button
                  key={img.id}
                  className={`portrait-btn ${selectedImage?.id === img.id ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img.file} alt={img.name} />
                  <div className="portrait-btn-name">{img.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Class Description */}
          <div className="class-description">
            <div className="desc-title">{cls.name}</div>
            <div className="desc-text">{cls.description}</div>
          </div>
        </div>
      </div>

      <div className="creator-footer">
        <input
          type="text"
          placeholder="Enter operative name..."
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={24}
        />
        <button
          className="create-btn"
          onClick={handleCreate}
          disabled={!name.trim() || !selectedImage}
        >
          CREATE OPERATIVE
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// CHARACTER CARD COMPONENT (In-Game Display)
// =============================================================================

function CharacterCard({ character }) {
  const hpPct = (character.hp.current / character.hp.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNextLevel) * 100;
  
  const getHpColor = () => {
    if (hpPct > 60) return '#00ff88';
    if (hpPct > 30) return '#ffaa00';
    return '#ff3366';
  };

  return (
    <div className="game-card">
      <div className="card-header">
        <span className="card-brand">◇ GREY STRATUM</span>
        <span className="card-version">v{character.version}</span>
      </div>
      
      <div className="card-portrait">
        <img src={character.portraitUrl} alt={character.name} />
        <div className="portrait-scanlines"></div>
      </div>
      
      <div className="card-nameplate">
        <div className="card-name">{character.name}</div>
        <div className="card-class">{character.className}</div>
      </div>
      
      <div className="card-bars">
        <div className="bar-container">
          <div className="bar-label"><span>HP</span><span>{character.hp.current}/{character.hp.max}</span></div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${hpPct}%`, background: getHpColor() }}></div>
          </div>
        </div>
        <div className="bar-container">
          <div className="bar-label"><span>XP</span><span>{character.xp.current}/{character.xp.toNextLevel}</span></div>
          <div className="bar-track">
            <div className="bar-fill xp-bar" style={{ width: `${xpPct}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="card-stats">
        <div className="stat">
          <span className="stat-label">PHY</span>
          <span className="stat-value">{character.stats.phy}</span>
        </div>
        <div className="stat">
          <span className="stat-label">INT</span>
          <span className="stat-value">{character.stats.int}</span>
        </div>
        <div className="stat">
          <span className="stat-label">DEF</span>
          <span className="stat-value">{character.stats.def}</span>
        </div>
      </div>
      
      <div className="card-level">
        <span>LVL {character.level}</span>
      </div>
      
      <div className="card-frame"></div>
      <div className="card-corners">
        <div className="corner tl"></div>
        <div className="corner tr"></div>
        <div className="corner bl"></div>
        <div className="corner br"></div>
      </div>
    </div>
  );
}

// =============================================================================
// QUEST SCREEN COMPONENT
// =============================================================================

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('start');
  const [sysOut, setSysOut] = useState(null);
  const [combat, setCombat] = useState(null);
  const [busy, setBusy] = useState(false);

  const node = QUEST.nodes[nodeId];

  const goTo = async (id) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 300));
    setNodeId(id);
    setSysOut(null);
    setCombat(null);
    setBusy(false);
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
      if (r.type === 'item') {
        setCharacter(c => ({ ...c, inventory: [...c.inventory, { itemId: r.itemId, quantity: 1 }] }));
      }
      if (r.type === 'xp') {
        setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + r.amount } }));
      }
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
      eventType: node.outcome === 'victory' ? 'quest_completed' : 'quest_failed',
      description: node.outcome === 'victory' ? 'Completed: Silent Station' : 'Failed: Silent Station'
    };
    setCharacter(c => ({
      ...c,
      provenance: [...c.provenance, prov],
      questsCompleted: node.outcome === 'victory' ? c.questsCompleted + 1 : c.questsCompleted
    }));
    onComplete(node.outcome, node.xpAwarded);
  };

  useEffect(() => {
    if (node.type === 'check' && !sysOut && !busy) runCheck(node);
    if (node.type === 'combat' && !combat && !busy) runCombat(node);
  }, [nodeId]);

  const hasItem = (id) => character.inventory.some(i => i.itemId === id);

  return (
    <div className="quest-layout">
      <aside className="quest-sidebar">
        <CharacterCard character={character} />
      </aside>
      
      <main className="quest-narrative">
        {node.location && <div className="location">◆ {node.location}</div>}
        <div className="narrative-text">{node.text}</div>
        
        {sysOut && (
          <div className="sys-out">
            <div className="sys-head">◈ SYSTEM OUTPUT</div>
            <div>{sysOut.checkType.toUpperCase()} CHECK — Difficulty {sysOut.difficulty}</div>
            <div className="sys-calc">Base {sysOut.stat} + Roll {sysOut.roll} = {sysOut.total} vs {sysOut.target}</div>
            <div className={sysOut.success ? 'result-win' : 'result-lose'}>
              {sysOut.success ? '██ SUCCESS ██' : '░░ FAILURE ░░'}
            </div>
          </div>
        )}
        
        {combat && (
          <div className="sys-out">
            <div className="sys-head">◈ COMBAT — {combat.enemy.name}</div>
            <div className="combat-log">
              {combat.rounds.map((r, i) => (
                <div key={i}>R{i + 1}: You deal {r.pDmg} dmg, Enemy deals {r.eDmg} dmg — HP {r.pHp}/{r.eHp}</div>
              ))}
            </div>
            <div className={combat.victory ? 'result-win' : 'result-lose'}>
              {combat.victory ? '██ VICTORY ██' : '░░ DEFEAT ░░'}
            </div>
          </div>
        )}
        
        <div className="choices">
          {node.type === 'choice' && node.choices.map(c => {
            const ok = !c.requirement || hasItem(c.requirement.itemId);
            return (
              <button key={c.id} disabled={busy || !ok} onClick={() => goTo(c.nextNodeId)}>
                <span className="choice-key">[{c.id.toUpperCase()}]</span>
                <span className="choice-text">{c.text}</span>
                {c.requirement && !ok && <span className="locked">🔒</span>}
              </button>
            );
          })}
          
          {node.type === 'narrative' && (
            <button disabled={busy} onClick={() => goTo(node.nextNodeId)}>Continue...</button>
          )}
          
          {node.type === 'reward' && (
            <>
              <div className="reward-list">
                {node.rewards?.map((r, i) => (
                  <div key={i} className="reward-item">+ {r.type === 'item' ? r.itemId : `${r.amount} XP`}</div>
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
              <button onClick={finishQuest}>Return to Menu</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [character, setCharacter] = useState(null);
  const [outcome, setOutcome] = useState(null);

  // Load saved character
  useEffect(() => {
    const saved = localStorage.getItem('gs-character-v2');
    if (saved) {
      try {
        setCharacter(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load character:', e);
      }
    }
  }, []);

  // Save character on change
  useEffect(() => {
    if (character) {
      localStorage.setItem('gs-character-v2', JSON.stringify(character));
    }
  }, [character]);

  const handleCreateComplete = (data) => {
    const char = createCharacter(data.name, data.classId, data.portraitUrl, data.portraitName);
    setCharacter(char);
    setScreen('menu');
  };

  const handleQuestComplete = (result, xp) => {
    setOutcome({ result, xp });
    setScreen('outcome');
  };

  const deleteCharacter = () => {
    if (window.confirm('Delete this character? This cannot be undone.')) {
      localStorage.removeItem('gs-character-v2');
      setCharacter(null);
    }
  };

  return (
    <>
      <style>{appStyles}</style>
      <div className="app">
        <header className="app-header">
          <div className="header-brand">GREY STRATUM</div>
          <div className="header-sub">TERMINAL v2.0</div>
        </header>

        {screen === 'menu' && (
          <div className="menu">
            <h1 className="menu-title">GREY STRATUM</h1>
            <p className="menu-subtitle">TACTICAL CARD RPG</p>
            
            {character && (
              <div className="menu-character">
                <img src={character.portraitUrl} alt={character.name} className="menu-portrait" />
                <div className="menu-char-info">
                  <div className="menu-char-name">{character.name}</div>
                  <div className="menu-char-class">{character.className} • Level {character.level}</div>
                  <div className="menu-char-stats">
                    HP {character.hp.current}/{character.hp.max} • XP {character.xp.current}/{character.xp.toNextLevel}
                  </div>
                </div>
              </div>
            )}
            
            <div className="menu-buttons">
              <button 
                className="menu-btn primary" 
                onClick={() => setScreen('quest')} 
                disabled={!character}
              >
                ▸ START MISSION
              </button>
              <button className="menu-btn" onClick={() => setScreen('create')}>
                ▸ {character ? 'NEW CHARACTER' : 'CREATE CHARACTER'}
              </button>
              {character && (
                <button className="menu-btn danger" onClick={deleteCharacter}>
                  ▸ DELETE CHARACTER
                </button>
              )}
            </div>
          </div>
        )}

        {screen === 'create' && (
          <CharacterCreator
            onComplete={handleCreateComplete}
            onCancel={() => setScreen('menu')}
          />
        )}

        {screen === 'quest' && character && (
          <QuestScreen
            character={character}
            setCharacter={setCharacter}
            onComplete={handleQuestComplete}
          />
        )}

        {screen === 'outcome' && (
          <div className="outcome">
            <h1 className={`outcome-title ${outcome?.result}`}>
              {outcome?.result === 'victory' ? 'MISSION COMPLETE' : 
               outcome?.result === 'defeat' ? 'MISSION FAILED' : 'INCOMPLETE'}
            </h1>
            <div className="outcome-xp">+{outcome?.xp} XP</div>
            <button className="outcome-btn" onClick={() => setScreen('menu')}>
              Return to Menu
            </button>
          </div>
        )}

        <footer className="app-footer">
          <span className="status">● SYSTEM ONLINE</span>
          <span className="coords">SECTOR 7</span>
        </footer>
      </div>
    </>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const appStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #0a0a0f;
  --panel: #12121a;
  --card: #1a1a25;
  --elevated: #222230;
  --border: #2a2a3a;
  --cyan: #00f0ff;
  --cyan-dim: #00a0aa;
  --magenta: #ff00aa;
  --amber: #ffaa00;
  --green: #00ff88;
  --red: #ff3366;
  --text: #c0c0d0;
  --text-dim: #606080;
  --text-muted: #404055;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Rajdhani', sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
}

.header-brand {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

.header-sub {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dim);
}

/* Footer */
.app-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background: var(--panel);
  border-top: 1px solid var(--border);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--green);
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Menu */
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.menu-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--cyan);
  text-shadow: 0 0 40px rgba(0, 240, 255, 0.5);
  margin-bottom: 0.5rem;
}

.menu-subtitle {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--text-dim);
  margin-bottom: 3rem;
}

.menu-character {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: left;
}

.menu-portrait {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.menu-char-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.menu-char-class {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: var(--cyan);
  margin-bottom: 0.25rem;
}

.menu-char-stats {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
}

.menu-btn {
  padding: 0.9rem 1.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover:not(:disabled) {
  background: var(--elevated);
  border-color: var(--cyan);
  color: var(--cyan);
}

.menu-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-btn.primary {
  background: linear-gradient(135deg, var(--cyan-dim), var(--cyan));
  border-color: var(--cyan);
  color: var(--bg);
}

.menu-btn.primary:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}

.menu-btn.danger:hover {
  border-color: var(--red);
  color: var(--red);
}

/* Character Creator */
.creator {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--panel);
  overflow: hidden;
}

.creator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--card);
  border-bottom: 1px solid var(--border);
}

.creator-header h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--cyan);
}

.creator-header button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-dim);
  cursor: pointer;
}

.creator-header button:hover {
  color: var(--cyan);
}

.creator-body {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1px;
  background: var(--border);
  overflow: hidden;
}

.preview-panel {
  background: var(--bg);
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}

.preview-card {
  position: relative;
  width: 280px;
  height: 420px;
  background: var(--bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.15);
}

.preview-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.85) 100%);
  border-bottom: 1px solid var(--border);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  color: var(--cyan);
}

.version-tag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: var(--amber);
  background: rgba(255, 170, 0, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}

.preview-portrait {
  height: 260px;
  background: var(--card);
  overflow: hidden;
}

.preview-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.no-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preview-nameplate {
  padding: 0.6rem 0.8rem;
  background: linear-gradient(180deg, rgba(26, 26, 37, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.preview-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-class {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: var(--cyan);
  text-transform: uppercase;
}

.preview-stats-bar {
  padding: 0.5rem 0.8rem;
  background: var(--panel);
}

.hp-bar {
  position: relative;
  height: 14px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--green));
}

.hp-bar span {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #fff;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

.preview-stats {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: var(--panel);
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem;
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.stat-box .stat-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.5rem;
  font-weight: 500;
  color: var(--cyan-dim);
  letter-spacing: 0.1em;
}

.stat-box .stat-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.preview-frame {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  pointer-events: none;
}

/* Options Panel */
.options-panel {
  background: var(--panel);
  padding: 1.5rem;
  overflow-y: auto;
}

.option-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--cyan);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.class-btn {
  position: relative;
  padding: 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.class-btn:hover:not(.disabled) {
  background: var(--elevated);
  border-color: var(--cyan-dim);
}

.class-btn.selected {
  border-color: var(--cyan);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
}

.class-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.class-btn-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.2rem;
}

.class-btn-role {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: var(--cyan-dim);
  margin-bottom: 0.3rem;
}

.class-btn-stats {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: var(--text-dim);
}

.coming-soon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: var(--amber);
  background: rgba(255, 170, 0, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}

.portrait-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.portrait-btn {
  position: relative;
  padding: 0;
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.portrait-btn:hover {
  border-color: var(--cyan-dim);
}

.portrait-btn.selected {
  border-color: var(--cyan);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.portrait-btn img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: top center;
}

.portrait-btn-name {
  padding: 0.3rem;
  background: rgba(0, 0, 0, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: var(--text);
  text-align: center;
}

.class-description {
  padding: 1rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.desc-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--cyan);
  margin-bottom: 0.5rem;
}

.desc-text {
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.5;
}

/* Creator Footer */
.creator-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--card);
  border-top: 1px solid var(--border);
}

.creator-footer input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: #fff;
}

.creator-footer input::placeholder {
  color: var(--text-dim);
}

.creator-footer input:focus {
  outline: none;
  border-color: var(--cyan);
}

.create-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--cyan-dim), var(--cyan));
  border: none;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--bg);
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover:not(:disabled) {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5);
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Game Card (Quest Sidebar) */
.game-card {
  position: relative;
  background: var(--bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.7rem;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.85) 100%);
  border-bottom: 1px solid var(--border);
}

.card-brand {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--cyan);
}

.card-version {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: var(--amber);
  background: rgba(255, 170, 0, 0.1);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
}

.card-portrait {
  position: relative;
  height: 180px;
  background: var(--card);
  overflow: hidden;
}

.card-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.portrait-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
  pointer-events: none;
}

.card-nameplate {
  padding: 0.5rem 0.7rem;
  background: linear-gradient(180deg, rgba(26, 26, 37, 0.95) 0%, rgba(18, 18, 26, 0.98) 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.card-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.card-class {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: var(--cyan);
}

.card-bars {
  padding: 0.5rem 0.7rem;
  background: var(--panel);
}

.bar-container {
  margin-bottom: 0.4rem;
}

.bar-container:last-child {
  margin-bottom: 0;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: var(--text-dim);
  margin-bottom: 0.15rem;
}

.bar-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
}

.xp-bar {
  background: linear-gradient(90deg, var(--magenta), var(--cyan));
}

.card-stats {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  background: var(--panel);
  border-top: 1px solid var(--border);
}

.card-stats .stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem;
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 3px;
}

.card-stats .stat-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.45rem;
  color: var(--cyan-dim);
}

.card-stats .stat-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.card-level {
  padding: 0.4rem;
  background: var(--card);
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: var(--amber);
  border-top: 1px solid var(--border);
}

.card-frame {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(0, 240, 255, 0.25);
  border-radius: 10px;
  pointer-events: none;
}

.card-corners .corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  pointer-events: none;
}

.corner.tl { top: 3px; left: 3px; border-right: none; border-bottom: none; }
.corner.tr { top: 3px; right: 3px; border-left: none; border-bottom: none; }
.corner.bl { bottom: 3px; left: 3px; border-right: none; border-top: none; }
.corner.br { bottom: 3px; right: 3px; border-left: none; border-top: none; }

/* Quest Layout */
.quest-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1px;
  background: var(--border);
  overflow: hidden;
}

.quest-sidebar {
  background: var(--panel);
  padding: 1rem;
  overflow-y: auto;
}

.quest-narrative {
  background: var(--panel);
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.location {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--amber);
  margin-bottom: 1.25rem;
}

.narrative-text {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text);
  white-space: pre-wrap;
  max-width: 650px;
  margin-bottom: 1.5rem;
}

.sys-out {
  background: var(--bg);
  border: 1px solid var(--border);
  border-left: 3px solid var(--cyan);
  padding: 0.875rem 1rem;
  margin-bottom: 1.5rem;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  max-width: 450px;
}

.sys-head {
  color: var(--cyan);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
}

.sys-calc {
  color: var(--text-dim);
  margin: 0.4rem 0;
}

.result-win {
  color: var(--green);
  font-weight: 700;
  margin-top: 0.5rem;
}

.result-lose {
  color: var(--red);
  font-weight: 700;
  margin-top: 0.5rem;
}

.combat-log {
  max-height: 100px;
  overflow-y: auto;
  margin: 0.5rem 0;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.choices {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
}

.choices button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 600px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.choices button:hover:not(:disabled) {
  background: var(--elevated);
  border-color: var(--cyan);
  transform: translateX(4px);
}

.choices button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.choice-key {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: var(--cyan);
}

.choice-text {
  flex: 1;
}

.locked {
  font-size: 0.8rem;
  color: var(--amber);
}

.reward-list {
  margin-bottom: 1rem;
}

.reward-item {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: var(--green);
  margin-bottom: 0.25rem;
}

.xp-award {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: var(--cyan);
  margin-bottom: 1rem;
}

/* Outcome Screen */
.outcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.outcome-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
}

.outcome-title.victory { color: var(--green); }
.outcome-title.defeat { color: var(--red); }
.outcome-title.retreat { color: var(--amber); }

.outcome-xp {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.25rem;
  color: var(--cyan);
  margin-bottom: 2rem;
}

.outcome-btn {
  padding: 0.875rem 2rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.outcome-btn:hover {
  border-color: var(--cyan);
  color: var(--cyan);
}

/* Responsive */
@media (max-width: 900px) {
  .creator-body {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    display: none;
  }
  
  .quest-layout {
    grid-template-columns: 1fr;
  }
  
  .quest-sidebar {
    display: none;
  }
  
  .portrait-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .class-grid {
    grid-template-columns: 1fr;
  }
  
  .portrait-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;
