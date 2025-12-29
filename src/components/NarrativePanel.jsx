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
      <div className="narrative-panel">
        <div className="narrative-text">Loading...</div>
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
    <div className="narrative-panel">
      {/* Location Header */}
      {node.location && (
        <div className="narrative-location">
          <span className="location-marker">◆</span>
          {node.location}
        </div>
      )}
      
      {/* Main Text */}
      <div className="narrative-text">{node.text}</div>
      
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
        <div className="system-output">
          <div className="system-header">
            <span className="system-icon">◈</span>
            <span>SYSTEM OUTPUT</span>
          </div>
          <div className="system-content">
            {systemOutput.type === 'check' && (
              <>
                <div className="check-type">{systemOutput.checkType.toUpperCase()} CHECK — Difficulty {systemOutput.difficulty}</div>
                <div className="check-calculation">Base {systemOutput.statValue} + Roll {systemOutput.roll} = {systemOutput.total} vs {systemOutput.target}</div>
                <div className="check-progress">
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${systemOutput.success ? 'success' : 'failure'}`}
                      style={{ width: `${Math.min((systemOutput.total / systemOutput.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className={`check-result ${systemOutput.success ? 'success' : 'failure'}`}>
                  {systemOutput.success ? '▓▓ SUCCESS ▓▓' : '░░ FAILURE ░░'}
                </div>
              </>
            )}
            {systemOutput.type === 'reward' && (
              <>
                {systemOutput.xp && <div className="reward-xp">+{systemOutput.xp} XP</div>}
                {systemOutput.marks && <div className="reward-marks">+{systemOutput.marks} MARKS</div>}
                {systemOutput.item && <div className="reward-item">Acquired: {systemOutput.item}</div>}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Choices */}
      {node.type === 'choice' && node.choices && (
        <div className="choices-section">
          <div className="choices-header">ACTIONS</div>
          <div className="choices-list">
            {node.choices.map((choice, index) => {
              const available = isChoiceAvailable(choice);
              const reqText = !available ? getRequirementText(choice) : '';
              
              return (
                <button
                  key={choice.id}
                  className={`choice-button ${!available ? 'unavailable' : ''}`}
                  onClick={() => available && onChoice(choice.id)}
                  disabled={!available || isProcessing}
                >
                  <span className="choice-key">[{String.fromCharCode(65 + index)}]</span>
                  <span className="choice-text">
                    {choice.text}
                    {choice.shadeChange && (
                      <span className={`shade-indicator ${choice.shadeChange > 0 ? 'light' : 'dark'}`}>
                        {choice.shadeChange > 0 ? '◇' : '◆'}
                      </span>
                    )}
                  </span>
                  {reqText && <span className="choice-requirement">{reqText}</span>}
                  {choice.manaCost && available && (
                    <span className="choice-mana-cost">-{choice.manaCost} mana</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Narrative Continue Button */}
      {node.type === 'narrative' && node.nextNodeId && (
        <div className="choices-section">
          <div className="choices-list">
            <button className="choice-button" onClick={() => onChoice('continue')} disabled={isProcessing}>
              <span className="choice-key">[SPACE]</span>
              <span className="choice-text">Continue</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Outcome (ending) */}
      {node.type === 'outcome' && (
        <div className="outcome">
          <div className="outcome-title">{node.endingName || 'End'}</div>
          {node.xpAwarded && <div className="outcome-xp">+{node.xpAwarded} XP</div>}
        </div>
      )}
    </div>
  );
};

export default NarrativePanel;
