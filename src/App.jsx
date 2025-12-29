import React, { useState, useEffect } from 'react';

// =============================================================================
// CLASS DEFINITIONS (Grok Classes with STRATUM stats)
// =============================================================================

const CLASS_DEFS = {
  sentinel: { 
    name: 'Sentinel', 
    stats: { str: 2, thm: 2, rsv: 4, agi: 2 }, 
    derived: { ton: 12, ult: 8, mana: 6 },
    hp: 12, 
    traits: ['Bulwark', 'Guardian Sense'], 
    shadeAffinity: 'white',
    description: 'Protectors who stand between danger and the innocent.',
    portraitFolder: 'sentinel',
    portraitPrefix: 's',
    portraitCount: 3
  },
  voidStalker: { 
    name: 'Void Stalker', 
    stats: { str: 3, thm: 2, rsv: 2, agi: 3 }, 
    derived: { ton: 10, ult: 6, mana: 4 },
    hp: 10, 
    traits: ['Shadow Step', 'Lethal Strike'], 
    shadeAffinity: 'black',
    description: 'Assassins who embrace the darkness within.',
    portraitFolder: 'stalker',
    portraitPrefix: 'st',
    portraitCount: 4
  },
  oracle: { 
    name: 'Oracle', 
    stats: { str: 1, thm: 4, rsv: 3, agi: 2 }, 
    derived: { ton: 8, ult: 12, mana: 10 },
    hp: 8, 
    traits: ['Shade Sight', 'Prophecy'], 
    shadeAffinity: 'grey',
    description: 'Seers who read the threads of fate and Shade.',
    portraitFolder: 'oracle',
    portraitPrefix: '0',
    portraitCount: 2
  },
  vanguard: { 
    name: 'Vanguard', 
    stats: { str: 4, thm: 1, rsv: 3, agi: 2 }, 
    derived: { ton: 14, ult: 4, mana: 4 },
    hp: 14, 
    traits: ['Breach', 'Intimidate'], 
    shadeAffinity: 'white',
    description: 'Warriors who lead the charge and break the line.',
    portraitFolder: 'vanguard',
    portraitPrefix: 'v',
    portraitCount: 2
  },
  forger: { 
    name: 'Forger', 
    stats: { str: 3, thm: 3, rsv: 2, agi: 2 }, 
    derived: { ton: 11, ult: 9, mana: 6 },
    hp: 11, 
    traits: ['Craft', 'Reinforce'], 
    shadeAffinity: 'grey',
    description: 'Artisans who shape metal and mend machines.',
    portraitFolder: 'forger',
    portraitPrefix: 'f',
    portraitCount: 2
  },
  cleric: { 
    name: 'Cleric', 
    stats: { str: 2, thm: 3, rsv: 4, agi: 1 }, 
    derived: { ton: 10, ult: 10, mana: 8 },
    hp: 10, 
    traits: ['Mend', 'Sanctuary'], 
    shadeAffinity: 'white',
    description: 'Healers who preserve life in the depths.',
    portraitFolder: 'cleric',
    portraitPrefix: 'c',
    portraitCount: 2
  }
};

// =============================================================================
// PORTRAIT HELPER
// =============================================================================

const getPortraitUrl = (classId, index) => {
  const cls = CLASS_DEFS[classId];
  if (!cls) return null;
  return `/character-images/${cls.portraitFolder}/${cls.portraitPrefix}${index}.jpg`;
};

const getPortraitOptions = (classId) => {
  const cls = CLASS_DEFS[classId];
  if (!cls) return [];
  return Array.from({ length: cls.portraitCount }, (_, i) => ({
    index: i + 1,
    url: getPortraitUrl(classId, i + 1)
  }));
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
  const position = ((shade + 10) / 20) * 100;
  
  return (
    <div className="shade-container">
      <div className="shade-label">
        <span>SHADE</span>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="shade-track">
        <div className="shade-gradient" />
        <div className="shade-marker" style={{ left: `${position}%` }} />
      </div>
      <div className="shade-ends">
        <span>Void</span>
        <span>Luminous</span>
      </div>
    </div>
  );
};

// =============================================================================
// ITEMS CATALOG
// =============================================================================

const ITEMS = {
  'med-stim': { id: 'med-stim', name: 'Med-Stim', category: 'consumable', examineText: 'A pressurized injector filled with blue synth-fluid.', effect: { type: 'heal', amount: 8 } },
  'ration-pack': { id: 'ration-pack', name: 'Ration Pack', category: 'consumable', examineText: 'Circuit-standard meal replacement.', effect: { type: 'heal', amount: 2 } },
  'descent-manifest': { id: 'descent-manifest', name: 'Descent Manifest', category: 'lore', examineText: 'Six names before yours, all marked "RESOLVED."' },
  'corso-debt-marker': { id: 'corso-debt-marker', name: 'Debt Marker', category: 'key', examineText: 'A digital token representing your debt to Corso.' }
};

// =============================================================================
// ACT 1 STORY NODES
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
      { id: 'masks', name: 'Adjudicator\'s Masks', text: 'Perfect mirrors. You see yourself but not them. This is intentional.' },
      { id: 'implant', name: 'The Shade Implant', text: 'A warmth behind your eyes. It feels... expectant.' }
    ],
    nextNodeId: 'prologue-response'
  },

  'prologue-response': {
    type: 'choice',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: 'The descent begins. You have one last moment to respond.',
    choices: [
      { id: 'accept', text: 'Accept in silence', shadeChange: 1, nextNodeId: 'prologue-descent', journalEntry: 'Submitted to judgment. They saw compliance; I felt calculation.' },
      { id: 'demand', text: 'Demand explanation', shadeChange: 0, nextNodeId: 'prologue-demand', journalEntry: 'They fear what I carry. Even they don\'t fully understand it.' },
      { id: 'threaten', text: 'Threaten retribution', shadeChange: -1, nextNodeId: 'prologue-descent', journalEntry: 'Made an enemy of the Spire. Good. Enemies are honest.' }
    ]
  },

  'prologue-demand': {
    type: 'narrative',
    location: 'THE SPIRE — TRIBUNAL CHAMBER',
    text: `"What evidence? What 'proscribed technology'?"

The central Adjudicator pauses.

"Your implant itself is the evidence. It should not exist."

The words hang as the floor continues its descent.`,
    nextNodeId: 'prologue-descent'
  },

  'prologue-descent': {
    type: 'narrative',
    location: 'DESCENT SHAFT',
    text: `The platform descends. Light fades to amber, then rust, then darkness relieved only by your Shade's faint pulse.

Hours pass. Or days.

When the platform stops, you smell recycled air and machine oil.

You've arrived in The Circuit.`,
    nextNodeId: 'circuit-arrival'
  },

  // SCENE 1.1: ARRIVAL
  'circuit-arrival': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `The platform locks into a receiving bay. Red emergency lights.

A figure waits—angular, patient. Their coat bears the sigil of the Broker's Guild: an open hand holding a closed eye.

"Another one from above," they say. "I am Corso. I've been paid to receive you. By whom, I'm not permitted to say."

They gesture to the hub beyond. "The Circuit runs on obligation. You now have one. To me."`,
    visibleItems: [
      { id: 'sigil', name: 'Corso\'s Guild Sigil', text: 'The Broker\'s Guild. They honor contracts—but only contracts.' },
      { id: 'manifest', name: 'Discarded Manifest', text: 'Lists recent descents. Your name is seventh.', canTake: true, itemId: 'descent-manifest' }
    ],
    nextNodeId: 'corso-response'
  },

  'corso-response': {
    type: 'choice',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: 'Corso waits for your response.',
    choices: [
      { id: 'grateful', text: '"Thank you. I\'ll repay this."', shadeChange: 1, nextNodeId: 'corso-grateful', consequence: { debt: 350 } },
      { id: 'question', text: '"Who paid for this?"', shadeChange: 0, nextNodeId: 'corso-question' },
      { id: 'refuse', text: '"I didn\'t ask for this debt."', shadeChange: -1, nextNodeId: 'corso-refuse', consequence: { debt: 350 } },
      { id: 'oracle', text: '[ORACLE] Read Corso\'s Shade', classRequired: 'oracle', manaCost: 2, nextNodeId: 'corso-oracle' }
    ]
  },

  'corso-grateful': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Corso nods. "Spoken correctly. Your debt is logged. 350 marks."

They produce a small token—your debt marker.

"The Hub is through there. Work is available for those who look."`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-question': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `"The Guild's discretion is absolute." Corso pauses. "But they used a Spire cipher. Someone above still cares if you live."

Why would anyone in the Spire want you alive after casting you down?`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-refuse': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Corso's expression doesn't change. "The debt exists whether you acknowledge it or not."

They lean closer.

"Refuse, and I'll sell your location to the Spire Hunters instead."`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  'corso-oracle': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRANSIT HUB',
    text: `Your Shade flickers. You see Corso's—pale grey, almost white. They were once like you. Cast down. They built themselves back through obligation.

"You see it," Corso says quietly. "Good. Then you understand."

There's something like kinship in their eyes now.`,
    addItem: 'corso-debt-marker',
    nextNodeId: 'circuit-hub'
  },

  // SCENE 1.2: THE HUB
  'circuit-hub': {
    type: 'choice',
    location: 'THE CIRCUIT — TRADE HUB ALPHA',
    text: `The Circuit is alive. Cargo drones hum overhead. Merchants hawk modified tech, food paste, information.

A notice board catches your eye. Job postings. The way to earn marks and pay debts.

Three paths diverge:
EAST — The Fabrication Yards
NORTH — The Data Temples
WEST — The Descent Shafts`,
    visibleItems: [
      { id: 'board', name: 'Exchange Board', text: 'Labor: 15 marks/shift. Information: Variable.' },
      { id: 'vendor', name: 'Street Vendor', text: 'Basic supplies available.' }
    ],
    choices: [
      { id: 'escort', text: '[JOB] Cargo Security — 200 marks', nextNodeId: 'job-escort-start' },
      { id: 'heist', text: '[JOB] Data Extraction — 150 marks', requirement: { stat: 'thm', min: 3 }, nextNodeId: 'job-heist-start' },
      { id: 'collect', text: '[JOB] Debt Collection — 100 marks', requirement: { stat: 'str', min: 3 }, nextNodeId: 'job-collect-start' },
      { id: 'package', text: '[JOB] Smuggle a Person — 300 marks', requirement: { stat: 'rsv', min: 3 }, nextNodeId: 'job-package-start' }
    ]
  },

  // JOB: ESCORT
  'job-escort-start': {
    type: 'narrative',
    location: 'FABRICATION YARDS — LOADING BAY',
    text: `The cargo is sealed containers—medical supplies. Destination: a Midway clinic.

Your fellow guards: Harrow (veteran) and Pell (young, nervous).

Day one: uneventful.
Day two: you hear them.`,
    nextNodeId: 'escort-raiders'
  },

  'escort-raiders': {
    type: 'choice',
    location: 'MAINTENANCE CORRIDOR — DAY 2',
    text: `Raiders. Murk-descended, by their patchwork gear.

"Medical supplies," their leader calls. "We need them more than whatever clinic you're feeding. Give them up and walk away."`,
    visibleItems: [
      { id: 'leader', name: 'Raider Leader', text: 'Scarred, but not cruel. A child\'s drawing tucked in their belt.' },
      { id: 'pell', name: 'Pell\'s Hands', text: 'Shaking. They\'ve never seen real violence.' }
    ],
    choices: [
      { id: 'fight', text: 'Fight to protect the cargo', shadeChange: 2, nextNodeId: 'escort-combat' },
      { id: 'negotiate', text: 'Negotiate a split', requirement: { stat: 'thm', min: 3 }, nextNodeId: 'escort-negotiate' },
      { id: 'surrender', text: 'Let them take it', shadeChange: -1, nextNodeId: 'escort-surrender' },
      { id: 'assassinate', text: '[VOID STALKER] Eliminate the leader', classRequired: 'voidStalker', shadeChange: -3, nextNodeId: 'escort-assassinate' },
      { id: 'shield', text: '[SENTINEL] Shield Pell and hold', classRequired: 'sentinel', manaCost: 2, shadeChange: 3, nextNodeId: 'escort-sentinel' }
    ]
  },

  'escort-combat': {
    type: 'combat',
    location: 'MAINTENANCE CORRIDOR',
    text: 'You and Harrow move forward. The raiders are desperate but outmatched.',
    enemy: { name: 'Murk Raiders (3)', hp: 15, str: 2, def: 1 },
    victoryNodeId: 'escort-victory',
    defeatNodeId: 'escort-defeat',
    fleeNodeId: 'escort-surrender',
    victoryXp: 25
  },

  'escort-victory': {
    type: 'reward',
    location: 'MAINTENANCE CORRIDOR — AFTERMATH',
    text: `The raiders fall. Harrow wipes their blade. Pell stares at the bodies.

The cargo is safe. But Pell's eyes have changed.`,
    rewards: [{ type: 'marks', amount: 200 }, { type: 'xp', amount: 25 }],
    nextNodeId: 'hub-return'
  },

  'escort-defeat': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR',
    text: 'You fall. The raiders take everything. Harrow drags you back.',
    nextNodeId: 'hub-return'
  },

  'escort-negotiate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR',
    text: `"Half the supplies. Everyone walks."

The leader considers. Then nods.

"Fair enough. We remember this."`,
    rewards: [{ type: 'marks', amount: 100 }, { type: 'xp', amount: 20 }],
    nextNodeId: 'hub-return'
  },

  'escort-surrender': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR',
    text: `"Harrow, stand down. It's just cargo."

The raiders take everything. Their leader nods—almost grateful.

"We won't forget this."`,
    consequence: { debt: 50 },
    nextNodeId: 'hub-return'
  },

  'escort-assassinate': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — SHADOWS',
    text: `You slip into shadow. One precise strike.

The others flee. Harrow stares at you.

"Who are you?"`,
    rewards: [{ type: 'marks', amount: 250 }, { type: 'xp', amount: 30 }],
    nextNodeId: 'hub-return'
  },

  'escort-sentinel': {
    type: 'narrative',
    location: 'MAINTENANCE CORRIDOR — THE WALL',
    text: `You activate Bulwark. Your Shade extends into a barrier.

The raiders hesitate. This isn't a fight—it's a wall.

One by one, they back away. No blood. Pell looks at you like you're something more.`,
    rewards: [{ type: 'marks', amount: 200 }, { type: 'xp', amount: 30 }],
    nextNodeId: 'hub-return'
  },

  // OTHER JOBS (PLACEHOLDERS)
  'job-heist-start': { type: 'narrative', location: 'DATA TEMPLES', text: '[Data Extraction — Coming soon]\n\nThe Temple looms before you...', nextNodeId: 'hub-return' },
  'job-collect-start': { type: 'narrative', location: 'DEBT DISTRICT', text: '[Debt Collection — Coming soon]\n\nThe address leads to a cramped hab-block...', nextNodeId: 'hub-return' },
  'job-package-start': { type: 'narrative', location: 'ANONYMOUS MEET', text: '[Package — Coming soon]\n\nThe contact waits in shadows...', nextNodeId: 'hub-return' },

  // HUB RETURN
  'hub-return': {
    type: 'narrative',
    location: 'THE CIRCUIT — TRADE HUB ALPHA',
    text: `You return to the Hub. The job is done.

Corso finds you.

"You've seen what the Circuit is. Labor, secrets, violence dressed in commerce."

They lean closer.

"Or you can go deeper. The Midway awaits."`,
    nextNodeId: 'descent-decision'
  },

  // DESCENT DECISION
  'descent-decision': {
    type: 'choice',
    location: 'THE CIRCUIT — DESCENT SHAFTS',
    text: `The shafts plunge into darkness.

Corso stands at the threshold.

"I've met one person who came back from the Abyss. They couldn't speak anymore. But they smiled."

Your Shade pulses. It wants to go down.`,
    choices: [
      { id: 'stay', text: 'Stay in the Circuit (End Act 1)', requirement: { marks: 350 }, nextNodeId: 'ending-survivor' },
      { id: 'truth', text: '"I need to know what I am."', shadeChange: 1, nextNodeId: 'ending-descent' },
      { id: 'vengeance', text: '"The Spire made a mistake."', shadeChange: -1, nextNodeId: 'ending-descent' }
    ]
  },

  'ending-survivor': {
    type: 'outcome',
    location: 'THE CIRCUIT — YOUR NEW HOME',
    text: `You transfer the marks. Corso nods.

"Smart. Boring, but smart."

You live in the Circuit for years. You never learn the truth. But you survive.

Some descents end in survival.`,
    outcome: 'early-ending',
    xpAwarded: 50
  },

  'ending-descent': {
    type: 'outcome',
    location: 'DESCENT SHAFT',
    text: `The elevator groans as it descends. Light fades.

When it stops, you emerge into a cavern the size of a cathedral.

Welcome to the Midway.

ACT 1 COMPLETE — The Circuit`,
    outcome: 'act-complete',
    xpAwarded: 100
  }
};

// =============================================================================
// COMPONENTS: ECHO JOURNAL
// =============================================================================

const EchoJournal = ({ entries, insights, isOpen, onClose }) => {
  const [tab, setTab] = useState('entries');
  if (!isOpen) return null;
  
  return (
    <div className="overlay">
      <div className="panel">
        <div className="panel-header">
          <h2>◈ ECHO JOURNAL</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="tabs">
          <button className={tab === 'entries' ? 'active' : ''} onClick={() => setTab('entries')}>Entries ({entries.length})</button>
          <button className={tab === 'insights' ? 'active' : ''} onClick={() => setTab('insights')}>Insights ({insights.length})</button>
        </div>
        <div className="panel-content">
          {tab === 'entries' && (entries.length === 0 ? <p className="empty">Your journey has just begun...</p> : entries.map((e, i) => <div key={i} className="entry"><div className="entry-title">{e.title}</div><div className="entry-text">{e.text}</div></div>))}
          {tab === 'insights' && (insights.length === 0 ? <p className="empty">Examine objects to gain insights...</p> : insights.map((e, i) => <div key={i} className="entry"><div className="entry-title">◆ {e.title}</div><div className="entry-text">{e.text}</div></div>))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENTS: VISIBLE ITEMS
// =============================================================================

const VisibleItems = ({ items, onTake }) => {
  const [expanded, setExpanded] = useState(null);
  if (!items?.length) return null;
  
  return (
    <div className="visible-items">
      <div className="vi-header">◇ VISIBLE</div>
      {items.map(item => (
        <div key={item.id} className="vi-item">
          <button className="vi-name" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>[{item.name}]</button>
          {expanded === item.id && (
            <div className="vi-detail">
              <p>{item.text}</p>
              {item.canTake && <button className="vi-take" onClick={() => onTake(item)}>+ Take</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// COMPONENTS: INVENTORY
// =============================================================================

const InventoryPanel = ({ inventory, marks, debt, isOpen, onClose, onUse }) => {
  const [selected, setSelected] = useState(null);
  if (!isOpen) return null;
  
  return (
    <div className="overlay">
      <div className="panel">
        <div className="panel-header">
          <h2>◈ INVENTORY</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="currency">
          <span className="marks">◆ {marks} marks</span>
          {debt > 0 && <span className="debt">◇ {debt} debt</span>}
        </div>
        <div className="panel-content">
          {inventory.length === 0 ? <p className="empty">No items</p> : inventory.map((inv, i) => {
            const item = ITEMS[inv.itemId];
            if (!item) return null;
            return (
              <div key={i} className={`inv-item ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(selected === i ? null : i)}>
                <span className="inv-icon">{item.category === 'consumable' ? '◉' : '◆'}</span>
                <span className="inv-name">{item.name}</span>
                {inv.quantity > 1 && <span className="inv-qty">x{inv.quantity}</span>}
              </div>
            );
          })}
          {selected !== null && inventory[selected] && (
            <div className="item-details">
              <p>{ITEMS[inventory[selected].itemId]?.examineText}</p>
              {ITEMS[inventory[selected].itemId]?.category === 'consumable' && <button onClick={() => onUse(inventory[selected].itemId)}>Use</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// CHARACTER CREATOR WITH GROK GALLERY
// =============================================================================

function CharacterCreator({ onComplete, onCancel }) {
  const [selectedClass, setSelectedClass] = useState('sentinel');
  const [selectedPortrait, setSelectedPortrait] = useState(1);
  const [name, setName] = useState('');
  const [imgError, setImgError] = useState({});

  const cls = CLASS_DEFS[selectedClass];
  const portraits = getPortraitOptions(selectedClass);

  useEffect(() => {
    setSelectedPortrait(1);
    setImgError({});
  }, [selectedClass]);

  const handleCreate = () => {
    if (!name.trim()) return;
    onComplete({ name: name.trim(), class: selectedClass, portraitUrl: getPortraitUrl(selectedClass, selectedPortrait), portraitIndex: selectedPortrait });
  };

  return (
    <div className="creator">
      <div className="creator-header">
        <h1>CREATE OPERATIVE</h1>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="creator-body">
        <div className="preview-panel">
          <div className="preview-frame">
            <img src={getPortraitUrl(selectedClass, selectedPortrait)} alt={cls.name} onError={(e) => { e.target.src = ''; e.target.alt = '?'; }} />
          </div>
          <div className="preview-stats">
            <span>STR {cls.stats.str}</span>
            <span>THM {cls.stats.thm}</span>
            <span>RSV {cls.stats.rsv}</span>
            <span>AGI {cls.stats.agi}</span>
          </div>
          <div className="class-traits">{cls.traits.map((t, i) => <span key={i} className="trait">{t}</span>)}</div>
        </div>
        <div className="options-panel">
          <div className="opt-section">CLASS</div>
          <div className="class-grid">
            {Object.entries(CLASS_DEFS).map(([id, c]) => (
              <button key={id} className={`class-btn ${selectedClass === id ? 'selected' : ''}`} onClick={() => setSelectedClass(id)}>
                <span className="class-name">{c.name}</span>
                <span className={`class-affinity ${c.shadeAffinity}`}>{c.shadeAffinity === 'white' ? '◇' : c.shadeAffinity === 'black' ? '◆' : '◈'}</span>
              </button>
            ))}
          </div>
          <div className="opt-section">PORTRAIT</div>
          <div className="portrait-grid">
            {portraits.map((p) => (
              <button key={p.index} className={`portrait-btn ${selectedPortrait === p.index ? 'selected' : ''}`} onClick={() => setSelectedPortrait(p.index)}>
                {!imgError[p.index] ? <img src={p.url} alt={`${p.index}`} onError={() => setImgError(prev => ({ ...prev, [p.index]: true }))} /> : <div className="portrait-placeholder">{p.index}</div>}
              </button>
            ))}
          </div>
          <div className="opt-section">DESCRIPTION</div>
          <p className="class-desc">{cls.description}</p>
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

function createCharacter(name, classId, portraitUrl, portraitIndex) {
  const cls = CLASS_DEFS[classId];
  return {
    id: generateId(), name, class: classId, version: '2.0', portraitUrl, portraitIndex,
    stats: { ...cls.stats }, derived: { ...cls.derived },
    hp: { current: cls.hp, max: cls.hp },
    mana: { current: cls.derived.mana, max: cls.derived.mana },
    xp: { current: 0, toNextLevel: 100 }, level: 1,
    traits: [...cls.traits]
  };
}

const doCombat = (char, enemy) => {
  let pHp = char.hp.current, eHp = enemy.hp;
  const rounds = [];
  while (pHp > 0 && eHp > 0 && rounds.length < 10) {
    const pRoll = Math.floor(Math.random() * 6) + 1;
    const pDmg = Math.max(0, char.stats.str + pRoll - (enemy.def || 1));
    eHp -= pDmg;
    let eDmg = 0;
    if (eHp > 0) {
      const eRoll = Math.floor(Math.random() * 6) + 1;
      eDmg = Math.max(0, (enemy.str || 2) + eRoll - Math.floor(char.derived.ton / 5));
      pHp -= eDmg;
    }
    rounds.push({ pDmg, eDmg, pHp, eHp });
  }
  return { rounds, victory: eHp <= 0, pHp };
};

// =============================================================================
// QUEST SCREEN
// =============================================================================

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('prologue-tribunal');
  const [gameState, setGameState] = useState({ shade: 0, marks: 0, debt: 0, flags: {} });
  const [inventory, setInventory] = useState([]);
  const [journal, setJournal] = useState({ entries: [], insights: [] });
  const [combat, setCombat] = useState(null);
  const [busy, setBusy] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const node = STORY_NODES[nodeId];

  const goTo = async (id) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 300));
    setNodeId(id);
    setCombat(null);
    setBusy(false);
  };

  const handleChoice = async (choice) => {
    if (choice.classRequired && character.class !== choice.classRequired) return;
    if (choice.requirement?.stat && (character.stats[choice.requirement.stat] || 0) < choice.requirement.min) return;
    if (choice.requirement?.marks && gameState.marks < choice.requirement.marks) return;
    if (choice.manaCost) {
      if (character.mana.current < choice.manaCost) return;
      setCharacter(c => ({ ...c, mana: { ...c.mana, current: c.mana.current - choice.manaCost } }));
    }
    if (choice.shadeChange) setGameState(gs => ({ ...gs, shade: Math.max(-10, Math.min(10, gs.shade + choice.shadeChange)) }));
    if (choice.consequence?.debt) setGameState(gs => ({ ...gs, debt: gs.debt + choice.consequence.debt }));
    if (choice.journalEntry) setJournal(j => ({ ...j, entries: [...j.entries, { title: node.location, text: choice.journalEntry }] }));
    goTo(choice.nextNodeId);
  };

  const handleTake = (item) => {
    if (item.itemId) {
      setInventory(inv => [...inv, { itemId: item.itemId, quantity: 1 }]);
      setJournal(j => ({ ...j, insights: [...j.insights, { title: item.name, text: item.text }] }));
    }
  };

  const handleUse = (itemId) => {
    const item = ITEMS[itemId];
    if (item?.effect?.type === 'heal') {
      setCharacter(c => ({ ...c, hp: { ...c.hp, current: Math.min(c.hp.max, c.hp.current + item.effect.amount) } }));
      setInventory(inv => inv.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
    }
  };

  const runCombat = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    const res = doCombat(character, n.enemy);
    setCombat({ enemy: n.enemy, ...res });
    setCharacter(c => ({ ...c, hp: { ...c.hp, current: Math.max(0, res.pHp) } }));
    if (res.victory && n.victoryXp) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + n.victoryXp } }));
    setBusy(false);
  };

  const claimReward = (n) => {
    n.rewards?.forEach(r => {
      if (r.type === 'xp') setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + r.amount } }));
      if (r.type === 'marks') setGameState(gs => ({ ...gs, marks: gs.marks + r.amount }));
    });
    goTo(n.nextNodeId);
  };

  const finishQuest = () => {
    if (node.xpAwarded) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + node.xpAwarded } }));
    onComplete(node.outcome, node.xpAwarded);
  };

  useEffect(() => {
    if (node?.addItem && !inventory.some(i => i.itemId === node.addItem)) setInventory(inv => [...inv, { itemId: node.addItem, quantity: 1 }]);
  }, [nodeId]);

  useEffect(() => {
    if (node?.type === 'combat' && !combat && !busy) runCombat(node);
  }, [nodeId]);

  const meetsReq = (c) => {
    if (c.classRequired && character.class !== c.classRequired) return false;
    if (c.requirement?.stat && (character.stats[c.requirement.stat] || 0) < c.requirement.min) return false;
    if (c.requirement?.marks && gameState.marks < c.requirement.marks) return false;
    if (c.manaCost && character.mana.current < c.manaCost) return false;
    return true;
  };

  if (!node) return <div className="error">Node not found</div>;

  const hpPct = (character.hp.current / character.hp.max) * 100;
  const manaPct = (character.mana.current / character.mana.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNextLevel) * 100;

  return (
    <div className="game-layout">
      <aside className="sidebar">
        <div className="card">
          <div className="card-top"><span>◇ GREY STRATUM</span><span>v2.0</span></div>
          <img src={character.portraitUrl} alt="" className="portrait" onError={(e) => e.target.style.display = 'none'} />
          <div className="card-name">{character.name}</div>
          <div className="card-class">{CLASS_DEFS[character.class]?.name}</div>
          <ShadeBar shade={gameState.shade} />
          <div className="bars">
            <div className="bar"><span>HP</span><span>{character.hp.current}/{character.hp.max}</span></div>
            <div className="bar-track"><div className="bar-fill hp" style={{ width: `${hpPct}%` }} /></div>
            <div className="bar"><span>MANA</span><span>{character.mana.current}/{character.mana.max}</span></div>
            <div className="bar-track"><div className="bar-fill mana" style={{ width: `${manaPct}%` }} /></div>
            <div className="bar"><span>XP</span><span>{character.xp.current}/{character.xp.toNextLevel}</span></div>
            <div className="bar-track"><div className="bar-fill xp" style={{ width: `${xpPct}%` }} /></div>
          </div>
          <div className="stats-row">
            <div><span>STR</span><b>{character.stats.str}</b></div>
            <div><span>THM</span><b>{character.stats.thm}</b></div>
            <div><span>RSV</span><b>{character.stats.rsv}</b></div>
            <div><span>AGI</span><b>{character.stats.agi}</b></div>
          </div>
          <div className="sidebar-btns">
            <button onClick={() => setJournalOpen(true)}>◈ Journal</button>
            <button onClick={() => setInventoryOpen(true)}>◆ Items</button>
          </div>
        </div>
      </aside>

      <main className="narrative">
        {node.location && <div className="location">◆ {node.location}</div>}
        <div className="text">{node.text}</div>
        <VisibleItems items={node.visibleItems} onTake={handleTake} />
        
        {combat && (
          <div className="sys-out">
            <div className="sys-head">◈ COMBAT — {combat.enemy.name}</div>
            <div className="combat-log">{combat.rounds.map((r, i) => <div key={i}>R{i + 1}: You {r.pDmg} dmg, Enemy {r.eDmg} dmg</div>)}</div>
            <div className={combat.victory ? 'win' : 'lose'}>{combat.victory ? '██ VICTORY ██' : '░░ DEFEAT ░░'}</div>
          </div>
        )}

        <div className="choices">
          {node.type === 'choice' && node.choices.map(c => (
            <button key={c.id} disabled={busy || !meetsReq(c)} onClick={() => handleChoice(c)} className={c.shadeChange ? (c.shadeChange > 0 ? 'light' : 'dark') : ''}>
              <span>[{c.id.toUpperCase()}]</span> {c.text}
              {c.classRequired && character.class !== c.classRequired && <span className="req">🔒 {c.classRequired}</span>}
              {c.requirement?.stat && (character.stats[c.requirement.stat] || 0) < c.requirement.min && <span className="req">⚡ {c.requirement.stat.toUpperCase()} {c.requirement.min}+</span>}
              {c.manaCost && <span className="mana-cost">◇{c.manaCost}</span>}
            </button>
          ))}
          {node.type === 'narrative' && <button disabled={busy} onClick={() => goTo(node.nextNodeId)}>Continue...</button>}
          {node.type === 'reward' && <><div className="reward">{node.rewards?.map((r, i) => <div key={i}>+ {r.amount} {r.type}</div>)}</div><button disabled={busy} onClick={() => claimReward(node)}>Continue...</button></>}
          {node.type === 'combat' && combat && !busy && (combat.victory ? <button onClick={() => goTo(node.victoryNodeId)}>Continue...</button> : <><button onClick={() => goTo(node.defeatNodeId)}>Accept defeat...</button>{node.fleeNodeId && <button onClick={() => goTo(node.fleeNodeId)}>Flee!</button>}</>)}
          {node.type === 'outcome' && <><div className="xp-award">+{node.xpAwarded} XP</div><button onClick={finishQuest}>{node.outcome === 'act-complete' ? 'Continue to Act 2...' : 'Return to Menu'}</button></>}
        </div>
      </main>

      <EchoJournal entries={journal.entries} insights={journal.insights} isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
      <InventoryPanel inventory={inventory} marks={gameState.marks} debt={gameState.debt} isOpen={inventoryOpen} onClose={() => setInventoryOpen(false)} onUse={handleUse} />
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

  const handleCreate = (data) => {
    setCharacter(createCharacter(data.name, data.class, data.portraitUrl, data.portraitIndex));
    setScreen('menu');
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header><div className="brand">GREY STRATUM</div><div className="sub">THE DESCENT v2.0</div></header>
        
        {screen === 'menu' && (
          <div className="menu">
            <h1>GREY STRATUM</h1>
            <p className="tagline">What does humanity owe itself when survival is uncertain?</p>
            {character && <div className="menu-card"><img src={character.portraitUrl} alt="" onError={e => e.target.style.display = 'none'} /><div><b>{character.name}</b><br />{CLASS_DEFS[character.class]?.name} Lv{character.level}</div></div>}
            <button onClick={() => setScreen('quest')} disabled={!character}>▸ BEGIN DESCENT</button>
            <button onClick={() => setScreen('create')}>▸ NEW OPERATIVE</button>
          </div>
        )}
        
        {screen === 'create' && <CharacterCreator onComplete={handleCreate} onCancel={() => setScreen('menu')} />}
        {screen === 'quest' && character && <QuestScreen character={character} setCharacter={setCharacter} onComplete={(r, xp) => { setOutcome({ result: r, xp }); setScreen('outcome'); }} />}
        
        {screen === 'outcome' && (
          <div className="outcome">
            <h1 className={outcome?.result}>{outcome?.result === 'act-complete' ? 'ACT 1 COMPLETE' : 'THE SURVIVOR'}</h1>
            <div className="xp">+{outcome?.xp} XP</div>
            <button onClick={() => setScreen('menu')}>Menu</button>
          </div>
        )}
        
        <footer><span>● ONLINE</span><span>THE CIRCUIT</span></footer>
      </div>
    </>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const STYLES = `
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
.menu button{display:block;width:100%;padding:.9rem;margin:.5rem 0;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.8rem;color:var(--text);cursor:pointer}
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

.creator{max-width:900px;margin:1rem auto;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.creator-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.creator-header h1{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan)}
.creator-header button{background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:pointer}
.creator-body{display:grid;grid-template-columns:280px 1fr;gap:1px;background:var(--border)}
.preview-panel{background:var(--bg);padding:1rem;display:flex;flex-direction:column;align-items:center}
.preview-frame{width:240px;height:300px;background:#000;border:2px solid var(--border);border-radius:6px;overflow:hidden}
.preview-frame img{width:100%;height:100%;object-fit:cover}
.preview-stats{display:flex;gap:.75rem;margin-top:.75rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.class-traits{display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap;justify-content:center}
.trait{font-size:.65rem;padding:.2rem .5rem;background:var(--card);border:1px solid var(--border);border-radius:3px;color:var(--amber)}
.options-panel{background:var(--panel);padding:1rem;overflow-y:auto;max-height:480px}
.opt-section{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--cyan);letter-spacing:.1em;margin:1rem 0 .5rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)}
.opt-section:first-child{margin-top:0}
.class-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem}
.class-btn{padding:.6rem;background:var(--card);border:1px solid var(--border);border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
.class-btn:hover{border-color:var(--cyan)}
.class-btn.selected{border-color:var(--cyan);background:#1a2a3a}
.class-name{font-size:.8rem;color:var(--text)}
.class-affinity{font-size:1rem}
.class-affinity.white{color:#e0e0ff}
.class-affinity.black{color:#404040}
.class-affinity.grey{color:#808080}
.portrait-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}
.portrait-btn{aspect-ratio:3/4;background:var(--card);border:2px solid var(--border);border-radius:4px;cursor:pointer;overflow:hidden;padding:0}
.portrait-btn:hover{border-color:var(--cyan)}
.portrait-btn.selected{border-color:var(--cyan);box-shadow:0 0 10px rgba(0,240,255,.3)}
.portrait-btn img{width:100%;height:100%;object-fit:cover}
.portrait-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--dim)}
.class-desc{font-size:.85rem;color:var(--dim);line-height:1.5}
.creator-footer{padding:.75rem 1rem;background:var(--card);border-top:1px solid var(--border);display:flex;gap:.75rem}
.creator-footer input{flex:1;padding:.6rem;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:#fff;font-size:.9rem}
.creator-footer input::placeholder{color:var(--dim)}
.create-btn{padding:.6rem 1.5rem;background:linear-gradient(90deg,#00a0aa,var(--cyan));border:none;border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.75rem;color:var(--bg);cursor:pointer}
.create-btn:disabled{opacity:.5}

.game-layout{flex:1;display:grid;grid-template-columns:280px 1fr;background:var(--border);gap:1px}
.sidebar{background:var(--panel);padding:1rem;overflow-y:auto}
.card{background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden}
.card-top{display:flex;justify-content:space-between;padding:.5rem .6rem;background:#1a1a25;border-bottom:1px solid var(--border);font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--cyan)}
.portrait{width:100%;height:180px;object-fit:cover}
.card-name{text-align:center;font-family:'Orbitron',sans-serif;font-size:.9rem;color:#fff;padding:.5rem .5rem 0}
.card-class{text-align:center;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--cyan);padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.shade-container{padding:.5rem .6rem;border-bottom:1px solid var(--border)}
.shade-label{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--dim);margin-bottom:.25rem}
.shade-track{position:relative;height:8px;background:var(--bg);border-radius:4px}
.shade-gradient{position:absolute;inset:0;background:linear-gradient(90deg,#1a1a1a,#808080,#ffffff);border-radius:4px;opacity:.6}
.shade-marker{position:absolute;top:-2px;width:4px;height:12px;background:var(--cyan);border-radius:2px;transform:translateX(-50%);box-shadow:0 0 6px var(--cyan)}
.shade-ends{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.45rem;color:var(--dim);margin-top:.2rem}
.bars{padding:.6rem}
.bar{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--dim);margin-bottom:.15rem}
.bar-track{height:6px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:.4rem}
.bar-fill{height:100%;transition:width .3s}
.bar-fill.hp{background:var(--green)}
.bar-fill.mana{background:var(--mana)}
.bar-fill.xp{background:var(--cyan)}
.stats-row{display:flex;justify-content:space-around;padding:.5rem;border-top:1px solid var(--border)}
.stats-row div{text-align:center}
.stats-row span{display:block;font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--dim)}
.stats-row b{font-family:'Orbitron',sans-serif;font-size:1rem;color:#fff}
.sidebar-btns{display:flex;gap:.5rem;padding:.5rem}
.sidebar-btns button{flex:1;padding:.4rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--dim);cursor:pointer}
.sidebar-btns button:hover{border-color:var(--cyan);color:var(--cyan)}

.narrative{background:var(--panel);padding:1.5rem;overflow-y:auto}
.location{font-family:'Orbitron',sans-serif;font-size:.65rem;color:var(--amber);letter-spacing:.2em;margin-bottom:1rem}
.text{font-size:1rem;line-height:1.7;white-space:pre-wrap;max-width:650px}
.visible-items{margin:1rem 0;padding:.75rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;max-width:500px}
.vi-header{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--amber);margin-bottom:.5rem}
.vi-item{margin-bottom:.25rem}
.vi-name{background:none;border:none;color:var(--cyan);font-family:'Share Tech Mono',monospace;font-size:.8rem;cursor:pointer;padding:0}
.vi-name:hover{text-decoration:underline}
.vi-detail{margin-top:.25rem;padding:.5rem;background:var(--card);border-radius:4px;font-size:.85rem}
.vi-take{margin-top:.5rem;padding:.25rem .5rem;background:var(--cyan);border:none;border-radius:2px;color:var(--bg);font-size:.7rem;cursor:pointer}
.sys-out{background:var(--bg);border:1px solid var(--border);border-left:3px solid var(--cyan);padding:.75rem;margin:1rem 0;font-family:'Share Tech Mono',monospace;font-size:.75rem;max-width:450px}
.sys-head{color:var(--cyan);margin-bottom:.5rem;font-size:.65rem}
.sys-out .win{color:var(--green);margin-top:.5rem;font-weight:bold}
.sys-out .lose{color:var(--red);margin-top:.5rem;font-weight:bold}
.combat-log{max-height:100px;overflow-y:auto;font-size:.65rem;color:var(--dim)}
.choices{margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1rem}
.choices button{display:flex;align-items:center;gap:.6rem;width:100%;padding:.65rem .8rem;margin-bottom:.4rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:.85rem;cursor:pointer;text-align:left}
.choices button:hover:not(:disabled){background:#222230;border-color:var(--cyan);transform:translateX(3px)}
.choices button:disabled{opacity:.4;cursor:not-allowed}
.choices button span:first-child{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.choices button.light{border-left:3px solid #a0a0e0}
.choices button.dark{border-left:3px solid #404040}
.choices .req{color:var(--amber);font-size:.7rem;margin-left:auto}
.choices .mana-cost{color:var(--mana);font-size:.7rem;margin-left:.5rem}
.choices .reward{color:var(--green);font-family:'Share Tech Mono',monospace;font-size:.8rem;margin-bottom:.5rem}
.choices .xp-award{color:var(--cyan);font-family:'Share Tech Mono',monospace;margin-bottom:.5rem}

.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:100}
.panel{width:90%;max-width:500px;max-height:80vh;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden;display:flex;flex-direction:column}
.panel-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.panel-header h2{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan)}
.panel-header button{background:none;border:none;color:var(--dim);font-size:1.2rem;cursor:pointer}
.tabs{display:flex;border-bottom:1px solid var(--border)}
.tabs button{flex:1;padding:.5rem;background:none;border:none;color:var(--dim);font-family:'Share Tech Mono',monospace;font-size:.75rem;cursor:pointer}
.tabs button.active{color:var(--cyan);border-bottom:2px solid var(--cyan)}
.panel-content{flex:1;overflow-y:auto;padding:1rem}
.empty{color:var(--dim);font-style:italic;text-align:center}
.entry{margin-bottom:1rem;padding:.75rem;background:var(--card);border-radius:4px}
.entry-title{font-family:'Orbitron',sans-serif;font-size:.7rem;color:var(--amber);margin-bottom:.5rem}
.entry-text{font-size:.85rem;line-height:1.5}
.currency{display:flex;gap:1rem;padding:.75rem 1rem;border-bottom:1px solid var(--border);font-family:'Share Tech Mono',monospace;font-size:.8rem}
.currency .marks{color:var(--amber)}
.currency .debt{color:var(--red)}
.inv-item{display:flex;align-items:center;gap:.75rem;padding:.5rem;margin-bottom:.5rem;background:var(--card);border:1px solid var(--border);border-radius:4px;cursor:pointer}
.inv-item:hover,.inv-item.selected{border-color:var(--cyan)}
.inv-icon{font-size:1.2rem;color:var(--cyan)}
.inv-name{flex:1;font-size:.85rem}
.inv-qty{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--dim)}
.item-details{padding:1rem;border-top:1px solid var(--border);background:var(--bg)}
.item-details p{font-size:.85rem;margin-bottom:.5rem}
.item-details button{padding:.4rem .75rem;background:var(--cyan);border:none;border-radius:4px;color:var(--bg);font-size:.75rem;cursor:pointer}
.error{padding:2rem;text-align:center;color:var(--red)}

@media(max-width:768px){
  .creator-body,.game-layout{grid-template-columns:1fr}
  .sidebar{display:none}
  .portrait-grid{grid-template-columns:repeat(3,1fr)}
}
`;
