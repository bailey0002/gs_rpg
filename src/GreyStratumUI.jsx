import React, { useState } from 'react';

// Sample character data
const sampleCharacter = {
  name: "Deaty Horga",
  class: "Space Knight",
  version: "1.1",
  hp: { current: 8, max: 10 },
  xp: { current: 45, max: 250 },
  stats: { phy: 4, int: 3, def: 2 },
  traits: ["Combat Reflexes"],
  gear: ["Pulse Blade", "Flex Armor"],
  provenance: [
    { version: "1.0", event: "Created — Station Omega", date: "2185.03.12" },
    { version: "1.1", event: "Evolved — Survived Deck 7 Breach", date: "2185.04.28" }
  ]
};

// Sample narrative content
const sampleNarrative = {
  location: "SECTOR 7 — ABANDONED RESEARCH STATION",
  text: `The airlock hisses open, releasing a breath of stale, recycled air that hasn't circulated in decades. Emergency lighting flickers amber along the corridor ahead, casting long shadows that seem to shift when you're not looking directly at them.

Your suit's scanner picks up faint power signatures deeper in the station—something is still running on backup systems. The main corridor stretches forward into darkness, but a maintenance shaft to your left shows signs of recent use: fresh scrape marks on the access panel.

Somewhere in the distance, metal groans against metal. The station is settling, or something is moving.`,
  choices: [
    { id: 'a', text: 'Proceed down the main corridor, weapon ready', check: { type: 'PHY', difficulty: 4 } },
    { id: 'b', text: 'Investigate the maintenance shaft', check: { type: 'INT', difficulty: 3 } },
    { id: 'c', text: 'Scan for life signs before proceeding', check: { type: 'INT', difficulty: 5 } },
    { id: 'd', text: 'Return to your ship — this feels wrong', check: null }
  ]
};

// Styles object
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

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
  --text-bright: #ffffff;
  --text-normal: #c0c0d0;
  --text-dim: #606080;
  --text-muted: #404055;
  --border-subtle: #2a2a3a;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.game-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: var(--bg-deep);
  color: var(--text-normal);
  font-family: var(--font-body);
}

.ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.2), transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.3), transparent);
  background-size: 200px 200px;
  animation: twinkle 8s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.nebula {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 100, 150, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(100, 0, 100, 0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 60% 80%, rgba(0, 80, 100, 0.08) 0%, transparent 50%);
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
}

.game-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.9) 100%);
  border-bottom: 1px solid var(--border-subtle);
}

.header-brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--cyan);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

.header-subtitle {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  font-family: var(--font-display);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  border-color: var(--cyan-dim);
  color: var(--cyan);
  background: rgba(0, 240, 255, 0.05);
}

.game-main {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr 240px;
  gap: 1px;
  background: var(--border-subtle);
  position: relative;
  z-index: 5;
  overflow: hidden;
}

.card-panel {
  background: var(--bg-panel);
  padding: 1rem;
  overflow-y: auto;
}

.character-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.character-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 1px;
  background: linear-gradient(135deg, var(--cyan-dim), transparent 50%, var(--magenta));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  pointer-events: none;
  opacity: 0.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.card-brand {
  font-family: var(--font-display);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--cyan);
}

.card-version {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--amber);
  background: rgba(255, 170, 0, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}

.card-portrait {
  position: relative;
  height: 180px;
  background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-card) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.portrait-placeholder {
  position: relative;
  width: 120px;
  height: 140px;
}

.portrait-silhouette {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--cyan-dim) 0%, var(--magenta) 100%);
  clip-path: polygon(50% 0%, 85% 15%, 90% 45%, 75% 100%, 25% 100%, 10% 45%, 15% 15%);
  opacity: 0.6;
}

.portrait-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.2) 0%, transparent 60%);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.portrait-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
}

.card-info {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid var(--border-subtle);
}

.card-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-bright);
  margin-bottom: 0.2rem;
}

.card-class {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--cyan-dim);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.card-stats-section {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.stat-bar {
  margin-bottom: 0.6rem;
}

.stat-bar-label {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-dim);
  margin-bottom: 0.25rem;
  letter-spacing: 0.1em;
}

.stat-bar-track {
  height: 8px;
  background: var(--bg-deep);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  position: relative;
}

.hp-fill { background: var(--green); }
.xp-fill { background: linear-gradient(90deg, var(--cyan-dim), var(--cyan)); }

.stat-bar-segments {
  position: absolute;
  inset: 0;
  display: flex;
}

.segment {
  flex: 1;
  border-right: 1px solid var(--bg-card);
}

.segment:last-child { border-right: none; }

.core-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 0.75rem;
}

.stat { text-align: center; }

.stat-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  margin-bottom: 0.2rem;
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-bright);
}

.card-traits, .card-gear {
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid var(--border-subtle);
}

.traits-label, .gear-label {
  font-family: var(--font-display);
  font-size: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  margin-bottom: 0.4rem;
}

.traits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.trait-badge {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--cyan-dim);
  border-radius: 3px;
  color: var(--cyan);
}

.trait-badge.empty {
  background: transparent;
  border-color: var(--border-subtle);
  color: var(--text-muted);
}

.gear-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.gear-item {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-normal);
  padding-left: 0.6rem;
  position: relative;
}

.gear-item::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--amber);
  font-size: 0.6rem;
}

.provenance-toggle {
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: transparent;
  border: none;
  font-family: var(--font-display);
  font-size: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.provenance-toggle:hover {
  background: rgba(0, 240, 255, 0.05);
  color: var(--cyan);
}

.provenance-log {
  padding: 0 0.8rem 0.8rem;
  border-top: 1px solid var(--border-subtle);
}

.provenance-entry {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.4rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.6rem;
}

.provenance-entry:last-child { border-bottom: none; }

.prov-version {
  font-family: var(--font-mono);
  color: var(--amber);
}

.prov-event { color: var(--text-normal); }

.prov-date {
  font-family: var(--font-mono);
  color: var(--text-dim);
}

.narrative-section {
  background: var(--bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.narrative-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
}

.narrative-location {
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  color: var(--amber);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-marker { font-size: 0.55rem; }

.narrative-text {
  flex: 1;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75;
  color: var(--text-normal);
  max-width: 650px;
}

.narrative-text p {
  margin-bottom: 1rem;
}

.system-output {
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-left: 3px solid var(--cyan);
  padding: 0.875rem 1rem;
  margin: 1.25rem 0;
  font-family: var(--font-mono);
  max-width: 450px;
}

.system-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--cyan);
  margin-bottom: 0.75rem;
}

.system-icon {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.check-type {
  font-size: 0.7rem;
  color: var(--text-bright);
  margin-bottom: 0.4rem;
}

.check-calculation {
  font-size: 0.65rem;
  color: var(--text-dim);
  margin-bottom: 0.6rem;
}

.check-progress { margin-bottom: 0.6rem; }

.progress-bar {
  height: 6px;
  background: var(--bg-card);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.progress-fill.success { background: var(--green); }
.progress-fill.failure { background: var(--red); }

.check-result {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.check-result.success { color: var(--green); }
.check-result.failure { color: var(--red); }

.choices-section {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-subtle);
}

.choices-header {
  font-family: var(--font-display);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.choice-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.7rem 0.875rem;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.choice-button:hover:not(:disabled) {
  background: var(--bg-elevated);
  border-color: var(--cyan-dim);
  transform: translateX(4px);
}

.choice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.choice-key {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--cyan);
  flex-shrink: 0;
}

.choice-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-normal);
  flex: 1;
}

.choice-check {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--amber);
  background: rgba(255, 170, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  flex-shrink: 0;
}

.log-panel {
  background: var(--bg-panel);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.log-header {
  font-family: var(--font-display);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 0.75rem;
}

.log-entries {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.log-entry {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-dim);
  padding: 0.4rem;
  background: var(--bg-card);
  border-radius: 3px;
  display: flex;
  gap: 0.4rem;
  line-height: 1.4;
}

.log-marker { color: var(--cyan-dim); }

.log-entry.check .log-marker { color: var(--amber); }

.log-entry.failure { border-left: 2px solid var(--red); }

.log-empty {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  font-style: italic;
}

.game-footer {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background: var(--bg-panel);
  border-top: 1px solid var(--border-subtle);
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

.status-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.footer-coords {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--cyan-dim); }
`;

// HP Bar Component
const HPBar = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const getColor = () => {
    if (percentage > 60) return '#00ff88';
    if (percentage > 30) return '#ffaa00';
    return '#ff3366';
  };
  
  return (
    <div className="stat-bar">
      <div className="stat-bar-label">
        <span>HP</span>
        <span>{current}/{max}</span>
      </div>
      <div className="stat-bar-track">
        <div 
          className="stat-bar-fill hp-fill" 
          style={{ width: `${percentage}%`, backgroundColor: getColor() }}
        />
        <div className="stat-bar-segments">
          {[...Array(max)].map((_, i) => (
            <div key={i} className="segment" />
          ))}
        </div>
      </div>
    </div>
  );
};

// XP Bar Component
const XPBar = ({ current, max }) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="stat-bar xp-bar">
      <div className="stat-bar-label">
        <span>XP</span>
        <span>{current}/{max}</span>
      </div>
      <div className="stat-bar-track">
        <div 
          className="stat-bar-fill xp-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Character Card Component
const CharacterCard = ({ character }) => {
  const [showProvenance, setShowProvenance] = useState(false);
  
  return (
    <div className="character-card">
      <div className="card-header">
        <div className="card-brand">◇ GREY STRATUM</div>
        <div className="card-version">v{character.version}</div>
      </div>
      
      <div className="card-portrait">
        <div className="portrait-placeholder">
          <div className="portrait-silhouette" />
          <div className="portrait-glow" />
        </div>
        <div className="portrait-scanlines" />
      </div>
      
      <div className="card-info">
        <h2 className="card-name">{character.name}</h2>
        <div className="card-class">{character.class}</div>
      </div>
      
      <div className="card-stats-section">
        <HPBar current={character.hp.current} max={character.hp.max} />
        <XPBar current={character.xp.current} max={character.xp.max} />
        
        <div className="core-stats">
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
      </div>
      
      <div className="card-traits">
        <div className="traits-label">TRAITS</div>
        <div className="traits-list">
          {character.traits.map((trait, i) => (
            <span key={i} className="trait-badge">{trait}</span>
          ))}
          {character.traits.length < 3 && (
            <span className="trait-badge empty">—</span>
          )}
        </div>
      </div>
      
      <div className="card-gear">
        <div className="gear-label">GEAR</div>
        <div className="gear-list">
          {character.gear.map((item, i) => (
            <span key={i} className="gear-item">{item}</span>
          ))}
        </div>
      </div>
      
      <button 
        className="provenance-toggle"
        onClick={() => setShowProvenance(!showProvenance)}
      >
        {showProvenance ? '▼ PROVENANCE' : '▶ PROVENANCE'}
      </button>
      
      {showProvenance && (
        <div className="provenance-log">
          {character.provenance.map((entry, i) => (
            <div key={i} className="provenance-entry">
              <span className="prov-version">v{entry.version}</span>
              <span className="prov-event">{entry.event}</span>
              <span className="prov-date">{entry.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// System Output Component
const SystemOutput = ({ output }) => {
  if (!output) return null;
  
  return (
    <div className="system-output">
      <div className="system-header">
        <span className="system-icon">◈</span>
        <span>SYSTEM OUTPUT</span>
      </div>
      <div className="system-content">
        {output.type === 'check' && (
          <>
            <div className="check-type">{output.checkType} CHECK — Difficulty {output.difficulty}</div>
            <div className="check-calculation">
              Base {output.stat} + Roll {output.roll} = {output.total} vs {output.target}
            </div>
            <div className="check-progress">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${output.success ? 'success' : 'failure'}`}
                  style={{ width: `${Math.min((output.total / output.target) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className={`check-result ${output.success ? 'success' : 'failure'}`}>
              {output.success ? '██ SUCCESS ██' : '░░ FAILURE ░░'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Narrative Panel Component
const NarrativePanel = ({ narrative, onChoice, systemOutput, isProcessing }) => {
  return (
    <div className="narrative-panel">
      <div className="narrative-location">
        <span className="location-marker">◆</span>
        {narrative.location}
      </div>
      
      <div className="narrative-text">
        {narrative.text.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      
      <SystemOutput output={systemOutput} />
      
      <div className="choices-section">
        <div className="choices-header">ACTIONS</div>
        <div className="choices-list">
          {narrative.choices.map((choice) => (
            <button
              key={choice.id}
              className="choice-button"
              onClick={() => onChoice(choice)}
              disabled={isProcessing}
            >
              <span className="choice-key">[{choice.id.toUpperCase()}]</span>
              <span className="choice-text">{choice.text}</span>
              {choice.check && (
                <span className="choice-check">
                  {choice.check.type} {choice.check.difficulty}+
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Game UI Component
export default function GameUI() {
  const [character, setCharacter] = useState(sampleCharacter);
  const [narrative, setNarrative] = useState(sampleNarrative);
  const [systemOutput, setSystemOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  
  const handleChoice = async (choice) => {
    setIsProcessing(true);
    setSystemOutput(null);
    
    setGameLog(prev => [...prev, { type: 'choice', text: choice.text }]);
    
    if (choice.check) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stat = character.stats[choice.check.type.toLowerCase()];
      const roll = Math.floor(Math.random() * 6) + 1;
      const total = stat + roll;
      const target = choice.check.difficulty + 6;
      const success = total >= target;
      
      setSystemOutput({
        type: 'check',
        checkType: choice.check.type,
        difficulty: choice.check.difficulty,
        stat,
        roll,
        total,
        target,
        success
      });
      
      setGameLog(prev => [...prev, { 
        type: 'check', 
        success, 
        text: `${choice.check.type} check: ${total} vs ${target} — ${success ? 'SUCCESS' : 'FAILURE'}` 
      }]);
    }
    
    setIsProcessing(false);
  };
  
  return (
    <>
      <style>{styles}</style>
      <div className="game-container">
        <div className="ambient-bg">
          <div className="stars" />
          <div className="nebula" />
          <div className="grid-overlay" />
        </div>
        
        <header className="game-header">
          <div className="header-brand">GREY STRATUM</div>
          <div className="header-subtitle">TERMINAL v2.1.85</div>
          <div className="header-actions">
            <button className="header-btn">INVENTORY</button>
            <button className="header-btn">SAVE</button>
            <button className="header-btn">MENU</button>
          </div>
        </header>
        
        <main className="game-main">
          <aside className="card-panel">
            <CharacterCard character={character} />
          </aside>
          
          <section className="narrative-section">
            <NarrativePanel 
              narrative={narrative}
              onChoice={handleChoice}
              systemOutput={systemOutput}
              isProcessing={isProcessing}
            />
          </section>
          
          <aside className="log-panel">
            <div className="log-header">MISSION LOG</div>
            <div className="log-entries">
              {gameLog.map((entry, i) => (
                <div key={i} className={`log-entry ${entry.type} ${entry.success === false ? 'failure' : ''}`}>
                  <span className="log-marker">▸</span>
                  {entry.text}
                </div>
              ))}
              {gameLog.length === 0 && (
                <div className="log-empty">Awaiting input...</div>
              )}
            </div>
          </aside>
        </main>
        
        <footer className="game-footer">
          <div className="footer-status">
            <span className="status-indicator" />
            SYSTEM ONLINE
          </div>
          <div className="footer-coords">SECTOR 7 — 42.8°N 127.3°E</div>
        </footer>
      </div>
    </>
  );
}
