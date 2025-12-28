import React, { useState, useEffect } from 'react';

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
const CharacterCard = ({ character, onProvenanceClick }) => {
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

// System Output Component (for dice rolls / checks)
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
const GameUI = () => {
  const [character, setCharacter] = useState(sampleCharacter);
  const [narrative, setNarrative] = useState(sampleNarrative);
  const [systemOutput, setSystemOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  
  const handleChoice = async (choice) => {
    setIsProcessing(true);
    setSystemOutput(null);
    
    // Add to game log
    setGameLog(prev => [...prev, { type: 'choice', text: choice.text }]);
    
    // If choice has a check, simulate the roll
    if (choice.check) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
          <span className="status-indicator online" />
          SYSTEM ONLINE
        </div>
        <div className="footer-coords">SECTOR 7 — 42.8°N 127.3°E</div>
      </footer>
    </div>
  );
};

export default GameUI;
