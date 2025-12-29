// =============================================================================
// GREY STRATUM — HELP MODAL
// /src/components/HelpModal.jsx
// =============================================================================
// Command reference and game help.

import React from 'react';

const HelpModal = ({ onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal help-modal">
        <div className="modal-header">
          <h2>COMMAND REFERENCE</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="help-section">
            <h3>EXPLORATION</h3>
            <div className="help-command">
              <span className="help-cmd">LOOK</span> or <span className="help-cmd">L</span>
              <span className="help-desc">Examine your surroundings</span>
            </div>
            <div className="help-command">
              <span className="help-cmd">LOOK [item]</span>
              <span className="help-desc">Examine a specific item</span>
            </div>
            <div className="help-command">
              <span className="help-cmd">GET [item]</span> or <span className="help-cmd">TAKE [item]</span>
              <span className="help-desc">Pick up an item</span>
            </div>
          </div>
          
          <div className="help-section">
            <h3>NAVIGATION</h3>
            <div className="help-command">
              <span className="help-cmd">BACK</span> or <span className="help-cmd">B</span>
              <span className="help-desc">Return to previous location</span>
            </div>
          </div>
          
          <div className="help-section">
            <h3>INVENTORY</h3>
            <div className="help-command">
              <span className="help-cmd">INVENTORY</span> or <span className="help-cmd">I</span>
              <span className="help-desc">Open your inventory</span>
            </div>
            <div className="help-command">
              <span className="help-cmd">USE [item]</span>
              <span className="help-desc">Use a consumable item</span>
            </div>
            <div className="help-command">
              <span className="help-cmd">COMBINE</span>
              <span className="help-desc">Combine two items</span>
            </div>
          </div>
          
          <div className="help-section">
            <h3>JOURNAL</h3>
            <div className="help-command">
              <span className="help-cmd">JOURNAL</span> or <span className="help-cmd">J</span>
              <span className="help-desc">Open your Echo Journal</span>
            </div>
          </div>
          
          <div className="help-section">
            <h3>SYSTEM</h3>
            <div className="help-command">
              <span className="help-cmd">HELP</span> or <span className="help-cmd">?</span>
              <span className="help-desc">Show this help screen</span>
            </div>
          </div>
          
          <div className="help-section">
            <h3>TIPS</h3>
            <ul className="help-tips">
              <li>Examine everything — clues are hidden in descriptions</li>
              <li>Some choices require specific class abilities</li>
              <li>Your Shade alignment affects available options</li>
              <li>Items can often be combined for new uses</li>
              <li>The Echo Journal tracks important discoveries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
