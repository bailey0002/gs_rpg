import React, { useState, useCallback, useEffect, useRef } from 'react';

// =============================================================================
// STRATUM ATTRIBUTE SYSTEM
// =============================================================================
// S - Strength (physical power, endurance, melee prowess)
// T - Theorem (knowledge, perception, technical skill, social reading)
// R - Resolve (willpower, mental fortitude, Shade control)
// A - Agility (speed, precision, stealth, reflexes)
// T - Tonitrus (derived: vitality/health pool)
// U - Ulterius (derived: initiative/sync timing window)
// M - Mana (derived: Shade pool resource for powers)

const calculateDerived = (str, thm, rsv, agi) => ({
  tonitrus: 8 + (str * 2) + rsv,
  ulterius: 8 + agi + Math.floor(thm / 2),
  mana: 4 + (rsv * 2) + Math.floor(thm / 2)
});

// =============================================================================
// CLASS DEFINITIONS
// =============================================================================

const CLASS_LIBRARY = {
  sentinel: {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Guardian & Protector',
    description: 'Stalwart defenders who shield allies and hold the line against overwhelming odds.',
    playable: true,
    shadeAffinity: 'white',
    stats: { str: 4, thm: 2, rsv: 3, agi: 3 },
    startingAbility: { name: 'Bulwark', description: 'Absorb damage meant for nearby allies. Costs 2 Mana.', cost: 2 },
    gear: ['energy-shield', 'pulse-blade', 'heavy-armor'],
    traits: ['stalwart'],
    portraitFolder: 'sentinel'
  },
  voidStalker: {
    id: 'voidStalker',
    name: 'Void Stalker',
    role: 'Shadow Assassin',
    description: 'Silent operatives who strike from darkness and vanish before retaliation.',
    playable: true,
    shadeAffinity: 'black',
    stats: { str: 3, thm: 3, rsv: 2, agi: 4 },
    startingAbility: { name: 'Shadow Strike', description: 'Attack from stealth for bonus damage. Requires undetected state.', cost: 0 },
    gear: ['void-blade', 'stealth-suit', 'grapple-line'],
    traits: ['silent-step'],
    portraitFolder: 'stalker'
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    role: 'Seer & Truth-Speaker',
    description: 'Visionaries who perceive hidden truths and glimpse possible futures.',
    playable: true,
    shadeAffinity: 'grey',
    stats: { str: 2, thm: 4, rsv: 4, agi: 2 },
    startingAbility: { name: 'Foresight', description: 'Preview the consequences of a choice before committing. Costs 3 Mana.', cost: 3 },
    gear: ['oracle-staff', 'resonance-robes', 'third-eye-implant'],
    traits: ['prescient'],
    portraitFolder: 'oracle'
  },
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    role: 'Frontline Striker',
    description: 'Elite shock troops who lead the charge and break enemy lines.',
    playable: true,
    shadeAffinity: 'neutral',
    stats: { str: 4, thm: 2, rsv: 2, agi: 4 },
    startingAbility: { name: 'Charge', description: 'Rush forward, gaining momentum. Next attack deals +2 damage.', cost: 1 },
    gear: ['assault-rifle', 'combat-armor', 'tactical-visor'],
    traits: ['first-in'],
    portraitFolder: 'vanguard'
  },
  forger: {
    id: 'forger',
    name: 'Forger',
    role: 'Tech-Smith & Crafter',
    description: 'Master artificers who create impossible devices from salvage and will.',
    playable: false,
    unlockCondition: 'Complete Act 2 with Theorem ≥ 3',
    companionBonus: { passive: '+2 to technical challenges', active: 'Can craft temporary gear between encounters' },
    stats: { str: 2, thm: 5, rsv: 2, agi: 3 },
    shadeAffinity: 'grey',
    portraitFolder: 'forger'
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    role: 'Healer & Resonance Channeler',
    description: "Conduits of the Stratum's mysterious energy, bringing restoration and clarity.",
    playable: false,
    unlockCondition: 'Complete Act 2 with Resolve ≥ 3',
    companionBonus: { passive: '+2 to Shade resistance checks', active: 'Restore 4 Tonitrus between encounters' },
    stats: { str: 2, thm: 3, rsv: 5, agi: 2 },
    shadeAffinity: 'white',
    portraitFolder: 'cleric'
  }
};

const PLAYABLE_CLASSES = Object.values(CLASS_LIBRARY).filter(c => c.playable);

// =============================================================================
// SHADE SYSTEM
// =============================================================================

const SHADE_LABELS = {
  '-10': { name: 'Void', color: '#1a0a2a', description: 'Consumed by pragmatic ruthlessness' },
  '-7': { name: 'Shadow', color: '#2a1a3a', description: 'Ends justify means, always' },
  '-4': { name: 'Dusk', color: '#3a2a4a', description: 'Self-preservation first' },
  '-1': { name: 'Twilight', color: '#4a3a5a', description: 'Pragmatic with limits' },
  '0': { name: 'Grey', color: '#4a4a5a', description: 'Balance and context' },
  '1': { name: 'Dawn', color: '#5a4a6a', description: 'Principled flexibility' },
  '4': { name: 'Light', color: '#4a5a7a', description: 'Rules guide, rarely bend' },
  '7': { name: 'Radiant', color: '#3a6a8a', description: 'Principles over survival' },
  '10': { name: 'Luminous', color: '#2a7a9a', description: 'Idealism as compass' }
};

const getShadeInfo = (shade) => {
  const keys = Object.keys(SHADE_LABELS).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const key of keys) {
    if (shade >= key) closest = key;
  }
  return SHADE_LABELS[String(closest)];
};

// =============================================================================
// STRATUM SYNC CHALLENGE COMPONENT
// =============================================================================

function StratumSync({ challengeType, difficulty, characterStats, onComplete, label = 'SYNC CHALLENGE' }) {
  const [phase, setPhase] = useState('ready');
  const [pulsePosition, setPulsePosition] = useState(0);
  const [result, setResult] = useState(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const relevantStat = characterStats[challengeType] || 2;
  const ulterius = characterStats.ulterius || 10;
  const zoneWidth = 15 + (relevantStat * 5) + (ulterius * 1);
  const zoneStart = 50 - (zoneWidth / 2);
  const zoneEnd = 50 + (zoneWidth / 2);
  const perfectWidth = zoneWidth * 0.3;
  const perfectStart = 50 - (perfectWidth / 2);
  const perfectEnd = 50 + (perfectWidth / 2);
  const speed = 0.8 + (difficulty * 0.3) - ((characterStats.agi || 2) * 0.05);
  
  const startChallenge = () => {
    setPhase('active');
    setPulsePosition(0);
    startTimeRef.current = performance.now();
    animate();
  };
  
  const animate = () => {
    const elapsed = performance.now() - startTimeRef.current;
    const cycle = (elapsed * speed) % 200;
    const pos = cycle < 100 ? cycle : 200 - cycle;
    setPulsePosition(pos);
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const handleTap = () => {
    if (phase !== 'active') return;
    cancelAnimationFrame(animationRef.current);
    
    let outcome;
    if (pulsePosition >= perfectStart && pulsePosition <= perfectEnd) outcome = 'perfect';
    else if (pulsePosition >= zoneStart && pulsePosition <= zoneEnd) outcome = 'good';
    else if (pulsePosition >= zoneStart - 10 && pulsePosition <= zoneEnd + 10) outcome = 'partial';
    else outcome = 'miss';
    
    setResult(outcome);
    setPhase('result');
    setTimeout(() => onComplete(outcome), 1200);
  };
  
  useEffect(() => () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); }, []);
  
  const statLabels = { str: 'STRENGTH', thm: 'THEOREM', rsv: 'RESOLVE', agi: 'AGILITY' };
  
  return (
    <div className="sync-challenge">
      <div className="sync-header"><span className="sync-icon">◈</span><span>{label}</span></div>
      <div className="sync-info">
        <span className="sync-type">{statLabels[challengeType]} CHECK</span>
        <span className="sync-diff">Difficulty {difficulty}</span>
      </div>
      {phase === 'ready' && <button className="sync-start" onClick={startChallenge}>TAP TO BEGIN</button>}
      {phase === 'active' && (
        <div className="sync-track-container" onClick={handleTap}>
          <div className="sync-track">
            <div className="sync-zone partial-zone" style={{ left: `${zoneStart - 10}%`, width: `${zoneWidth + 20}%` }} />
            <div className="sync-zone good-zone" style={{ left: `${zoneStart}%`, width: `${zoneWidth}%` }} />
            <div className="sync-zone perfect-zone" style={{ left: `${perfectStart}%`, width: `${perfectWidth}%` }} />
            <div className="sync-pulse" style={{ left: `${pulsePosition}%` }} />
          </div>
          <div className="sync-instruction">TAP NOW</div>
        </div>
      )}
      {phase === 'result' && (
        <div className={`sync-result ${result}`}>
          {result === 'perfect' && '◆◆ PERFECT ◆◆'}
          {result === 'good' && '▰▰ SUCCESS ▰▰'}
          {result === 'partial' && '▱▱ PARTIAL ▱▱'}
          {result === 'miss' && '✕✕ MISS ✕✕'}
        </div>
      )}
      <div className="sync-stats">
        <span>{statLabels[challengeType]} {relevantStat}</span>
        <span>ULTERIUS {ulterius}</span>
        <span>ZONE {Math.round(zoneWidth)}%</span>
      </div>
    </div>
  );
}

// =============================================================================
// CHARACTER CREATOR
// =============================================================================

function CharacterCreator({ onComplete, onCancel }) {
  const [selectedClass, setSelectedClass] = useState('sentinel');
  const [name, setName] = useState('');
  const [portraitIndex, setPortraitIndex] = useState(1);
  
  const classData = CLASS_LIBRARY[selectedClass];
  const derived = calculateDerived(classData.stats.str, classData.stats.thm, classData.stats.rsv, classData.stats.agi);
  
  const handleCreate = () => {
    if (!name.trim()) return;
    onComplete({ name: name.trim(), classId: selectedClass, portraitIndex });
  };
  
  const getPortraitUrl = (classId, index) => {
    // Maps to: /character-images/{folder}/{prefix}{index}.jpg
    const folderMap = {
      sentinel: { folder: 'sentinel', prefix: 's' },
      voidStalker: { folder: 'stalker', prefix: 'st' },
      oracle: { folder: 'oracle', prefix: '0' },
      vanguard: { folder: 'vanguard', prefix: 'v' },
      forger: { folder: 'forger', prefix: 'f' },
      cleric: { folder: 'cleric', prefix: 'c' }
    };
    const mapping = folderMap[classId] || { folder: classId, prefix: '' };
    return `/character-images/${mapping.folder}/${mapping.prefix}${index}.jpg`;
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
            <img src={getPortraitUrl(selectedClass, portraitIndex)} alt={classData.name} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="portrait-selector">
            {[1, 2].map(idx => (
              <button key={idx} className={`portrait-btn ${portraitIndex === idx ? 'selected' : ''}`} onClick={() => setPortraitIndex(idx)}>{idx}</button>
            ))}
          </div>
          <div className="preview-stats">
            <div className="stratum-display"><span className="stratum-letter">S</span><span className="stratum-value">{classData.stats.str}</span></div>
            <div className="stratum-display"><span className="stratum-letter">T</span><span className="stratum-value">{classData.stats.thm}</span></div>
            <div className="stratum-display"><span className="stratum-letter">R</span><span className="stratum-value">{classData.stats.rsv}</span></div>
            <div className="stratum-display"><span className="stratum-letter">A</span><span className="stratum-value">{classData.stats.agi}</span></div>
          </div>
          <div className="preview-derived">
            <span>TON {derived.tonitrus}</span>
            <span>ULT {derived.ulterius}</span>
            <span>MAN {derived.mana}</span>
          </div>
        </div>
        <div className="options-panel">
          <div className="opt-section">SELECT CLASS</div>
          <div className="class-grid">
            {PLAYABLE_CLASSES.map(cls => (
              <button key={cls.id} className={`class-card ${selectedClass === cls.id ? 'selected' : ''}`} onClick={() => setSelectedClass(cls.id)}>
                <div className="class-name">{cls.name}</div>
                <div className="class-role">{cls.role}</div>
                <div className="class-shade"><span className={`shade-indicator ${cls.shadeAffinity}`} />{cls.shadeAffinity}</div>
              </button>
            ))}
          </div>
          <div className="opt-section">CLASS DETAILS</div>
          <div className="class-details">
            <p className="class-desc">{classData.description}</p>
            <div className="ability-box">
              <div className="ability-name">{classData.startingAbility.name}</div>
              <div className="ability-desc">{classData.startingAbility.description}</div>
            </div>
            <div className="stat-breakdown">
              {['str', 'thm', 'rsv', 'agi'].map(stat => (
                <div key={stat} className="stat-row">
                  <span className="stat-name">{stat === 'str' ? 'STRENGTH' : stat === 'thm' ? 'THEOREM' : stat === 'rsv' ? 'RESOLVE' : 'AGILITY'}</span>
                  <div className="stat-pips">{[1,2,3,4,5].map(i => <span key={i} className={`pip ${i <= classData.stats[stat] ? 'filled' : ''}`} />)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="creator-footer">
        <input type="text" placeholder="Enter operative name..." value={name} onChange={e => setName(e.target.value)} maxLength={24} />
        <button className="create-btn" onClick={handleCreate} disabled={!name.trim()}>INITIALIZE</button>
      </div>
    </div>
  );
}

// =============================================================================
// CHARACTER CARD
// =============================================================================

function CharacterCard({ character }) {
  const classData = CLASS_LIBRARY[character.classId];
  const shadeInfo = getShadeInfo(character.shade);
  const tonitrusPct = (character.tonitrus.current / character.tonitrus.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNext) * 100;
  const manaPct = (character.mana.current / character.mana.max) * 100;
  
  const getTonitrusColor = () => tonitrusPct > 60 ? 'var(--green)' : tonitrusPct > 30 ? 'var(--amber)' : 'var(--red)';
  
  return (
    <div className="character-card">
      <div className="card-header"><span className="card-brand">◇ GREY STRATUM</span><span className="card-version">v{character.version}</span></div>
      <div className="card-portrait">
        <img src={character.portraitUrl} alt={character.name} className="portrait-img" />
        <div className="portrait-overlay" />
      </div>
      <div className="card-identity">
        <h2 className="card-name">{character.name}</h2>
        <div className="card-class">{classData?.name || 'Unknown'}</div>
      </div>
      <div className="card-resources">
        <div className="resource-bar">
          <div className="resource-label"><span>TONITRUS</span><span>{character.tonitrus.current}/{character.tonitrus.max}</span></div>
          <div className="resource-track"><div className="resource-fill tonitrus" style={{ width: `${tonitrusPct}%`, backgroundColor: getTonitrusColor() }} /></div>
        </div>
        <div className="resource-bar">
          <div className="resource-label"><span>MANA</span><span>{character.mana.current}/{character.mana.max}</span></div>
          <div className="resource-track"><div className="resource-fill mana" style={{ width: `${manaPct}%` }} /></div>
        </div>
        <div className="resource-bar">
          <div className="resource-label"><span>XP</span><span>{character.xp.current}/{character.xp.toNext}</span></div>
          <div className="resource-track"><div className="resource-fill xp" style={{ width: `${xpPct}%` }} /></div>
        </div>
      </div>
      <div className="card-stratum">
        <div className="stratum-grid">
          {['str', 'thm', 'rsv', 'agi'].map(stat => (
            <div key={stat} className="stratum-stat">
              <span className="stratum-label">{stat.toUpperCase()}</span>
              <span className="stratum-value">{character.stats[stat]}</span>
            </div>
          ))}
        </div>
        <div className="derived-row"><span>ULT {character.ulterius}</span></div>
      </div>
      <div className="card-shade">
        <div className="shade-label">SHADE</div>
        <div className="shade-track">
          <div className="shade-markers"><span>-10</span><span>0</span><span>+10</span></div>
          <div className="shade-bar"><div className="shade-indicator" style={{ left: `${((character.shade + 10) / 20) * 100}%`, backgroundColor: shadeInfo.color }} /></div>
        </div>
        <div className="shade-name" style={{ color: shadeInfo.color }}>{shadeInfo.name}</div>
      </div>
      {character.traits.length > 0 && (
        <div className="card-traits">
          <div className="traits-label">TRAITS</div>
          <div className="traits-list">{character.traits.map((trait, i) => <span key={i} className="trait-badge">{trait}</span>)}</div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// QUEST DATA - THE DESCENT (Act 1)
// =============================================================================

const QUEST = {
  title: 'The Descent',
  act: 1,
  stratum: 'The Circuit',
  nodes: {
    'start': { type: 'narrative', location: 'THE CIRCUIT — TRADE GATE 7', text: `The elevator groans to a halt. Stale air rushes in—recycled a thousand times, carrying the scent of machine oil and desperation.\n\nYou step out into The Circuit. Merchant stalls crowd every surface, holographic prices flickering in a dozen languages. Above, the ceiling is lost in a haze of exhaust and neon.\n\nYour Shade implant pulses once. Acknowledgment. You've been exiled here, but not abandoned.\n\nA message waits in your neural queue: "Package at Relay Station 9. Payment on delivery. Don't open it."\n\nSimple enough. Nothing in The Circuit ever is.`, nextNodeId: 'circuit-hub' },
    'circuit-hub': { type: 'choice', location: 'THE CIRCUIT — CENTRAL BAZAAR', text: `Three paths lead from the bazaar toward Relay Station 9:\n\nThe Main Passage is crowded but direct. Merchants call out, security drones hover overhead.\n\nThe Service Tunnels run beneath the main level. Darker, quieter. Used by those who prefer not to be seen.\n\nThrough the Merchant Quarter means weaving through stall owners who remember faces and favors.`, choices: [
      { id: 'a', text: 'Take the Main Passage — direct and confident', nextNodeId: 'main-passage' },
      { id: 'b', text: 'Slip into the Service Tunnels', nextNodeId: 'service-tunnels' },
      { id: 'c', text: 'Navigate the Merchant Quarter', nextNodeId: 'merchant-quarter' }
    ]},
    'main-passage': { type: 'check', location: 'MAIN PASSAGE', text: `The crowd parts reluctantly as you move through. Halfway to the relay station, a security drone pivots toward you, running facial recognition.\n\nYour exile status will flag immediately unless you can project confidence—walk like you belong.`, checkType: 'rsv', difficulty: 2, successNodeId: 'main-clear', failureNodeId: 'main-detained', successXp: 15 },
    'main-clear': { type: 'narrative', text: `The drone's scanner washes over you—a moment of tension—then moves on. Whatever it saw, it decided you weren't worth the paperwork.\n\nYou reach Relay Station 9 without further incident.`, nextNodeId: 'relay-station' },
    'main-detained': { type: 'choice', text: `The drone chirps an alert. Two Circuit Wardens materialize from the crowd.\n\n"Shade-marked," one mutters. "What's your business in the main passage?"\n\nThey have authority to detain you—or let you go with the right incentive.`, choices: [
      { id: 'a', text: 'Bribe them with credits', nextNodeId: 'bribe-success', shadeShift: -1 },
      { id: 'b', text: 'Explain your legitimate errand', nextNodeId: 'explain-check' },
      { id: 'c', text: 'Attempt to slip away in the crowd', nextNodeId: 'escape-check' }
    ]},
    'explain-check': { type: 'check', text: `You need to read these Wardens—understand what will make them decide you're more trouble than you're worth.`, checkType: 'thm', difficulty: 3, successNodeId: 'explain-success', failureNodeId: 'detained-cell', successXp: 20 },
    'explain-success': { type: 'narrative', text: `"Courier run for Merchant Kova," you say, naming a mid-level trader. "Delay me, delay him, and he'll file a trade interference complaint."\n\nThey let you go. You reach Relay Station 9 by a side route.`, nextNodeId: 'relay-station' },
    'escape-check': { type: 'check', text: `A merchant cart wobbles nearby. If you time it right, you can vanish before they react.`, checkType: 'agi', difficulty: 3, successNodeId: 'escape-success', failureNodeId: 'detained-cell', successXp: 15 },
    'escape-success': { type: 'narrative', text: `You move with the crowd's rhythm—a step behind the cart, a pivot around a cluster of buyers, and you're gone.\n\nThey won't forget your face, but today isn't the day they catch you.`, shadeShift: -1, nextNodeId: 'relay-station' },
    'bribe-success': { type: 'narrative', text: `You palm the credits smoothly. The Wardens make them disappear faster.\n\n"Never saw you," one says. "Keep it that way."\n\nYou continue to Relay Station 9.`, nextNodeId: 'relay-station' },
    'detained-cell': { type: 'narrative', text: `The Wardens aren't gentle. A holding cell, four hours of waiting, and a fine deducted from your accounts.\n\nThey release you eventually. But you've lost time and dignity.`, damage: 2, nextNodeId: 'relay-station-late' },
    'service-tunnels': { type: 'check', location: 'SERVICE TUNNELS', text: `The tunnels are darker than you expected. Your Shade implant pings a warning: you're being followed.\n\nYou need to spot them before they corner you.`, checkType: 'thm', difficulty: 3, successNodeId: 'tunnel-aware', failureNodeId: 'tunnel-ambush', successXp: 20 },
    'tunnel-aware': { type: 'choice', text: `Three figures. Young, desperate, armed with pipe wrenches. Tunnel scavengers—they prey on anyone foolish enough to take this route alone.\n\nThey don't know you've spotted them.`, choices: [
      { id: 'a', text: 'Confront them directly', nextNodeId: 'confront-check' },
      { id: 'b', text: 'Set an ambush of your own', nextNodeId: 'counter-ambush' },
      { id: 'c', text: 'Find another route', nextNodeId: 'tunnel-avoid' }
    ]},
    'tunnel-ambush': { type: 'combat', text: `They come from three directions at once. Pipe wrenches swing for your head.\n\nTunnel scavengers. Desperate, hungry, and you're in their way.`, enemy: { name: 'Tunnel Scavengers', hp: 8, str: 2, agi: 2 }, victoryNodeId: 'tunnel-victory', defeatNodeId: 'tunnel-defeat', fleeNodeId: 'tunnel-flee', victoryXp: 30 },
    'confront-check': { type: 'check', text: `You step into the open junction. Arms loose, stance ready.\n\n"I see you. Come out and we talk, or come out and we don't."`, checkType: 'str', difficulty: 3, successNodeId: 'confront-success', failureNodeId: 'tunnel-ambush', successXp: 25 },
    'confront-success': { type: 'choice', text: `They emerge slowly. A scarred woman leads.\n\n"Shade-marked. What are you?"\n\n"Passing through."\n\nShe considers. "We need medicine. Help us get access, we let you pass and owe you a favor."`, choices: [
      { id: 'a', text: '"I\'ll see what I can do."', nextNodeId: 'promise-help', shadeShift: 1 },
      { id: 'b', text: '"Not my problem. But I won\'t report you."', nextNodeId: 'neutral-pass' },
      { id: 'c', text: '"Get out of my way."', nextNodeId: 'threaten-pass', shadeShift: -1 }
    ]},
    'promise-help': { type: 'narrative', text: `The scarred woman nods. "The Undercroft remembers its friends. Ask for Kira when you need passage."\n\nShe presses a worn token into your hand—symbol of the Tunnel Collective.`, rewards: [{ type: 'item', itemId: 'tunnel-token' }], nextNodeId: 'relay-station' },
    'neutral-pass': { type: 'narrative', text: `"Fair enough," Kira says. "You're not one of us, but you're not against us either. Pass."\n\nThey melt back into the shadows.`, nextNodeId: 'relay-station' },
    'threaten-pass': { type: 'narrative', text: `Kira's expression hardens, but she gestures her people back.\n\n"We'll remember you, Shade-marked. The tunnels have long memories."\n\nYou've made enemies today.`, nextNodeId: 'relay-station' },
    'counter-ambush': { type: 'check', text: `You double back through a maintenance shaft, positioning yourself above their ambush point.`, checkType: 'agi', difficulty: 4, successNodeId: 'counter-success', failureNodeId: 'tunnel-ambush', successXp: 30 },
    'counter-success': { type: 'choice', text: `They spring their trap and find nothing. You drop behind them.\n\n"Looking for someone?"\n\nThree terrified faces. You've turned hunters into prey.`, choices: [
      { id: 'a', text: 'Let them go with a warning', nextNodeId: 'merciful-release', shadeShift: 1 },
      { id: 'b', text: 'Demand their valuables as "toll"', nextNodeId: 'take-toll', shadeShift: -2 },
      { id: 'c', text: 'Just leave', nextNodeId: 'silent-leave' }
    ]},
    'merciful-release': { type: 'narrative', text: `"Go. Find honest work, if The Circuit has any left."\n\nThey scramble away. Your Shade implant pulses—a warm sensation.`, nextNodeId: 'relay-station' },
    'take-toll': { type: 'narrative', text: `"Empty your pockets. Consider it a lesson."\n\nThey comply, trembling. A handful of credits, a ration pack.`, rewards: [{ type: 'credits', amount: 35 }], nextNodeId: 'relay-station' },
    'silent-leave': { type: 'narrative', text: `You turn and walk away without another word. Sometimes that's the most unsettling thing you can do.`, nextNodeId: 'relay-station' },
    'tunnel-avoid': { type: 'narrative', text: `You find an access ladder and climb two levels. The scavengers never realize you were there.\n\nIt takes longer, but you arrive unscathed.`, nextNodeId: 'relay-station' },
    'tunnel-victory': { type: 'narrative', text: `They fall back, nursing wounds, and disappear into the darkness.\n\nYou're breathing hard, but you're standing.`, nextNodeId: 'relay-station' },
    'tunnel-defeat': { type: 'narrative', text: `You go down under their assault. When you wake, they've taken your credits.\n\nAt least they left you alive.`, damage: 4, nextNodeId: 'relay-station-late' },
    'tunnel-flee': { type: 'narrative', text: `You run. Faster than them, thankfully.\n\nPride wounded, body intact.`, nextNodeId: 'relay-station' },
    'merchant-quarter': { type: 'choice', location: 'MERCHANT QUARTER', text: `A tea vendor waves you over—she recognizes the look of someone new.\n\n"First time down here? Sit. Tell me what you're looking for."`, choices: [
      { id: 'a', text: 'Accept her hospitality and ask about Relay Station 9', nextNodeId: 'mei-info' },
      { id: 'b', text: 'Politely decline and continue', nextNodeId: 'decline-mei' },
      { id: 'c', text: 'Ask about Circuit politics', nextNodeId: 'mei-politics' }
    ]},
    'mei-info': { type: 'narrative', text: `The tea is bitter and strong. Mei listens.\n\n"Someone's using that relay as a dead drop. The Broker's people watch it. They skim from every package."\n\nShe draws a quick map. "Side entrance. Avoids their eyes."`, rewards: [{ type: 'item', itemId: 'relay-map' }], nextNodeId: 'relay-station-prepared' },
    'decline-mei': { type: 'narrative', text: `Mei shrugs, unoffended. "Your choice, young one. The Circuit teaches its lessons either way."\n\nYou navigate by instinct.`, nextNodeId: 'relay-station' },
    'mei-politics': { type: 'narrative', text: `Mei's eyes sharpen. "The Broker controls commerce. The Collective controls labor. The Wardens keep order, paid by both sides. Above them all, the Spire watches."\n\n"Pick your allegiances carefully."`, nextNodeId: 'relay-station' },
    'relay-station': { type: 'choice', location: 'RELAY STATION 9', text: `The station is cramped and dim. A bored attendant barely glances up.\n\n"Locker 7-C. Thumbprint."\n\nInside: a sealed case, palm-sized. Heavy. It hums faintly. Something inside is active.`, choices: [
      { id: 'a', text: 'Take it sealed—a job is a job', nextNodeId: 'take-sealed' },
      { id: 'b', text: 'Open it. You need to know.', nextNodeId: 'open-package', shadeShift: -1 },
      { id: 'c', text: 'Scan it with your implant first', nextNodeId: 'scan-package' }
    ]},
    'relay-station-prepared': { type: 'choice', location: 'RELAY STATION 9 — SIDE ENTRANCE', text: `Mei's map leads you past the Broker's watchers.\n\nLocker 7-C holds your prize: a sealed case, palm-sized. Heavy. It hums against your fingers.`, choices: [
      { id: 'a', text: 'Take it sealed', nextNodeId: 'take-sealed' },
      { id: 'b', text: 'Open it carefully', nextNodeId: 'open-package-careful' },
      { id: 'c', text: 'Scan it thoroughly', nextNodeId: 'scan-package-detailed' }
    ]},
    'relay-station-late': { type: 'narrative', location: 'RELAY STATION 9', text: `You arrive late, hurt, and conspicuous. The attendant notes your condition.\n\n"Your employer sent a message: 'Delays are... noted.'"\n\nYou take the package and go.`, nextNodeId: 'act1-end' },
    'take-sealed': { type: 'narrative', text: `Instructions exist for a reason. You pocket the case without investigating.\n\nSome questions are better left unanswered.`, nextNodeId: 'act1-end' },
    'open-package': { type: 'check', text: `The case has a biometric lock. You might be able to spoof full authorization.\n\nIf you fail, the case might alert someone.`, checkType: 'thm', difficulty: 4, successNodeId: 'package-opened', failureNodeId: 'package-alarm', successXp: 25 },
    'open-package-careful': { type: 'check', text: `With time and care, you examine the lock mechanism.`, checkType: 'thm', difficulty: 3, successNodeId: 'package-opened-clean', failureNodeId: 'package-opened-noted', successXp: 30 },
    'scan-package': { type: 'check', text: `Your Shade implant has limited scanning capability.`, checkType: 'thm', difficulty: 3, successNodeId: 'package-scanned', failureNodeId: 'scan-failed', successXp: 20 },
    'scan-package-detailed': { type: 'narrative', text: `Your thorough scan reveals: a data core, Spire-encrypted. Wrapped around it is something organic—living tissue, kept in stasis.\n\nA hybrid construct. Biological computing. Illegal in The Circuit, valuable beyond measure.\n\nYou're carrying something dangerous.`, rewards: [{ type: 'item', itemId: 'package-intel' }], nextNodeId: 'act1-end' },
    'package-opened': { type: 'narrative', text: `The case clicks open. Inside: a data core wrapped in living tissue. Biological computing.\n\nA chime sounds. The case has logged your access.\n\nTime to go.`, shadeShift: -1, nextNodeId: 'act1-end' },
    'package-opened-clean': { type: 'narrative', text: `The case opens without a trace. Inside: biological computing tech. Extremely illegal. Extremely valuable.\n\nYou reseal it perfectly. No one will ever know you looked.`, rewards: [{ type: 'item', itemId: 'package-intel' }], nextNodeId: 'act1-end' },
    'package-opened-noted': { type: 'narrative', text: `The case opens, revealing a biological data core.\n\nBut a small indicator light blinks once before you can reseal it.\n\nSomeone knows you looked.`, shadeShift: -1, nextNodeId: 'act1-end' },
    'package-scanned': { type: 'narrative', text: `Your implant returns fragmented data: biological signatures wrapped around a computational core.\n\nYou don't know exactly what it is, but you know it's dangerous.`, nextNodeId: 'act1-end' },
    'scan-failed': { type: 'narrative', text: `The case is shielded against scanning. Whatever's inside, someone went to great lengths to keep it hidden.`, nextNodeId: 'act1-end' },
    'package-alarm': { type: 'narrative', text: `The lock flashes red. An alarm—silent, but your implant picks up the transmission.\n\nSomeone knows you tried to open the package.\n\nYou grab it and move.`, shadeShift: -1, nextNodeId: 'act1-end-hot' },
    'act1-end': { type: 'outcome', location: 'THE CIRCUIT — TRANSIT PLATFORM', text: `You reach the transit platform. The package weighs heavy—not just mass, but implication.\n\nWhatever this is, it's more than a simple courier run. Your employer isn't just paying for delivery.\n\nThey're testing you.\n\nThe elevator descends. The Circuit fades. The Midway awaits.\n\nACT 1 COMPLETE`, outcome: 'victory', xpAwarded: 50 },
    'act1-end-hot': { type: 'outcome', location: 'THE CIRCUIT — TRANSIT PLATFORM', text: `You reach the transit platform with alarm signals echoing behind you.\n\nThe elevator descends faster than you'd like. Whatever happens next, you're committed now.\n\nACT 1 COMPLETE — COMPLICATIONS AHEAD`, outcome: 'victory', xpAwarded: 40 }
  }
};

// =============================================================================
// GAME LOGIC
// =============================================================================

const generateId = () => Math.random().toString(36).substr(2, 9);

function createCharacter(name, classId, portraitIndex) {
  const classData = CLASS_LIBRARY[classId];
  const derived = calculateDerived(classData.stats.str, classData.stats.thm, classData.stats.rsv, classData.stats.agi);
  const now = new Date().toISOString();
  // Maps to: /character-images/{folder}/{prefix}{index}.jpg
  const folderMap = {
    sentinel: { folder: 'sentinel', prefix: 's' },
    voidStalker: { folder: 'stalker', prefix: 'st' },
    oracle: { folder: 'oracle', prefix: '0' },
    vanguard: { folder: 'vanguard', prefix: 'v' },
    forger: { folder: 'forger', prefix: 'f' },
    cleric: { folder: 'cleric', prefix: 'c' }
  };
  const mapping = folderMap[classId] || { folder: classId, prefix: '' };
  const portraitUrl = `/character-images/${mapping.folder}/${mapping.prefix}${portraitIndex}.jpg`;
  
  return {
    id: generateId(), name, classId, version: '1.0', portraitUrl,
    stats: { ...classData.stats },
    tonitrus: { current: derived.tonitrus, max: derived.tonitrus },
    mana: { current: derived.mana, max: derived.mana },
    ulterius: derived.ulterius,
    shade: 0,
    xp: { current: 0, toNext: 100 },
    credits: 100,
    traits: [...classData.traits],
    inventory: classData.gear.map(g => ({ itemId: g, quantity: 1 })),
    companions: [],
    provenance: [{ id: generateId(), timestamp: now, version: '1.0', eventType: 'created', description: `Emerged in The Circuit as ${classData.name}` }],
    questsCompleted: 0, enemiesDefeated: 0
  };
}

// =============================================================================
// QUEST SCREEN
// =============================================================================

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('start');
  const [showSync, setShowSync] = useState(false);
  const [pendingCheck, setPendingCheck] = useState(null);
  const [sysOut, setSysOut] = useState(null);
  const [combat, setCombat] = useState(null);
  const [busy, setBusy] = useState(false);
  
  const node = QUEST.nodes[nodeId];
  
  const goTo = async (id, shadeShift = 0, damage = 0, rewards = []) => {
    setBusy(true);
    if (shadeShift !== 0) setCharacter(c => ({ ...c, shade: Math.max(-10, Math.min(10, c.shade + shadeShift)) }));
    if (damage > 0) setCharacter(c => ({ ...c, tonitrus: { ...c.tonitrus, current: Math.max(0, c.tonitrus.current - damage) } }));
    rewards.forEach(reward => {
      if (reward.type === 'item') setCharacter(c => ({ ...c, inventory: [...c.inventory, { itemId: reward.itemId, quantity: 1 }] }));
      if (reward.type === 'credits') setCharacter(c => ({ ...c, credits: c.credits + reward.amount }));
      if (reward.type === 'xp') setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + reward.amount } }));
    });
    await new Promise(r => setTimeout(r, 300));
    setNodeId(id);
    setSysOut(null);
    setCombat(null);
    setBusy(false);
  };
  
  const startCheck = (n) => { setPendingCheck(n); setShowSync(true); };
  
  const handleSyncComplete = async (result) => {
    setShowSync(false);
    const n = pendingCheck;
    setPendingCheck(null);
    setBusy(true);
    const success = result === 'perfect' || result === 'good';
    setSysOut({ checkType: n.checkType, difficulty: n.difficulty, result, success });
    if (success && n.successXp) {
      const xpBonus = result === 'perfect' ? Math.floor(n.successXp * 1.5) : n.successXp;
      setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + xpBonus } }));
    }
    await new Promise(r => setTimeout(r, 1500));
    goTo(success ? n.successNodeId : n.failureNodeId);
    setBusy(false);
  };
  
  const runCombat = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    let playerHP = character.tonitrus.current, enemyHP = n.enemy.hp;
    const rounds = [];
    while (playerHP > 0 && enemyHP > 0 && rounds.length < 8) {
      const playerRoll = Math.floor(Math.random() * 6) + 1;
      const playerDmg = Math.max(0, character.stats.str + playerRoll - 1);
      enemyHP -= playerDmg;
      let enemyDmg = 0;
      if (enemyHP > 0) {
        const enemyRoll = Math.floor(Math.random() * 6) + 1;
        enemyDmg = Math.max(0, n.enemy.str + enemyRoll - Math.floor(character.stats.agi / 2));
        playerHP -= enemyDmg;
      }
      rounds.push({ playerDmg, enemyDmg, playerHP, enemyHP });
    }
    const victory = enemyHP <= 0;
    setCombat({ enemy: n.enemy, rounds, victory, finalHP: playerHP });
    setCharacter(c => ({
      ...c,
      tonitrus: { ...c.tonitrus, current: Math.max(0, playerHP) },
      enemiesDefeated: victory ? c.enemiesDefeated + 1 : c.enemiesDefeated
    }));
    if (victory && n.victoryXp) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + n.victoryXp } }));
    setBusy(false);
  };
  
  const finishQuest = () => {
    if (node.xpAwarded) {
      setCharacter(c => ({
        ...c,
        xp: { ...c.xp, current: c.xp.current + node.xpAwarded },
        questsCompleted: node.outcome === 'victory' ? c.questsCompleted + 1 : c.questsCompleted,
        provenance: [...c.provenance, { id: generateId(), timestamp: new Date().toISOString(), version: c.version, eventType: 'quest_completed', description: `Completed: ${QUEST.title}` }]
      }));
    }
    onComplete(node.outcome, node.xpAwarded);
  };
  
  useEffect(() => {
    if (node?.type === 'check' && !sysOut && !showSync && !busy) startCheck(node);
    if (node?.type === 'combat' && !combat && !busy) runCombat(node);
  }, [nodeId, node?.type]);
  
  const hasItem = (id) => character.inventory.some(i => i.itemId === id);
  const hasCredits = (amount) => character.credits >= amount;
  const canChoose = (choice) => {
    if (!choice.requirement) return true;
    if (choice.requirement.itemId && !hasItem(choice.requirement.itemId)) return false;
    if (choice.requirement.credits && !hasCredits(choice.requirement.credits)) return false;
    return true;
  };
  
  return (
    <div className="game-layout">
      <aside className="sidebar"><CharacterCard character={character} /></aside>
      <main className="narrative">
        {showSync && pendingCheck && (
          <div className="sync-overlay">
            <StratumSync challengeType={pendingCheck.checkType} difficulty={pendingCheck.difficulty} characterStats={{ ...character.stats, ulterius: character.ulterius }} onComplete={handleSyncComplete} label={`${pendingCheck.checkType.toUpperCase()} CHECK`} />
          </div>
        )}
        {!showSync && (
          <>
            {node?.location && <div className="location">◆ {node.location}</div>}
            <div className="text">{node?.text}</div>
            {sysOut && (
              <div className="sys-out">
                <div className="sys-head">◈ STRATUM SYNC</div>
                <div>{sysOut.checkType.toUpperCase()} — Difficulty {sysOut.difficulty}</div>
                <div className={sysOut.success ? 'win' : 'lose'}>
                  {sysOut.result === 'perfect' && '◆◆ PERFECT ◆◆'}
                  {sysOut.result === 'good' && '▰▰ SUCCESS ▰▰'}
                  {sysOut.result === 'partial' && '▱▱ PARTIAL ▱▱'}
                  {sysOut.result === 'miss' && '✕✕ MISS ✕✕'}
                </div>
              </div>
            )}
            {combat && (
              <div className="sys-out">
                <div className="sys-head">⚔ COMBAT — {combat.enemy.name}</div>
                <div className="combat-log">{combat.rounds.map((r, i) => <div key={i}>Round {i + 1}: You deal {r.playerDmg} — Enemy deals {r.enemyDmg}</div>)}</div>
                <div className={combat.victory ? 'win' : 'lose'}>{combat.victory ? '▰▰ VICTORY ▰▰' : '✕✕ DEFEAT ✕✕'}</div>
              </div>
            )}
            <div className="choices">
              {node?.type === 'choice' && node.choices.map(choice => (
                <button key={choice.id} disabled={busy || !canChoose(choice)} onClick={() => goTo(choice.nextNodeId, choice.shadeShift || 0, 0, choice.rewards || [])}>
                  <span>[{choice.id.toUpperCase()}]</span>{choice.text}
                  {choice.shadeShift && <span className={`shade-shift ${choice.shadeShift > 0 ? 'light' : 'dark'}`}>{choice.shadeShift > 0 ? '◇' : '◆'}</span>}
                  {choice.requirement && !canChoose(choice) && <span className="req">🔒</span>}
                </button>
              ))}
              {node?.type === 'narrative' && <button disabled={busy} onClick={() => goTo(node.nextNodeId, node.shadeShift || 0, node.damage || 0, node.rewards || [])}>Continue...</button>}
              {node?.type === 'combat' && combat && !busy && (
                combat.victory ? <button onClick={() => goTo(node.victoryNodeId)}>Continue...</button> : (
                  <><button onClick={() => goTo(node.defeatNodeId)}>Accept defeat...</button>{node.fleeNodeId && <button onClick={() => goTo(node.fleeNodeId)}>Flee!</button>}</>
                )
              )}
              {node?.type === 'outcome' && <><div className="xp-award">+{node.xpAwarded} XP</div><button onClick={finishQuest}>Return to Hub</button></>}
            </div>
          </>
        )}
      </main>
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
    const saved = localStorage.getItem('grey-stratum-character');
    if (saved) try { setCharacter(JSON.parse(saved)); } catch (e) { console.error('Failed to load character:', e); }
  }, []);
  
  useEffect(() => { if (character) localStorage.setItem('grey-stratum-character', JSON.stringify(character)); }, [character]);
  
  const handleCreatorDone = (data) => { setCharacter(createCharacter(data.name, data.classId, data.portraitIndex)); setScreen('menu'); };
  const handleQuestDone = (result, xp) => { setOutcome({ result, xp }); setScreen('outcome'); };
  const classData = character ? CLASS_LIBRARY[character.classId] : null;
  
  return (
    <>
      <style>{appStyles}</style>
      <div className="app">
        <header><div className="brand">GREY STRATUM</div><div className="sub">THE DESCENT v0.1</div></header>
        {screen === 'menu' && (
          <div className="menu">
            <h1>GREY STRATUM</h1>
            <p className="tagline">What does humanity owe itself when survival is uncertain?</p>
            {character && (
              <div className="menu-card">
                <img src={character.portraitUrl} alt={character.name} onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="menu-card-info">
                  <b>{character.name}</b>
                  <span>{classData?.name} v{character.version}</span>
                  <span className="shade-display" style={{ color: getShadeInfo(character.shade).color }}>{getShadeInfo(character.shade).name}</span>
                </div>
              </div>
            )}
            <button onClick={() => setScreen('quest')} disabled={!character}>▸ BEGIN DESCENT</button>
            <button onClick={() => setScreen('create')}>▸ NEW OPERATIVE</button>
            {character && <button className="delete-btn" onClick={() => { if (confirm('Delete this operative?')) { localStorage.removeItem('grey-stratum-character'); setCharacter(null); } }}>✕ DELETE OPERATIVE</button>}
          </div>
        )}
        {screen === 'create' && <CharacterCreator onComplete={handleCreatorDone} onCancel={() => setScreen('menu')} />}
        {screen === 'quest' && character && <QuestScreen character={character} setCharacter={setCharacter} onComplete={handleQuestDone} />}
        {screen === 'outcome' && (
          <div className="outcome">
            <h1 className={outcome?.result}>{outcome?.result === 'victory' ? 'DESCENT COMPLETE' : 'DESCENT FAILED'}</h1>
            <div className="xp">+{outcome?.xp} XP</div>
            <button onClick={() => setScreen('menu')}>Return to Hub</button>
          </div>
        )}
        <footer><span>◉ STRATUM ONLINE</span><span>THE CIRCUIT</span></footer>
      </div>
    </>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const appStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@400;500;600&family=Share+Tech+Mono&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--panel:#12121a;--card:#1a1a25;--elevated:#222230;--border:#2a2a3a;--cyan:#00f0ff;--cyan-dim:#00a0aa;--amber:#ffaa00;--green:#00ff88;--red:#ff3366;--magenta:#ff00aa;--text:#c0c0d0;--text-dim:#606080;--text-muted:#404055}
body{background:var(--bg);color:var(--text);font-family:'Rajdhani',sans-serif;min-height:100vh}
.app{min-height:100vh;display:flex;flex-direction:column}
header{padding:.75rem 1.5rem;background:var(--panel);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Orbitron',sans-serif;font-size:1.1rem;color:var(--cyan);letter-spacing:.2em;text-shadow:0 0 20px rgba(0,240,255,.4)}
.sub{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim)}
footer{padding:.5rem 1.5rem;background:var(--panel);border-top:1px solid var(--border);display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--text-dim)}
footer span:first-child::before{content:'';display:inline-block;width:6px;height:6px;background:var(--green);border-radius:50%;margin-right:.4rem;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.menu{max-width:500px;margin:2rem auto;padding:2rem;text-align:center}
.menu h1{font-family:'Orbitron',sans-serif;font-size:2rem;color:var(--cyan);letter-spacing:.3em;margin-bottom:.5rem;text-shadow:0 0 30px rgba(0,240,255,.5)}
.tagline{font-size:.9rem;color:var(--text-dim);font-style:italic;margin-bottom:2rem}
.menu button{display:block;width:100%;padding:1rem;margin:.5rem 0;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--text);letter-spacing:.1em;cursor:pointer;transition:all .2s ease}
.menu button:hover:not(:disabled){border-color:var(--cyan);color:var(--cyan);transform:translateX(4px)}
.menu button:disabled{opacity:.4;cursor:not-allowed}
.menu .delete-btn{background:transparent;border-color:var(--red);color:var(--red);font-size:.7rem;padding:.6rem;margin-top:1rem}
.menu-card{display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--card);border:1px solid var(--border);border-radius:6px;margin-bottom:1.5rem;text-align:left}
.menu-card img{width:80px;height:100px;object-fit:cover;object-position:center;border-radius:4px;border:1px solid var(--border)}
.menu-card-info{display:flex;flex-direction:column;gap:.25rem}
.menu-card-info b{font-family:'Orbitron',sans-serif;font-size:1rem;color:#fff}
.menu-card-info span{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--text-dim)}
.shade-display{font-weight:600}
.outcome{max-width:500px;margin:3rem auto;padding:2rem;text-align:center}
.outcome h1{font-family:'Orbitron',sans-serif;font-size:1.4rem;letter-spacing:.2em;margin-bottom:1rem}
.outcome h1.victory{color:var(--green)}
.outcome h1.defeat{color:var(--red)}
.outcome .xp{font-family:'Share Tech Mono',monospace;font-size:1.2rem;color:var(--cyan);margin-bottom:2rem}
.outcome button{padding:.75rem 2rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:'Orbitron',sans-serif;cursor:pointer}
.creator{max-width:900px;margin:1rem auto;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.creator-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.creator-header h1{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan);letter-spacing:.15em}
.creator-header button{background:none;border:none;color:var(--text-dim);font-size:1.2rem;cursor:pointer}
.creator-body{display:grid;grid-template-columns:280px 1fr;gap:1px;background:var(--border)}
.preview-panel{background:var(--bg);padding:1.5rem;display:flex;flex-direction:column;align-items:center}
.preview-frame{width:220px;height:280px;background:#000;border:2px solid var(--border);border-radius:6px;overflow:hidden}
.preview-frame img{width:100%;height:100%;object-fit:cover;object-position:center}
.portrait-selector{display:flex;gap:.5rem;margin-top:.75rem}
.portrait-btn{width:32px;height:32px;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text-dim);font-family:'Share Tech Mono',monospace;cursor:pointer}
.portrait-btn.selected{border-color:var(--cyan);color:var(--cyan)}
.preview-stats{display:flex;gap:.75rem;margin-top:1rem}
.stratum-display{display:flex;flex-direction:column;align-items:center;background:var(--card);padding:.4rem .6rem;border-radius:4px;border:1px solid var(--border)}
.stratum-letter{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--cyan)}
.stratum-value{font-family:'Orbitron',sans-serif;font-size:1.2rem;color:#fff}
.preview-derived{display:flex;gap:1rem;margin-top:.75rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--amber)}
.options-panel{background:var(--panel);padding:1rem;overflow-y:auto;max-height:500px}
.opt-section{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--cyan);letter-spacing:.1em;margin:1rem 0 .75rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)}
.opt-section:first-child{margin-top:0}
.class-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem}
.class-card{padding:.75rem;background:var(--card);border:1px solid var(--border);border-radius:4px;cursor:pointer;text-align:left;transition:all .2s ease}
.class-card:hover{border-color:var(--cyan-dim)}
.class-card.selected{border-color:var(--cyan);background:var(--elevated)}
.class-name{font-family:'Orbitron',sans-serif;font-size:.8rem;color:#fff;margin-bottom:.25rem}
.class-role{font-size:.7rem;color:var(--text-dim);margin-bottom:.4rem}
.class-shade{display:flex;align-items:center;gap:.3rem;font-size:.6rem;color:var(--text-muted);text-transform:capitalize}
.shade-indicator{width:8px;height:8px;border-radius:50%}
.shade-indicator.white{background:#4a6a8a}
.shade-indicator.black{background:#3a2a4a}
.shade-indicator.grey{background:#4a4a5a}
.shade-indicator.neutral{background:#5a5a5a}
.class-details{margin-top:.5rem}
.class-desc{font-size:.85rem;color:var(--text);line-height:1.5;margin-bottom:.75rem}
.ability-box{background:var(--card);border:1px solid var(--border);border-left:3px solid var(--cyan);padding:.6rem;margin-bottom:.75rem}
.ability-name{font-family:'Orbitron',sans-serif;font-size:.7rem;color:var(--cyan);margin-bottom:.25rem}
.ability-desc{font-size:.75rem;color:var(--text-dim)}
.stat-breakdown{display:flex;flex-direction:column;gap:.4rem}
.stat-row{display:flex;justify-content:space-between;align-items:center}
.stat-name{font-family:'Share Tech Mono',monospace;font-size:.65rem;color:var(--text-dim)}
.stat-pips{display:flex;gap:3px}
.pip{width:12px;height:6px;background:var(--border);border-radius:2px}
.pip.filled{background:var(--cyan)}
.creator-footer{padding:.75rem 1rem;background:var(--card);border-top:1px solid var(--border);display:flex;gap:.75rem}
.creator-footer input{flex:1;padding:.7rem;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:#fff;font-size:.95rem;font-family:'Rajdhani',sans-serif}
.creator-footer input::placeholder{color:var(--text-dim)}
.create-btn{padding:.7rem 1.5rem;background:linear-gradient(90deg,var(--cyan-dim),var(--cyan));border:none;border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.75rem;color:var(--bg);cursor:pointer;letter-spacing:.1em}
.create-btn:disabled{opacity:.5;cursor:not-allowed}
.game-layout{flex:1;display:grid;grid-template-columns:300px 1fr;gap:1px;background:var(--border)}
.sidebar{background:var(--panel);padding:1rem;overflow-y:auto}
.character-card{background:var(--card);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.card-header{display:flex;justify-content:space-between;padding:.5rem .75rem;background:var(--elevated);border-bottom:1px solid var(--border)}
.card-brand{font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--cyan);letter-spacing:.1em}
.card-version{font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--amber);background:rgba(255,170,0,.1);padding:.1rem .3rem;border-radius:2px}
.card-portrait{position:relative;height:180px;overflow:hidden}
.portrait-img{width:100%;height:100%;object-fit:cover;object-position:center}
.portrait-overlay{position:absolute;inset:0;background:linear-gradient(transparent 60%,var(--card) 100%);pointer-events:none}
.card-identity{padding:.5rem .75rem;text-align:center;border-bottom:1px solid var(--border)}
.card-name{font-family:'Orbitron',sans-serif;font-size:.95rem;color:#fff;letter-spacing:.05em}
.card-class{font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--cyan-dim);text-transform:uppercase}
.card-resources{padding:.6rem .75rem;border-bottom:1px solid var(--border)}
.resource-bar{margin-bottom:.4rem}
.resource-bar:last-child{margin-bottom:0}
.resource-label{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--text-dim);margin-bottom:.15rem}
.resource-track{height:6px;background:var(--bg);border-radius:2px;overflow:hidden}
.resource-fill{height:100%;transition:width .3s ease}
.resource-fill.tonitrus{background:var(--green)}
.resource-fill.mana{background:var(--magenta)}
.resource-fill.xp{background:linear-gradient(90deg,var(--cyan-dim),var(--cyan))}
.card-stratum{padding:.6rem .75rem;border-bottom:1px solid var(--border)}
.stratum-grid{display:flex;justify-content:space-around}
.stratum-stat{text-align:center}
.stratum-label{display:block;font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--text-dim);letter-spacing:.1em}
.stratum-stat .stratum-value{display:block;font-family:'Orbitron',sans-serif;font-size:1.1rem;color:#fff}
.derived-row{display:flex;justify-content:center;margin-top:.4rem;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--amber)}
.card-shade{padding:.6rem .75rem;border-bottom:1px solid var(--border)}
.shade-label{font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--text-dim);letter-spacing:.1em;margin-bottom:.3rem}
.shade-track{margin-bottom:.3rem}
.shade-markers{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.5rem;color:var(--text-muted);margin-bottom:.15rem}
.shade-bar{height:8px;background:linear-gradient(90deg,#2a1a3a 0%,#4a4a5a 50%,#3a6a8a 100%);border-radius:4px;position:relative}
.shade-indicator{position:absolute;top:-2px;width:12px;height:12px;border-radius:50%;border:2px solid #fff;transform:translateX(-50%);box-shadow:0 0 8px rgba(0,0,0,.5)}
.shade-name{font-family:'Orbitron',sans-serif;font-size:.6rem;text-align:center;text-transform:uppercase;letter-spacing:.1em}
.card-traits{padding:.6rem .75rem}
.traits-label{font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--text-dim);letter-spacing:.1em;margin-bottom:.3rem}
.traits-list{display:flex;flex-wrap:wrap;gap:.3rem}
.trait-badge{font-family:'Share Tech Mono',monospace;font-size:.55rem;padding:.15rem .4rem;background:rgba(0,240,255,.1);border:1px solid var(--cyan-dim);border-radius:3px;color:var(--cyan)}
.narrative{background:var(--panel);padding:1.5rem;overflow-y:auto;position:relative}
.location{font-family:'Orbitron',sans-serif;font-size:.7rem;color:var(--amber);letter-spacing:.2em;margin-bottom:1rem}
.text{font-size:1rem;line-height:1.8;white-space:pre-wrap;max-width:650px}
.sys-out{background:var(--bg);border:1px solid var(--border);border-left:3px solid var(--cyan);padding:.75rem;margin:1rem 0;font-family:'Share Tech Mono',monospace;font-size:.75rem;max-width:450px}
.sys-head{color:var(--cyan);margin-bottom:.5rem;font-size:.65rem;letter-spacing:.1em}
.sys-out .win{color:var(--green);margin-top:.5rem;font-weight:bold}
.sys-out .lose{color:var(--red);margin-top:.5rem;font-weight:bold}
.combat-log{max-height:120px;overflow-y:auto;margin:.5rem 0;font-size:.65rem;color:var(--text-dim)}
.choices{margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1rem}
.choices button{display:flex;align-items:center;gap:.6rem;width:100%;padding:.65rem .8rem;margin-bottom:.4rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:.85rem;cursor:pointer;text-align:left;transition:all .2s ease}
.choices button:hover:not(:disabled){background:var(--elevated);border-color:var(--cyan);transform:translateX(3px)}
.choices button:disabled{opacity:.4;cursor:not-allowed}
.choices button span:first-child{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.choices .req{color:var(--amber);font-size:.7rem}
.choices .shade-shift{margin-left:auto;font-size:.8rem}
.choices .shade-shift.light{color:#3a6a8a}
.choices .shade-shift.dark{color:#3a2a4a}
.choices .xp-award{color:var(--cyan);font-family:'Share Tech Mono',monospace;margin-bottom:.5rem}
.sync-overlay{position:absolute;inset:0;background:rgba(10,10,15,.95);display:flex;align-items:center;justify-content:center;z-index:100}
.sync-challenge{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1.5rem;width:100%;max-width:400px}
.sync-header{display:flex;align-items:center;gap:.5rem;font-family:'Orbitron',sans-serif;font-size:.75rem;color:var(--cyan);letter-spacing:.1em;margin-bottom:1rem}
.sync-icon{animation:blink 1s step-end infinite}
@keyframes blink{50%{opacity:0}}
.sync-info{display:flex;justify-content:space-between;margin-bottom:1rem}
.sync-type{font-family:'Share Tech Mono',monospace;font-size:.8rem;color:var(--text)}
.sync-diff{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--amber)}
.sync-start{width:100%;padding:1rem;background:var(--elevated);border:2px solid var(--cyan);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan);cursor:pointer;transition:all .2s ease}
.sync-start:hover{background:rgba(0,240,255,.1)}
.sync-track-container{cursor:pointer;padding:1rem 0}
.sync-track{position:relative;height:40px;background:var(--bg);border-radius:4px;overflow:hidden}
.sync-zone{position:absolute;top:0;height:100%}
.partial-zone{background:rgba(255,170,0,.15)}
.good-zone{background:rgba(0,255,136,.2)}
.perfect-zone{background:rgba(0,240,255,.3)}
.sync-pulse{position:absolute;top:50%;width:4px;height:30px;background:#fff;border-radius:2px;transform:translate(-50%,-50%);box-shadow:0 0 10px #fff}
.sync-instruction{text-align:center;margin-top:.75rem;font-family:'Orbitron',sans-serif;font-size:.8rem;color:var(--text);animation:pulse 1s ease-in-out infinite}
.sync-result{text-align:center;padding:1.5rem;font-family:'Orbitron',sans-serif;font-size:1.1rem;letter-spacing:.15em}
.sync-result.perfect{color:var(--cyan)}
.sync-result.good{color:var(--green)}
.sync-result.partial{color:var(--amber)}
.sync-result.miss{color:var(--red)}
.sync-stats{display:flex;justify-content:space-around;margin-top:1rem;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--text-dim)}
@media(max-width:768px){.creator-body,.game-layout{grid-template-columns:1fr}.sidebar{display:none}}
`;
