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
    <div className="card">
      <div className="card-top">
        <span>◇ GREY STRATUM</span>
        <span>v{character.version || '1.0'}</span>
      </div>
      
      {/* Portrait */}
      {!imageError && character.portraitPath ? (
        <img 
          className="portrait" 
          src={character.portraitPath} 
          alt={character.name}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="portrait-placeholder">?</div>
      )}
      
      {/* Name & Class */}
      <div className="card-name">{character.name}</div>
      <div className="card-class">{character.className} • {character.role}</div>
      
      {/* Bars */}
      <div className="bars">
        {/* HP Bar */}
        <div className="bar">
          <span>HP</span>
          <span>{character.hp}/{character.maxHp}</span>
        </div>
        <div className="bar-track">
          <div 
            className="bar-fill hp" 
            style={{ width: `${hpPercent}%`, backgroundColor: getHpColor() }} 
          />
        </div>
        
        {/* Mana Bar (if character has mana) */}
        {character.maxMana > 0 && (
          <>
            <div className="bar">
              <span>MANA</span>
              <span>{character.mana}/{character.maxMana}</span>
            </div>
            <div className="bar-track">
              <div 
                className="bar-fill mana" 
                style={{ width: `${manaPercent}%` }} 
              />
            </div>
          </>
        )}
        
        {/* XP Bar */}
        <div className="bar">
          <span>XP</span>
          <span>{character.xp || 0}/100</span>
        </div>
        <div className="bar-track">
          <div 
            className="bar-fill xp" 
            style={{ width: `${(character.xp || 0)}%` }} 
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="stats-row">
        <div>
          <span>PHY</span>
          <b>{character.stats?.phy || 0}</b>
        </div>
        <div>
          <span>INT</span>
          <b>{character.stats?.int || 0}</b>
        </div>
        <div>
          <span>DEF</span>
          <b>{character.stats?.def || 0}</b>
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
