import React, { useState, useCallback } from 'react';

// =============================================================================
// SCHEMAS - Classes, Items, Traits
// =============================================================================

const CLASS_DEFINITIONS = {
  'space-knight': {
    id: 'space-knight', name: 'Space Knight',
    description: 'Balanced fighter trained in combat and tactics.',
    baseStats: { phy: 4, int: 2, def: 3 }, baseHp: 12,
    startingGear: ['pulse-blade', 'standard-armor'], startingTraits: [], emoji: '⚔️'
  },
  'tech-runner': {
    id: 'tech-runner', name: 'Tech Runner',
    description: 'Specialist in bypassing security and solving problems.',
    baseStats: { phy: 2, int: 5, def: 2 }, baseHp: 10,
    startingGear: ['hack-tool', 'light-vest', 'emp-grenade'], startingTraits: [], emoji: '💻'
  },
  'vanguard': {
    id: 'vanguard', name: 'Vanguard',
    description: 'Heavy assault specialist. High damage and survivability.',
    baseStats: { phy: 5, int: 2, def: 4 }, baseHp: 14,
    startingGear: ['heavy-gauntlets', 'plated-armor'], startingTraits: [], emoji: '🛡️'
  },
  'medic': {
    id: 'medic', name: 'Medic',
    description: 'Combat medic. Keeps themselves and allies alive.',
    baseStats: { phy: 3, int: 4, def: 2 }, baseHp: 11,
    startingGear: ['med-kit', 'sidearm', 'light-vest'], startingTraits: ['field-medicine'], emoji: '💉'
  },
  'scout': {
    id: 'scout', name: 'Scout',
    description: 'Recon specialist. Avoids danger, finds opportunities.',
    baseStats: { phy: 3, int: 3, def: 3 }, baseHp: 10,
    startingGear: ['stealth-cloak', 'scanner', 'combat-knife'], startingTraits: ['eagle-eye'], emoji: '👁️'
  },
  'engineer': {
    id: 'engineer', name: 'Engineer',
    description: 'Technical expert. Repairs, builds, and improvises.',
    baseStats: { phy: 2, int: 5, def: 2 }, baseHp: 10,
    startingGear: ['repair-tool', 'drone-companion', 'light-vest'], startingTraits: ['jury-rig'], emoji: '🔧'
  }
};

const TRAIT_DEFINITIONS = {
  'combat-reflexes': { name: 'Combat Reflexes', description: '+1 PHY combat' },
  'neural-boost': { name: 'Neural Boost', description: '+1 INT tech' },
  'field-medicine': { name: 'Field Medicine', description: '+2 HP healing' },
  'eagle-eye': { name: 'Eagle Eye', description: '+1 perception' },
  'jury-rig': { name: 'Jury Rig', description: 'Repair equipment' },
  'lucky': { name: 'Lucky', description: 'Reroll once/quest' }
};

const ITEM_DEFINITIONS = {
  'pulse-blade': { name: 'Pulse Blade', category: 'weapon' },
  'standard-armor': { name: 'Standard Armor', category: 'armor' },
  'hack-tool': { name: 'Hack Tool', category: 'tool' },
  'light-vest': { name: 'Light Vest', category: 'armor' },
  'emp-grenade': { name: 'EMP Grenade', category: 'consumable' },
  'heavy-gauntlets': { name: 'Heavy Gauntlets', category: 'weapon' },
  'plated-armor': { name: 'Plated Armor', category: 'armor' },
  'med-kit': { name: 'Med-Kit', category: 'tool' },
  'sidearm': { name: 'Sidearm', category: 'weapon' },
  'stealth-cloak': { name: 'Stealth Cloak', category: 'armor' },
  'scanner': { name: 'Scanner', category: 'tool' },
  'combat-knife': { name: 'Combat Knife', category: 'weapon' },
  'repair-tool': { name: 'Repair Tool', category: 'tool' },
  'drone-companion': { name: 'Drone Companion', category: 'tool' },
  'med-stim': { name: 'Med-Stim', category: 'consumable' },
  'data-chip': { name: 'Data Chip', category: 'key' },
  'sector-keycard': { name: 'Sector Keycard', category: 'key' }
};

// =============================================================================
// QUEST - "The Silent Station"
// =============================================================================

const QUEST = {
  id: 'quest-001',
  title: 'The Silent Station',
  subtitle: 'Something stirs in Sector 7',
  
  nodes: {
    'start': {
      type: 'narrative',
      location: 'SECTOR 7 — APPROACH VECTOR',
      text: `Your shuttle cuts through the debris field surrounding Station Omega-7. Through the viewport, the station hangs in the void—dark except for a single blinking light.

Thirty years ago, this was a cutting-edge xenobiology lab. Then transmissions stopped. No distress call. Everyone assumed the worst.

Three days ago, it started broadcasting: "EXPERIMENT VIABLE. AWAITING RETRIEVAL."

Your mission: Find out what's transmitting and why.`,
      nextNodeId: 'airlock'
    },
    
    'airlock': {
      type: 'choice',
      location: 'STATION OMEGA-7 — AIRLOCK',
      text: `The airlock hisses open—stale recycled air. Emergency lighting flickers amber. Your scanner picks up faint power signatures deeper in.

The main corridor stretches into darkness. A maintenance shaft to your left shows fresh scrape marks on the access panel.

Metal groans in the distance.`,
      choices: [
        { id: 'a', text: 'Proceed down the main corridor, weapon ready', nextNodeId: 'corridor-check' },
        { id: 'b', text: 'Investigate the maintenance shaft', nextNodeId: 'shaft-check' },
        { id: 'c', text: 'Scan for life signs first', nextNodeId: 'scan-check' },
        { id: 'd', text: 'Return to your ship — bad feeling', nextNodeId: 'retreat' }
      ]
    },
    
    'corridor-check': {
      type: 'check',
      text: `You advance down the corridor. Halfway, you hear it—scraping from a ventilation grate overhead. Something watching.

Combat instincts kick in.`,
      checkType: 'phy',
      difficulty: 3,
      successNodeId: 'corridor-success',
      failureNodeId: 'corridor-ambush',
      successXp: 15
    },
    
    'corridor-success': {
      type: 'narrative',
      text: `You spin and strike. Your blade carves through the grate as a maintenance drone drops—its claws slice empty air where your head was.

The drone clatters to the deck, sparking. Thirty years of degraded programming made it feral.

You continue forward.`,
      nextNodeId: 'main-lab'
    },
    
    'corridor-ambush': {
      type: 'combat',
      text: `Too slow. The drone drops onto your back, claws raking armor. You roll, throwing it off.

It lands in a crouch, sensors glowing red. Feral and hunting.`,
      enemy: { name: 'Feral Maintenance Drone', hp: 6, phy: 2, def: 1 },
      victoryNodeId: 'drone-victory',
      defeatNodeId: 'defeat',
      fleeNodeId: 'main-lab',
      victoryXp: 25
    },
    
    'drone-victory': {
      type: 'reward',
      text: `The drone collapses in sparks. Among its parts, you find an intact med-stim—still sealed after thirty years.`,
      rewards: [{ type: 'item', itemId: 'med-stim' }],
      nextNodeId: 'main-lab'
    },
    
    'shaft-check': {
      type: 'check',
      location: 'MAINTENANCE SHAFT 7-A',
      text: `You squeeze into the shaft. The walls are covered in scratches—tally marks?

Your light catches a junction box, half-open, wires rerouted. Someone modified the station's systems.

Can you figure out what they did?`,
      checkType: 'int',
      difficulty: 3,
      successNodeId: 'shaft-success',
      failureNodeId: 'shaft-fail',
      successXp: 20
    },
    
    'shaft-success': {
      type: 'narrative',
      text: `You trace the circuits. Someone routed all power to the xenobiology lab—the broadcast, lights, everything keeps one section alive.

Better: you've found a direct route. The shaft leads above the main lab. You could drop in from above.`,
      nextNodeId: 'lab-above'
    },
    
    'shaft-fail': {
      type: 'narrative',
      text: `The wiring makes no sense—too corrupted. You waste minutes on dead ends.

The shaft eventually opens to the main corridor. At least you're past the junction.`,
      nextNodeId: 'main-lab'
    },
    
    'scan-check': {
      type: 'check',
      text: `You raise your scanner, sweeping the corridor. It hums, processing decades of sensor ghosts.

Getting a clear reading through this interference takes skill.`,
      checkType: 'int',
      difficulty: 4,
      successNodeId: 'scan-success',
      failureNodeId: 'scan-fail',
      successXp: 15
    },
    
    'scan-success': {
      type: 'choice',
      text: `Your scanner cuts through. Three signatures:

• Mobile contact in ceiling vents—small, mechanical, erratic. Damaged drone.
• Large power signature in main lab—active cryogenics. Something kept cold.
• Third signature, faint, secondary lab. Organic. Alive.

Someone else is here.`,
      choices: [
        { id: 'a', text: 'Move carefully to main lab, avoid vents', nextNodeId: 'main-lab' },
        { id: 'b', text: 'Investigate the organic signature', nextNodeId: 'survivor' },
        { id: 'c', text: 'Eliminate the drone first', nextNodeId: 'corridor-check' }
      ]
    },
    
    'scan-fail': {
      type: 'narrative',
      text: `Static. Can't get a clear read. Fragments—movement in vents, power ahead—nothing definite.

Old-fashioned way it is.`,
      nextNodeId: 'airlock'
    },
    
    'survivor': {
      type: 'choice',
      location: 'SECONDARY RESEARCH LAB',
      text: `The lab is makeshift quarters—cot, nutrient paste, water recycler.

In the corner: a woman in a faded lab coat, grey hair, steady hands on a shock prod.

"You're not company," she says. "Thirty years I've contained it. Now they want it back?"

Dr. Yuki Tanaka hasn't lowered her weapon.

"The cryo is failing. When it wakes..." She shakes her head. "You should leave."`,
      choices: [
        { id: 'a', text: '"What are we dealing with?"', nextNodeId: 'tanaka-explain' },
        { id: 'b', text: '"Help me destroy it."', nextNodeId: 'tanaka-ally' },
        { id: 'c', text: 'Continue to main lab alone', nextNodeId: 'main-lab' }
      ]
    },
    
    'tanaka-explain': {
      type: 'narrative',
      text: `"An adaptive organism. We found it dormant—thought we could study it." Bitter laugh.

"It wasn't dormant. Waiting. When thawed, it started integrating. Equipment. Then researchers. I made it to the bulkheads."

She gestures toward the lab. "Thirty years keeping cryo running. Power cells dying. Hours until it wakes. And it remembers everything it absorbed—including how to run this station."`,
      nextNodeId: 'lab-decision'
    },
    
    'tanaka-ally': {
      type: 'reward',
      text: `Hope crosses her face.

"I know the weak points. Overload the reactor—vaporize the whole lab."

She hands you a keycard. "Control room access. I'll start the sequence. Meet me in engineering."

After thirty years, Dr. Tanaka has an ally.`,
      rewards: [{ type: 'item', itemId: 'sector-keycard' }],
      nextNodeId: 'lab-decision'
    },
    
    'main-lab': {
      type: 'choice',
      location: 'MAIN LABORATORY — EXTERIOR',
      text: `The lab doors. Through the viewport: the cryogenic pod, frosted but failing. Condensation. Temperature climbing.

Whatever's inside won't stay frozen long.

Door controls are active.`,
      choices: [
        { id: 'a', text: 'Enter the lab', nextNodeId: 'lab-interior' },
        { id: 'b', text: 'Try to hack cryo systems remotely', nextNodeId: 'hack-check' }
      ]
    },
    
    'lab-decision': {
      type: 'choice',
      location: 'MAIN LABORATORY — EXTERIOR',
      text: `Through the viewport: the cryo pod failing. Condensation. Temperature climbing.

Whatever's inside won't stay frozen.`,
      choices: [
        { id: 'a', text: 'Enter and face it', nextNodeId: 'lab-interior' },
        { id: 'b', text: 'Overload reactor—destroy everything', nextNodeId: 'reactor', requirement: { itemId: 'sector-keycard' } },
        { id: 'c', text: 'Hack cryo systems, buy time', nextNodeId: 'hack-check' }
      ]
    },
    
    'lab-above': {
      type: 'choice',
      location: 'MAIN LABORATORY — CEILING',
      text: `Through the grate: the cryo pod. But you see something ground level would miss.

The pod isn't just leaking. Something inside presses against glass. Slowly. Testing.

It's already awake. Waiting for its prison to fail.`,
      choices: [
        { id: 'a', text: 'Drop down with surprise attack', nextNodeId: 'boss-advantage' },
        { id: 'b', text: 'Retreat, find another way', nextNodeId: 'lab-decision' }
      ]
    },
    
    'hack-check': {
      type: 'check',
      text: `External control panel. Reroute power to cryo. The system fights you—corrupted code, failing hardware, something like active resistance.`,
      checkType: 'int',
      difficulty: 5,
      successNodeId: 'hack-success',
      failureNodeId: 'hack-fail',
      successXp: 25
    },
    
    'hack-success': {
      type: 'reward',
      text: `Fingers flying. Cryo stabilizes—an hour, maybe two.

Better: you've downloaded complete research logs. Command will want these.`,
      rewards: [{ type: 'xp', amount: 25 }, { type: 'item', itemId: 'data-chip' }],
      nextNodeId: 'lab-decision'
    },
    
    'hack-fail': {
      type: 'narrative',
      text: `System rejects override. Worse—klaxons blare. Cryo emergency shutdown.

The pod is opening.`,
      nextNodeId: 'lab-interior'
    },
    
    'lab-interior': {
      type: 'narrative',
      location: 'MAIN LABORATORY — INTERIOR',
      text: `Door hisses. Lab preserved—equipment powered, notes on screens.

Except the bodies.

Three researchers at stations. Not dead—part of the organism. Fused with equipment, each other, walls. Biomechanical tissue spreading from the cryo pod like roots.

The pod cracks.

The thing unfolds—too many limbs, too many eyes, wearing absorbed faces.

"NEW," it says with three voices. "NEW PATTERNS."

It reaches.`,
      nextNodeId: 'boss-fight'
    },
    
    'reactor': {
      type: 'choice',
      location: 'ENGINEERING — REACTOR',
      text: `The core hums—energy enough for a century or instant vaporization.

Overload: disable safeties, push critical, run. Three minutes.

Destroy everything. Make sure it never reaches populated space.

Your hand hovers.`,
      choices: [
        { id: 'a', text: 'Initiate overload. Destroy it all.', nextNodeId: 'victory-destroy' },
        { id: 'b', text: 'No—face it directly.', nextNodeId: 'boss-fight' }
      ]
    },
    
    'boss-advantage': {
      type: 'combat',
      location: 'MAIN LABORATORY — SURPRISE',
      text: `You drop, blade first. Strike carves through a limb before it knows you're there.

Three-voiced scream. Advantage yours—but far from over.`,
      enemy: { name: 'The Amalgam (Wounded)', hp: 8, phy: 4, def: 1 },
      victoryNodeId: 'victory-combat',
      defeatNodeId: 'defeat',
      victoryXp: 40
    },
    
    'boss-fight': {
      type: 'combat',
      location: 'MAIN LABORATORY — CONFRONTATION',
      text: `The creature flows toward you—shifting, not walking. Victims' faces swim across its surface.

Thirty years absorbing knowledge. It knows how to fight.

So do you.`,
      enemy: { name: 'The Amalgam', hp: 12, phy: 4, def: 2 },
      victoryNodeId: 'victory-combat',
      defeatNodeId: 'defeat',
      fleeNodeId: 'reactor',
      victoryXp: 50
    },
    
    'victory-combat': {
      type: 'outcome',
      location: 'MAIN LABORATORY — AFTERMATH',
      text: `The creature collapses. Stolen forms finally silent.

You gather salvageable data. Shuttle pulls away. Station recedes into void.

Part of you knows you should destroy it.

Not your call. You did your job.

MISSION COMPLETE`,
      outcome: 'victory',
      xpAwarded: 50
    },
    
    'victory-destroy': {
      type: 'outcome',
      location: 'ESCAPE POD — DEPARTING',
      text: `Overload irreversible. Two minutes.

Through corridors, past the shambling thing, into escape pod. Doors seal as it reaches the airlock.

Station Omega-7 comes apart. White light. Metal and organic vaporized. Thirty years of horror—gone.

Dr. Tanaka watches with peace.

"Thank you."

MISSION COMPLETE`,
      outcome: 'victory',
      xpAwarded: 50
    },
    
    'defeat': {
      type: 'outcome',
      text: `You fall. It looms.

"NEW PATTERNS. THANK YOU."

---

MISSION FAILED

Rescued by distress beacon. The creature escaped containment.

Recorded in provenance.`,
      outcome: 'defeat',
      xpAwarded: 10
    },
    
    'retreat': {
      type: 'outcome',
      location: 'SHUTTLE — DEPARTING',
      text: `Something says this is wrong. Whatever's there waited thirty years. Can wait longer.

You return to shuttle.

Pulling away, you see it—a shape in the viewport. Watching.

It waves.

MISSION INCOMPLETE`,
      outcome: 'retreat',
      xpAwarded: 5
    }
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function createCharacter(name, classId, ownerId, ownerName) {
  const cls = CLASS_DEFINITIONS[classId];
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    class: classId,
    version: '1.0',
    stats: { ...cls.baseStats },
    hp: { current: cls.baseHp, max: cls.baseHp },
    xp: { current: 0, toNextLevel: 100 },
    level: 1,
    traits: [...cls.startingTraits],
    inventory: cls.startingGear.map(id => ({ itemId: id, quantity: 1 })),
    provenance: [{
      id: generateId(),
      timestamp: now,
      version: '1.0',
      eventType: 'created',
      description: `Created at ${ownerName}'s terminal`,
      ownerName
    }],
    ownership: { ownerId, ownerName, acquiredAt: now },
    questsCompleted: 0,
    enemiesDefeated: 0,
    timesEvolved: 0,
    timesDevolved: 0,
    createdAt: now
  };
}

function performCheck(character, checkType, difficulty) {
  const stat = character.stats[checkType];
  const roll = Math.floor(Math.random() * 6) + 1;
  const total = stat + roll;
  const target = difficulty + 6;
  return { stat, roll, total, target, success: total >= target };
}

function resolveCombat(character, enemy) {
  let playerHp = character.hp.current;
  let enemyHp = enemy.hp;
  const rounds = [];
  
  while (playerHp > 0 && enemyHp > 0 && rounds.length < 10) {
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const playerDmg = Math.max(0, character.stats.phy + playerRoll - enemy.def);
    enemyHp -= playerDmg;
    
    let enemyDmg = 0;
    if (enemyHp > 0) {
      const enemyRoll = Math.floor(Math.random() * 6) + 1;
      enemyDmg = Math.max(0, enemy.phy + enemyRoll - character.stats.def);
      playerHp -= enemyDmg;
    }
    
    rounds.push({ playerRoll, playerDmg, enemyDmg, playerHp, enemyHp });
  }
  
  return { rounds, victory: enemyHp <= 0, playerHp, damageTaken: character.hp.current - playerHp };
}

// =============================================================================
// STYLES
// =============================================================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;500;600&family=Share+Tech+Mono&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-deep: #0a0a0f;
  --bg-panel: #12121a;
  --bg-card: #1a1a25;
  --bg-elevated: #222230;
  --cyan: #00f0ff;
  --cyan-dim: #00a0aa;
  --magenta: #ff00aa;
  --amber: #ffaa00;
  --green: #00ff88;
  --red: #ff3366;
  --text-bright: #fff;
  --text-normal: #c0c0d0;
  --text-dim: #606080;
  --border: #2a2a3a;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;
}

body { background: var(--bg-deep); color: var(--text-normal); font-family: var(--font-body); }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* Header */
.header {
  padding: 1rem 2rem;
  background: linear-gradient(180deg, rgba(10,10,15,0.98), rgba(10,10,15,0.9));
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-brand { font-family: var(--font-display); font-size: 1.3rem; color: var(--cyan); letter-spacing: 0.3em; text-shadow: 0 0 20px rgba(0,240,255,0.5); }
.header-sub { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); }

/* Main Layout */
.main { flex: 1; display: flex; overflow: hidden; }
.sidebar { width: 320px; background: var(--bg-panel); padding: 1rem; overflow-y: auto; border-right: 1px solid var(--border); }
.content { flex: 1; background: var(--bg-panel); padding: 2rem; overflow-y: auto; }

/* Character Card */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
}
.card-brand { font-family: var(--font-display); font-size: 0.55rem; color: var(--cyan); letter-spacing: 0.15em; }
.card-version { font-family: var(--font-mono); font-size: 0.6rem; color: var(--amber); background: rgba(255,170,0,0.1); padding: 0.15rem 0.4rem; border-radius: 3px; }

.card-portrait {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--bg-elevated), var(--bg-card));
  font-size: 4rem;
}

.card-info { padding: 0.75rem; text-align: center; border-bottom: 1px solid var(--border); }
.card-name { font-family: var(--font-display); font-size: 1rem; color: var(--text-bright); margin-bottom: 0.2rem; }
.card-class { font-family: var(--font-mono); font-size: 0.65rem; color: var(--cyan-dim); text-transform: uppercase; letter-spacing: 0.15em; }

.card-stats { padding: 0.75rem; border-bottom: 1px solid var(--border); }

.stat-bar { margin-bottom: 0.5rem; }
.stat-bar-label { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); margin-bottom: 0.2rem; }
.stat-bar-track { height: 8px; background: var(--bg-deep); border-radius: 2px; overflow: hidden; }
.stat-bar-fill { height: 100%; transition: width 0.3s; }
.stat-bar-fill.hp { background: var(--green); }
.stat-bar-fill.xp { background: linear-gradient(90deg, var(--cyan-dim), var(--cyan)); }

.core-stats { display: flex; justify-content: space-around; margin-top: 0.75rem; }
.stat { text-align: center; }
.stat-label { display: block; font-family: var(--font-display); font-size: 0.5rem; color: var(--text-dim); letter-spacing: 0.1em; }
.stat-value { display: block; font-family: var(--font-display); font-size: 1.3rem; color: var(--text-bright); }

.card-section { padding: 0.6rem 0.8rem; border-bottom: 1px solid var(--border); }
.section-label { font-family: var(--font-display); font-size: 0.5rem; color: var(--text-dim); letter-spacing: 0.15em; margin-bottom: 0.4rem; }

.trait-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0,240,255,0.1);
  border: 1px solid var(--cyan-dim);
  border-radius: 3px;
  color: var(--cyan);
  margin-right: 0.3rem;
}

.gear-item {
  font-size: 0.75rem;
  color: var(--text-normal);
  padding: 0.15rem 0;
}
.gear-item::before { content: '▸ '; color: var(--amber); }

.provenance-toggle {
  width: 100%;
  padding: 0.6rem;
  background: none;
  border: none;
  font-family: var(--font-display);
  font-size: 0.5rem;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  cursor: pointer;
  text-align: left;
}
.provenance-toggle:hover { color: var(--cyan); background: rgba(0,240,255,0.05); }

.provenance-log { padding: 0 0.8rem 0.8rem; border-top: 1px solid var(--border); }
.prov-entry { display: flex; gap: 0.5rem; padding: 0.3rem 0; font-size: 0.6rem; border-bottom: 1px solid var(--border); }
.prov-entry:last-child { border: none; }
.prov-version { font-family: var(--font-mono); color: var(--amber); }
.prov-text { color: var(--text-normal); flex: 1; }

/* Narrative */
.narrative-location {
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: var(--amber);
  letter-spacing: 0.25em;
  margin-bottom: 1.5rem;
}
.narrative-location::before { content: '◆ '; }

.narrative-text {
  font-size: 1.05rem;
  line-height: 1.8;
  max-width: 700px;
  white-space: pre-wrap;
}

/* System Output */
.system-output {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-left: 3px solid var(--cyan);
  padding: 1rem;
  margin: 1.5rem 0;
  font-family: var(--font-mono);
  max-width: 500px;
}
.system-header { font-size: 0.65rem; color: var(--cyan); letter-spacing: 0.15em; margin-bottom: 0.75rem; }
.system-header::before { content: '◈ '; }
.check-line { font-size: 0.75rem; margin-bottom: 0.3rem; }
.check-result { font-size: 0.85rem; font-weight: bold; margin-top: 0.5rem; }
.check-result.success { color: var(--green); }
.check-result.failure { color: var(--red); }

/* Combat Log */
.combat-log { max-height: 200px; overflow-y: auto; margin: 0.5rem 0; }
.combat-round { font-size: 0.7rem; padding: 0.3rem 0; border-bottom: 1px solid var(--border); }

/* Choices */
.choices { margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
.choices-header { font-family: var(--font-display); font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.15em; margin-bottom: 0.75rem; }

.choice-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.4rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.choice-btn:hover { background: var(--bg-elevated); border-color: var(--cyan-dim); transform: translateX(4px); }
.choice-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.choice-key { font-family: var(--font-mono); font-size: 0.7rem; color: var(--cyan); }
.choice-text { font-size: 0.9rem; color: var(--text-normal); flex: 1; }
.choice-check { font-family: var(--font-mono); font-size: 0.6rem; color: var(--amber); background: rgba(255,170,0,0.1); padding: 0.2rem 0.4rem; border-radius: 3px; }

/* Character Creation */
.create-screen { max-width: 800px; margin: 0 auto; padding: 2rem; }
.create-title { font-family: var(--font-display); font-size: 1.5rem; color: var(--cyan); text-align: center; margin-bottom: 2rem; letter-spacing: 0.2em; }

.class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
.class-card {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.class-card:hover { border-color: var(--cyan-dim); }
.class-card.selected { border-color: var(--cyan); box-shadow: 0 0 20px rgba(0,240,255,0.2); }
.class-emoji { font-size: 2.5rem; margin-bottom: 0.5rem; }
.class-name { font-family: var(--font-display); font-size: 0.85rem; color: var(--text-bright); margin-bottom: 0.3rem; }
.class-desc { font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.5rem; }
.class-stats { font-family: var(--font-mono); font-size: 0.65rem; color: var(--cyan-dim); }

.name-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-bright);
  margin-bottom: 1.5rem;
}
.name-input:focus { outline: none; border-color: var(--cyan); }
.name-input::placeholder { color: var(--text-dim); }

.create-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, var(--cyan-dim), var(--cyan));
  border: none;
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--bg-deep);
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.2s;
}
.create-btn:hover { box-shadow: 0 0 30px rgba(0,240,255,0.4); }
.create-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Menu */
.menu-screen { max-width: 600px; margin: 0 auto; padding: 3rem 2rem; text-align: center; }
.menu-title { font-family: var(--font-display); font-size: 2rem; color: var(--cyan); letter-spacing: 0.3em; margin-bottom: 0.5rem; text-shadow: 0 0 30px rgba(0,240,255,0.5); }
.menu-sub { font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 3rem; }
.menu-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--text-normal);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}
.menu-btn:hover { border-color: var(--cyan); color: var(--cyan); }

/* Quest Complete */
.outcome-screen { max-width: 600px; margin: 0 auto; padding: 3rem 2rem; text-align: center; }
.outcome-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem; letter-spacing: 0.2em; }
.outcome-title.victory { color: var(--green); }
.outcome-title.defeat { color: var(--red); }
.outcome-title.retreat { color: var(--amber); }
.outcome-text { font-size: 1rem; line-height: 1.8; margin-bottom: 2rem; white-space: pre-wrap; }
.outcome-xp { font-family: var(--font-mono); color: var(--cyan); margin-bottom: 2rem; }

/* Footer */
.footer {
  padding: 0.5rem 2rem;
  background: var(--bg-panel);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-dim);
}
.status::before { content: '● '; color: var(--green); }
`;

// =============================================================================
// COMPONENTS
// =============================================================================

function CharacterCard({ character, showProvenance, setShowProvenance }) {
  const cls = CLASS_DEFINITIONS[character.class];
  const hpPct = (character.hp.current / character.hp.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNextLevel) * 100;
  
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-brand">◇ GREY STRATUM</span>
        <span className="card-version">v{character.version}</span>
      </div>
      
      <div className="card-portrait">{cls.emoji}</div>
      
      <div className="card-info">
        <div className="card-name">{character.name}</div>
        <div className="card-class">{cls.name}</div>
      </div>
      
      <div className="card-stats">
        <div className="stat-bar">
          <div className="stat-bar-label"><span>HP</span><span>{character.hp.current}/{character.hp.max}</span></div>
          <div className="stat-bar-track"><div className="stat-bar-fill hp" style={{ width: `${hpPct}%`, background: hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--amber)' : 'var(--red)' }} /></div>
        </div>
        <div className="stat-bar">
          <div className="stat-bar-label"><span>XP</span><span>{character.xp.current}/{character.xp.toNextLevel}</span></div>
          <div className="stat-bar-track"><div className="stat-bar-fill xp" style={{ width: `${xpPct}%` }} /></div>
        </div>
        <div className="core-stats">
          <div className="stat"><span className="stat-label">PHY</span><span className="stat-value">{character.stats.phy}</span></div>
          <div className="stat"><span className="stat-label">INT</span><span className="stat-value">{character.stats.int}</span></div>
          <div className="stat"><span className="stat-label">DEF</span><span className="stat-value">{character.stats.def}</span></div>
        </div>
      </div>
      
      <div className="card-section">
        <div className="section-label">TRAITS</div>
        {character.traits.length > 0 ? character.traits.map(t => (
          <span key={t} className="trait-badge">{TRAIT_DEFINITIONS[t]?.name || t}</span>
        )) : <span className="trait-badge" style={{ opacity: 0.4 }}>—</span>}
      </div>
      
      <div className="card-section">
        <div className="section-label">GEAR</div>
        {character.inventory.map(item => (
          <div key={item.itemId} className="gear-item">{ITEM_DEFINITIONS[item.itemId]?.name || item.itemId}</div>
        ))}
      </div>
      
      <button className="provenance-toggle" onClick={() => setShowProvenance(!showProvenance)}>
        {showProvenance ? '▼' : '▶'} PROVENANCE
      </button>
      
      {showProvenance && (
        <div className="provenance-log">
          {character.provenance.map((p, i) => (
            <div key={i} className="prov-entry">
              <span className="prov-version">v{p.version}</span>
              <span className="prov-text">{p.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterCreation({ onComplete }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [name, setName] = useState('');
  
  const handleCreate = () => {
    if (!selectedClass || !name.trim()) return;
    const character = createCharacter(name.trim(), selectedClass, 'player-1', 'Player');
    onComplete(character);
  };
  
  return (
    <div className="create-screen">
      <h1 className="create-title">CREATE CHARACTER</h1>
      
      <div className="class-grid">
        {Object.values(CLASS_DEFINITIONS).map(cls => (
          <div
            key={cls.id}
            className={`class-card ${selectedClass === cls.id ? 'selected' : ''}`}
            onClick={() => setSelectedClass(cls.id)}
          >
            <div className="class-emoji">{cls.emoji}</div>
            <div className="class-name">{cls.name}</div>
            <div className="class-desc">{cls.description}</div>
            <div className="class-stats">PHY {cls.baseStats.phy} · INT {cls.baseStats.int} · DEF {cls.baseStats.def} · HP {cls.baseHp}</div>
          </div>
        ))}
      </div>
      
      <input
        className="name-input"
        type="text"
        placeholder="Enter character name..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      
      <button className="create-btn" disabled={!selectedClass || !name.trim()} onClick={handleCreate}>
        CREATE CHARACTER
      </button>
    </div>
  );
}

function MainMenu({ character, onStartQuest, onNewCharacter }) {
  return (
    <div className="menu-screen">
      <h1 className="menu-title">GREY STRATUM</h1>
      <p className="menu-sub">Terminal v2.1.85</p>
      
      {character && (
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <CharacterCard character={character} showProvenance={false} setShowProvenance={() => {}} />
        </div>
      )}
      
      <button className="menu-btn" onClick={onStartQuest} disabled={!character}>
        ▸ START MISSION: The Silent Station
      </button>
      <button className="menu-btn" onClick={onNewCharacter}>
        ▸ NEW CHARACTER
      </button>
    </div>
  );
}

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('start');
  const [systemOutput, setSystemOutput] = useState(null);
  const [combatState, setCombatState] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  
  const node = QUEST.nodes[nodeId];
  
  const handleChoice = useCallback(async (choice) => {
    // Check requirements
    if (choice.requirement?.itemId) {
      const hasItem = character.inventory.some(i => i.itemId === choice.requirement.itemId);
      if (!hasItem) return;
    }
    
    setProcessing(true);
    setSystemOutput(null);
    setCombatState(null);
    
    await new Promise(r => setTimeout(r, 300));
    setNodeId(choice.nextNodeId);
    setProcessing(false);
  }, [character]);
  
  const handleContinue = useCallback(async (nextId) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 300));
    setNodeId(nextId);
    setSystemOutput(null);
    setCombatState(null);
    setProcessing(false);
  }, []);
  
  const handleCheck = useCallback(async (node) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    
    const result = performCheck(character, node.checkType, node.difficulty);
    setSystemOutput({ type: 'check', ...result, checkType: node.checkType, difficulty: node.difficulty });
    
    if (result.success && node.successXp) {
      setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + node.successXp } }));
    }
    
    await new Promise(r => setTimeout(r, 1500));
    setNodeId(result.success ? node.successNodeId : node.failureNodeId);
    setProcessing(false);
  }, [character, setCharacter]);
  
  const handleCombat = useCallback(async (node) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    
    const result = resolveCombat(character, node.enemy);
    setCombatState({ enemy: node.enemy, ...result });
    
    // Update character HP
    setCharacter(c => ({ ...c, hp: { ...c.hp, current: Math.max(0, result.playerHp) } }));
    
    if (result.victory && node.victoryXp) {
      setCharacter(c => ({ 
        ...c, 
        xp: { ...c.xp, current: c.xp.current + node.victoryXp },
        enemiesDefeated: c.enemiesDefeated + 1
      }));
    }
    
    setProcessing(false);
  }, [character, setCharacter]);
  
  const handleReward = useCallback((node) => {
    node.rewards?.forEach(reward => {
      if (reward.type === 'item') {
        setCharacter(c => ({
          ...c,
          inventory: [...c.inventory, { itemId: reward.itemId, quantity: reward.quantity || 1 }]
        }));
      } else if (reward.type === 'xp') {
        setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + reward.amount } }));
      }
    });
    handleContinue(node.nextNodeId);
  }, [handleContinue, setCharacter]);
  
  const handleOutcome = useCallback(() => {
    // Add XP
    if (node.xpAwarded) {
      setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + node.xpAwarded } }));
    }
    
    // Add provenance
    const provEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      version: character.version,
      eventType: node.outcome === 'victory' ? 'quest_completed' : 'quest_failed',
      description: node.outcome === 'victory' ? 'Completed: The Silent Station' : 'Failed: The Silent Station',
      ownerName: character.ownership.ownerName
    };
    
    setCharacter(c => ({
      ...c,
      provenance: [...c.provenance, provEntry],
      questsCompleted: node.outcome === 'victory' ? c.questsCompleted + 1 : c.questsCompleted
    }));
    
    onComplete(node.outcome, node.xpAwarded);
  }, [node, character, setCharacter, onComplete]);
  
  // Auto-trigger checks and combat
  React.useEffect(() => {
    if (node.type === 'check' && !systemOutput && !processing) {
      handleCheck(node);
    } else if (node.type === 'combat' && !combatState && !processing) {
      handleCombat(node);
    }
  }, [nodeId, node, systemOutput, combatState, processing, handleCheck, handleCombat]);
  
  return (
    <div className="main">
      <aside className="sidebar">
        <CharacterCard character={character} showProvenance={showProvenance} setShowProvenance={setShowProvenance} />
      </aside>
      
      <main className="content">
        {node.location && <div className="narrative-location">{node.location}</div>}
        
        <div className="narrative-text">{node.text}</div>
        
        {systemOutput?.type === 'check' && (
          <div className="system-output">
            <div className="system-header">SYSTEM OUTPUT</div>
            <div className="check-line">{systemOutput.checkType.toUpperCase()} CHECK — Difficulty {systemOutput.difficulty}</div>
            <div className="check-line">Base {systemOutput.stat} + Roll {systemOutput.roll} = {systemOutput.total} vs {systemOutput.target}</div>
            <div className={`check-result ${systemOutput.success ? 'success' : 'failure'}`}>
              {systemOutput.success ? '██ SUCCESS ██' : '░░ FAILURE ░░'}
            </div>
          </div>
        )}
        
        {combatState && (
          <div className="system-output">
            <div className="system-header">COMBAT — {combatState.enemy.name}</div>
            <div className="combat-log">
              {combatState.rounds.map((r, i) => (
                <div key={i} className="combat-round">
                  Round {i+1}: You deal {r.playerDmg} dmg (roll {r.playerRoll}) — Enemy deals {r.enemyDmg} dmg — Your HP: {r.playerHp} | Enemy HP: {r.enemyHp}
                </div>
              ))}
            </div>
            <div className={`check-result ${combatState.victory ? 'success' : 'failure'}`}>
              {combatState.victory ? '██ VICTORY ██' : '░░ DEFEAT ░░'}
            </div>
          </div>
        )}
        
        {/* Choices */}
        {node.type === 'choice' && (
          <div className="choices">
            <div className="choices-header">ACTIONS</div>
            {node.choices.map(choice => {
              const hasReq = !choice.requirement || character.inventory.some(i => i.itemId === choice.requirement.itemId);
              return (
                <button
                  key={choice.id}
                  className="choice-btn"
                  onClick={() => handleChoice(choice)}
                  disabled={processing || !hasReq}
                >
                  <span className="choice-key">[{choice.id.toUpperCase()}]</span>
                  <span className="choice-text">{choice.text}</span>
                  {choice.requirement && <span className="choice-check">Requires item</span>}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Narrative continue */}
        {node.type === 'narrative' && (
          <div className="choices">
            <button className="choice-btn" onClick={() => handleContinue(node.nextNodeId)} disabled={processing}>
              <span className="choice-text">Continue...</span>
            </button>
          </div>
        )}
        
        {/* Reward continue */}
        {node.type === 'reward' && (
          <div className="choices">
            <div style={{ marginBottom: '1rem', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              {node.rewards?.map((r, i) => (
                <div key={i}>+ {r.type === 'item' ? ITEM_DEFINITIONS[r.itemId]?.name : `${r.amount} XP`}</div>
              ))}
            </div>
            <button className="choice-btn" onClick={() => handleReward(node)} disabled={processing}>
              <span className="choice-text">Continue...</span>
            </button>
          </div>
        )}
        
        {/* Combat resolution */}
        {node.type === 'combat' && combatState && !processing && (
          <div className="choices">
            {combatState.victory ? (
              <button className="choice-btn" onClick={() => handleContinue(node.victoryNodeId)}>
                <span className="choice-text">Continue...</span>
              </button>
            ) : node.fleeNodeId ? (
              <>
                <button className="choice-btn" onClick={() => handleContinue(node.defeatNodeId)}>
                  <span className="choice-text">Accept defeat...</span>
                </button>
                <button className="choice-btn" onClick={() => handleContinue(node.fleeNodeId)}>
                  <span className="choice-text">Flee!</span>
                </button>
              </>
            ) : (
              <button className="choice-btn" onClick={() => handleContinue(node.defeatNodeId)}>
                <span className="choice-text">Continue...</span>
              </button>
            )}
          </div>
        )}
        
        {/* Outcome */}
        {node.type === 'outcome' && (
          <div className="choices">
            <div style={{ marginBottom: '1rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
              +{node.xpAwarded} XP
            </div>
            <button className="choice-btn" onClick={handleOutcome}>
              <span className="choice-text">Return to Menu</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

export default function App() {
  const [screen, setScreen] = useState('menu'); // menu, create, quest, outcome
  const [character, setCharacter] = useState(null);
  const [outcome, setOutcome] = useState(null);
  
  // Load character from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('grey-stratum-character');
    if (saved) {
      try {
        setCharacter(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);
  
  // Save character
  React.useEffect(() => {
    if (character) {
      localStorage.setItem('grey-stratum-character', JSON.stringify(character));
    }
  }, [character]);
  
  const handleCreateComplete = (char) => {
    setCharacter(char);
    setScreen('menu');
  };
  
  const handleQuestComplete = (result, xp) => {
    setOutcome({ result, xp });
    setScreen('outcome');
  };
  
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div>
            <div className="header-brand">GREY STRATUM</div>
            <div className="header-sub">TERMINAL v2.1.85</div>
          </div>
        </header>
        
        {screen === 'menu' && (
          <MainMenu
            character={character}
            onStartQuest={() => setScreen('quest')}
            onNewCharacter={() => setScreen('create')}
          />
        )}
        
        {screen === 'create' && (
          <CharacterCreation onComplete={handleCreateComplete} />
        )}
        
        {screen === 'quest' && character && (
          <QuestScreen
            character={character}
            setCharacter={setCharacter}
            onComplete={handleQuestComplete}
          />
        )}
        
        {screen === 'outcome' && (
          <div className="outcome-screen">
            <h1 className={`outcome-title ${outcome?.result}`}>
              {outcome?.result === 'victory' ? 'MISSION COMPLETE' : outcome?.result === 'defeat' ? 'MISSION FAILED' : 'MISSION INCOMPLETE'}
            </h1>
            <div className="outcome-xp">+{outcome?.xp} XP earned</div>
            <button className="menu-btn" onClick={() => setScreen('menu')}>
              Return to Menu
            </button>
          </div>
        )}
        
        <footer className="footer">
          <span className="status">SYSTEM ONLINE</span>
          <span>SECTOR 7 — 42.8°N 127.3°E</span>
        </footer>
      </div>
    </>
  );
}
