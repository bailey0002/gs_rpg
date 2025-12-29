// =============================================================================
// GREY STRATUM — NARRATIVE PANEL
// /src/components/NarrativePanel.jsx
// =============================================================================
// Displays story text, visible items, and choice buttons.

import React from 'react';

const NarrativePanel = ({ 
  node, 
  gameState, 
  onChoice, 
  onExamine, 
  systemOutput,
  commandResponse,
  isProcessing 
}) => {
  if (!node) {
    return (
      <div className="narrative">
        <div className="text">Loading...</div>
      </div>
    );
  }

  // Check if a choice is available to the player
  const isChoiceAvailable = (choice) => {
    // Class requirement
    if (choice.classRequired && gameState.character?.classId !== choice.classRequired) {
      return false;
    }
    
    // Stat requirement
    if (choice.requirement?.stat) {
      const statValue = gameState.character?.stats?.[choice.requirement.stat] || 0;
      if (statValue < choice.requirement.min) {
        if (!choice.requirement.orClass || gameState.character?.classId !== choice.requirement.orClass) {
          return false;
        }
      }
    }
    
    // Flag requirement
    if (choice.requirement?.flag && !gameState.flags?.[choice.requirement.flag]) {
      return false;
    }
    
    // Marks requirement
    if (choice.requirement?.marks && (gameState.character?.marks || 0) < choice.requirement.marks) {
      return false;
    }
    
    // Mana cost
    if (choice.manaCost && (gameState.character?.mana || 0) < choice.manaCost) {
      return false;
    }
    
    return true;
  };

  // Get display info for unavailable choice
  const getRequirementText = (choice) => {
    if (choice.classRequired) {
      return `[Requires ${choice.classRequired.toUpperCase()}]`;
    }
    if (choice.requirement?.stat) {
      return `[${choice.requirement.stat.toUpperCase()} ${choice.requirement.min}+]`;
    }
    if (choice.requirement?.marks) {
      return `[${choice.requirement.marks} marks]`;
    }
    if (choice.manaCost) {
      return `[${choice.manaCost} mana]`;
    }
    return '';
  };

  return (
    <div className="narrative">
      {/* Location Header */}
      {node.location && (
        <div className="location">◆ {node.location}</div>
      )}
      
      {/* Main Text */}
      <div className="text">{node.text}</div>
      
      {/* Visible Items (if any) */}
      {node.visibleItems && node.visibleItems.length > 0 && (
        <div className="visible-items">
          <div className="visible-items-label">You notice:</div>
          <div className="visible-items-list">
            {node.visibleItems.map(item => (
              <button
                key={item.id}
                className="visible-item-btn"
                onClick={() => onExamine(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Command Response */}
      {commandResponse && (
        <div className="command-response">
          <div className="response-text">{commandResponse}</div>
        </div>
      )}
      
      {/* System Output (skill checks, etc.) */}
      {systemOutput && (
        <div className="sys-out">
          <div className="sys-head">◈ SYSTEM OUTPUT</div>
          {systemOutput.type === 'check' && (
            <>
              <div>{systemOutput.checkType.toUpperCase()} CHECK — Difficulty {systemOutput.difficulty}</div>
              <div>Base {systemOutput.statValue} + Roll {systemOutput.roll} = {systemOutput.total} vs {systemOutput.target}</div>
              <div className={systemOutput.success ? 'win' : 'lose'}>
                {systemOutput.success ? '▓▓ SUCCESS ▓▓' : '░░ FAILURE ░░'}
              </div>
            </>
          )}
          {systemOutput.type === 'reward' && (
            <>
              {systemOutput.xp && <div className="xp-award">+{systemOutput.xp} XP</div>}
              {systemOutput.marks && <div className="reward">+{systemOutput.marks} MARKS</div>}
              {systemOutput.item && <div className="reward">Acquired: {systemOutput.item}</div>}
            </>
          )}
        </div>
      )}
      
      {/* Choices */}
      {node.type === 'choice' && node.choices && (
        <div className="choices">
          {node.choices.map((choice, index) => {
            const available = isChoiceAvailable(choice);
            const reqText = !available ? getRequirementText(choice) : '';
            
            return (
              <button
                key={choice.id}
                onClick={() => available && onChoice(choice.id)}
                disabled={!available || isProcessing}
                className={!available ? 'unavailable' : ''}
              >
                <span>[{String.fromCharCode(65 + index)}]</span>
                <span className="choice-text">
                  {choice.text}
                  {choice.shadeChange && (
                    <span className={`shade-indicator ${choice.shadeChange > 0 ? 'light' : 'dark'}`}>
                      {choice.shadeChange > 0 ? '◇' : '◆'}
                    </span>
                  )}
                </span>
                {reqText && <span className="req">{reqText}</span>}
                {choice.manaCost && available && (
                  <span className="mana-cost">-{choice.manaCost} mana</span>
                )}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Narrative Continue Button */}
      {node.type === 'narrative' && node.nextNodeId && (
        <div className="choices">
          <button onClick={() => onChoice('continue')} disabled={isProcessing}>
            <span>[SPACE]</span>
            <span className="choice-text">Continue</span>
          </button>
        </div>
      )}
      
      {/* Outcome (ending) */}
      {node.type === 'outcome' && (
        <div className="outcome">
          <div className="outcome-title">{node.endingName || 'End'}</div>
          {node.xpAwarded && <div className="xp-award">+{node.xpAwarded} XP</div>}
        </div>
      )}
    </div>
  );
};

export default NarrativePanel;
