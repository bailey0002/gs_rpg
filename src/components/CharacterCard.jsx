// =============================================================================
// GREY STRATUM — CHARACTER CARD
// /src/components/CharacterCard.jsx
// =============================================================================
// Displays the character card in the game sidebar.

import React, { useState } from 'react';

const CharacterCard = ({ character, shade = 0 }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!character) return null;

  const hpPercent = (character.hp / character.maxHp) * 100;
  const manaPercent = character.mana ? (character.mana / character.maxMana) * 100 : 0;
  
  const getHpColor = () => {
    if (hpPercent > 60) return 'var(--green)';
    if (hpPercent > 30) return 'var(--amber)';
    return 'var(--red)';
  };

  return (
    <div className="character-card" data-name={character.name}>
      <div className="card-header">
        <div className="card-brand">◇ GREY STRATUM</div>
        <div className="card-version">v{character.version || '1.0'}</div>
      </div>
      
      {/* Portrait */}
      <div className="card-portrait">
        {!imageError && character.portraitPath ? (
          <img 
            src={character.portraitPath} 
            alt={character.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="portrait-placeholder">
            <span>?</span>
          </div>
        )}
        <div className="portrait-scanlines" />
      </div>
      
      {/* Mobile Stats - shown via CSS on small screens */}
      <div className="mobile-stats">
        <span className="hp">HP {character.hp}/{character.maxHp}</span>
        {character.maxMana > 0 && <span className="mana">MP {character.mana}/{character.maxMana}</span>}
      </div>
      
      {/* Name & Class */}
      <div className="card-info">
        <h2 className="card-name">{character.name}</h2>
        <div className="card-class">{character.className} • {character.role}</div>
      </div>
      
      {/* Stats Section */}
      <div className="card-stats-section">
        {/* HP Bar */}
        <div className="stat-bar">
          <div className="stat-bar-label">
            <span>HP</span>
            <span>{character.hp}/{character.maxHp}</span>
          </div>
          <div className="stat-bar-track">
            <div 
              className="stat-bar-fill hp-fill" 
              style={{ width: `${hpPercent}%`, backgroundColor: getHpColor() }} 
            />
          </div>
        </div>
        
        {/* Mana Bar (if character has mana) */}
        {character.maxMana > 0 && (
          <div className="stat-bar">
            <div className="stat-bar-label">
              <span>MANA</span>
              <span>{character.mana}/{character.maxMana}</span>
            </div>
            <div className="stat-bar-track">
              <div 
                className="stat-bar-fill mana-fill" 
                style={{ width: `${manaPercent}%` }} 
              />
            </div>
          </div>
        )}
        
        {/* XP Bar */}
        <div className="stat-bar">
          <div className="stat-bar-label">
            <span>XP</span>
            <span>{character.xp || 0}/100</span>
          </div>
          <div className="stat-bar-track">
            <div 
              className="stat-bar-fill xp-fill" 
              style={{ width: `${(character.xp || 0)}%` }} 
            />
          </div>
        </div>
        
        {/* Core Stats */}
        <div className="core-stats">
          <div className="stat">
            <span className="stat-label">PHY</span>
            <span className="stat-value">{character.stats?.phy || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">INT</span>
            <span className="stat-value">{character.stats?.int || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">DEF</span>
            <span className="stat-value">{character.stats?.def || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Shade Indicator (mini) */}
      <div className="shade-mini">
        <span className="shade-label">SHADE</span>
        <div className="shade-track-mini">
          <div 
            className="shade-marker-mini"
            style={{ left: `${((shade + 10) / 20) * 100}%` }}
          />
        </div>
        <span className="shade-value">{shade > 0 ? '+' : ''}{shade}</span>
      </div>
    </div>
  );
};

export default CharacterCard;
