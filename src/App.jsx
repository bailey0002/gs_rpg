// =============================================================================
// GREY STRATUM — MAIN APPLICATION
// /src/App.jsx
// =============================================================================
// Orchestrator only. All logic lives in components and engine.

import React, { useState, useEffect, useCallback } from 'react';

// Components
import CharacterGallery from './components/CharacterGallery.jsx';
import CharacterCard from './components/CharacterCard.jsx';
import NarrativePanel from './components/NarrativePanel.jsx';
import CommandBar from './components/CommandBar.jsx';
import ShadeBar from './components/ShadeBar.jsx';
import InventoryModal from './components/InventoryModal.jsx';
import JournalModal from './components/JournalModal.jsx';
import HelpModal from './components/HelpModal.jsx';

// Engine
import {
  createInitialGameState,
  getCurrentNode,
  getNodeWithVariation,
  processChoice,
  advanceNarrative,
  addItemToInventory,
  combineItems,
  saveGame,
  loadGame,
  checkForHint,
} from './engine/game_engine.js';

// Data
import { createCharacterFromClass } from './data/classes/classLibrary.js';

// Text variation for diegetic errors
import { getCantSeeError, getCantTakeError } from './engine/text_variation.js';

// Styles
import './styles/GameUI.css';
import HUDBar from "./components/HUDBar.jsx";
import DecisionPulse from "./components/DecisionPulse.jsx";
import OutcomeToast from "./components/OutcomeToast.jsx";

const App = () => {
  // Core state
  const [screen, setScreen] = useState('menu'); // menu, creator, game
  const [gameState, setGameState] = useState(null);
  const [systemOutput, setSystemOutput] = useState(null);
  const [commandResponse, setCommandResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


// HUD + decision pulse + outcome toast
const [hud, setHud] = useState({ threat: 2, intel: 2, tempo: 2, comms: "SECURE" });
const [pulseOpen, setPulseOpen] = useState(false);
const [pulse, setPulse] = useState({ prompt: "", options: [] });
const [toast, setToast] = useState(null);

const triggerDecisionPulse = () => {
  setPulse({
    prompt: "Operational posture?",
    options: [
      { id: "recon", label: "Recon sweep", impact: "INTEL ↑, TEMPO ↓", delta: { intel: +1, tempo: -1 }, kind: "green",
        outcomeLines: ["ISR sweep executed.", "Contacts mapped; tempo reduced."] },
      { id: "push", label: "Push the line", impact: "TEMPO ↑, THREAT ↑", delta: { tempo: +1, threat: +1 }, kind: "amber",
        outcomeLines: ["Advance ordered.", "Tempo gained; threat escalates."] },
      { id: "hold", label: "Hold & fortify", impact: "THREAT ↓, TEMPO ↓", delta: { threat: -1, tempo: -1 }, kind: "green",
        outcomeLines: ["Position hardened.", "Threat reduced; tempo slower."] },
    ],
  });
  setPulseOpen(true);
};

const applyDecision = (opt) => {
  const delta = opt?.delta || {};
  setHud((h) => ({
    threat: Math.max(0, Math.min(4, (h.threat ?? 0) + (delta.threat ?? 0))),
    intel:  Math.max(0, Math.min(4, (h.intel ?? 0) + (delta.intel ?? 0))),
    tempo:  Math.max(0, Math.min(4, (h.tempo ?? 0) + (delta.tempo ?? 0))),
    comms:  opt?.comms || h.comms || "SECURE",
  }));
  setToast({
    kind: opt?.kind || "amber",
    title: "OUTCOME",
    lines: opt?.outcomeLines || [opt?.label || "Decision executed.", opt?.impact || ""],
  });
};

  // Modal state
  const [showInventory, setShowInventory] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Navigation history for BACK command
  const [navHistory, setNavHistory] = useState([]);

  // Hint system state
  const [activeHint, setActiveHint] = useState(null);

  // Load saved game on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setGameState(saved);
      setScreen('game');
    }
  }, []);

  // Auto-save on state change
  useEffect(() => {
    if (gameState && screen === 'game') {
      saveGame(gameState);
    }
  }, [gameState, screen]);

  // Hint system - check for hints periodically
  useEffect(() => {
    if (!gameState || screen !== 'game') return;
    
    const interval = setInterval(() => {
      const hintResult = checkForHint(gameState);
      if (hintResult) {
        setActiveHint(hintResult.hint);
        setGameState(prev => ({
          ...prev,
          journal: hintResult.updatedJournal
        }));
      }
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [gameState, screen]);

  // Clear hint when node changes
  useEffect(() => {
    setActiveHint(null);
  }, [gameState?.currentNodeId]);

  // Get current node with textural variation for revisits
  const currentNode = gameState ? getNodeWithVariation(gameState) : null;

  // Character creation complete
  const handleCharacterCreated = (character) => {
    const initialState = createInitialGameState(character);
    setGameState(initialState);
    setScreen('game');
  };

  // Quick Start - bypass character creation for immediate engagement
  const handleQuickStart = () => {
    const defaultChar = createCharacterFromClass('sentinel', 'Shifter', 's1');
    if (defaultChar) {
      const initialState = createInitialGameState(defaultChar);
      setGameState(initialState);
      setScreen('game');
    }
  };

  // Process story choice
  const handleChoice = useCallback((choiceId) => {
    if (!gameState || isProcessing) return;
    
    setIsProcessing(true);
    setCommandResponse(null);
    setActiveHint(null); // Clear hint on action
    
    // Track for BACK navigation
    setNavHistory(prev => [...prev.slice(-9), gameState.currentNodeId]);
    
    let newState;
    if (choiceId === 'continue') {
      newState = advanceNarrative(gameState);
    } else {
      newState = processChoice(gameState, choiceId);
    }
    
    setGameState(newState);
    setIsProcessing(false);
  }, [gameState, isProcessing]);

  // Handle command input (with diegetic error messages)
  const handleCommand = useCallback((cmd) => {
    const node = currentNode;
    setActiveHint(null); // Clear hint on command
    
    switch (cmd.type) {
      case 'look':
        if (cmd.target && node?.visibleItems) {
          const item = node.visibleItems.find(
            i => i.name.toLowerCase().includes(cmd.target.toLowerCase())
          );
          if (item) {
            setCommandResponse(item.text);
            if (item.action === 'take' && item.itemId) {
              setGameState(prev => addItemToInventory(prev, item.itemId, 1, 'examine'));
            }
          } else {
            // Diegetic "can't see" error
            setCommandResponse(getCantSeeError(cmd.target));
          }
        } else if (!cmd.target && node?.visibleItems?.length) {
          const items = node.visibleItems.map(i => i.name).join(', ');
          setCommandResponse(`You notice: ${items}`);
        } else {
          setCommandResponse('Nothing particular catches your attention.');
        }
        break;
        
      case 'get':
        if (node?.visibleItems) {
          const item = node.visibleItems.find(
            i => i.name.toLowerCase().includes(cmd.target.toLowerCase()) && i.action === 'take'
          );
          if (item && item.itemId) {
            setGameState(prev => addItemToInventory(prev, item.itemId, 1, 'take'));
            setCommandResponse(`Taken: ${item.name}`);
          } else {
            // Diegetic "can't take" error
            setCommandResponse(getCantTakeError());
          }
        }
        break;
        
      case 'error':
        setCommandResponse(cmd.message);
        break;
        
      default:
        setCommandResponse(`Command not recognized.`);
    }
  }, [currentNode]);

  // Handle BACK navigation
  const handleBack = useCallback(() => {
    if (navHistory.length > 0) {
      const prevNodeId = navHistory[navHistory.length - 1];
      setNavHistory(prev => prev.slice(0, -1));
      setGameState(prev => ({ ...prev, currentNodeId: prevNodeId }));
      setCommandResponse('You retrace your steps.');
    }
  }, [navHistory]);

  // Handle return to menu
  const handleReturnToMenu = useCallback(() => {
    if (window.confirm('Return to menu? Your game is auto-saved.')) {
      setScreen('menu');
      setNavHistory([]);
    }
  }, []);

  // Item combination
  const handleCombineItems = (item1, item2) => {
    const result = combineItems(gameState, item1, item2);
    setGameState(result.gameState);
    setCommandResponse(result.message);
  };

  // Examine visible item
  const handleExamine = (item) => {
    setCommandResponse(item.text);
    if (item.action === 'take' && item.itemId) {
      setGameState(prev => addItemToInventory(prev, item.itemId));
    }
  };

  // Render based on screen
  return (
    <div className="game-container">
      {screen === "game" ? (
        <HUDBar threat={hud.threat} intel={hud.intel} tempo={hud.tempo} comms={hud.comms} />
      ) : null}
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="stars" />
        <div className="nebula" />
        <div className="grid-overlay" />
      </div>

      {screen === 'menu' && (
        <div className="menu-screen">
          {/* Video Background */}
          <video
            className="menu-video-bg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            webkit-playsinline="true"
            x5-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            ref={(el) => {
              // iOS requires programmatic play after user interaction or on load
              if (el) {
                el.play().catch(() => {
                  // Autoplay blocked - video will show first frame
                });
              }
            }}
            src={`/videos/bg-${Math.random() < 0.5 ? '1' : '2'}.mp4`}
          />
          <div className="menu-video-overlay" />
          
          {/* Content */}
          <div className="menu-content">
            <h1>GREY STRATUM</h1>
            <div className="menu-buttons">
              <button onClick={() => setScreen('creator')}>NEW GAME</button>
              <button onClick={handleQuickStart} className="quick-start-btn">QUICK START</button>
              {loadGame() && <button onClick={() => { setGameState(loadGame()); setScreen('game'); }}>CONTINUE</button>}
            </div>
            <div className="menu-quick-start-hint">Quick Start: Play as a Sentinel named "Shifter"</div>
          </div>
        </div>
      )}

      {screen === 'creator' && (
        <CharacterGallery onComplete={handleCharacterCreated} onCancel={() => setScreen('menu')} />
      )}

      {screen === 'game' && gameState && (
        <>
          <header className="game-header">
            <div className="header-brand">GREY STRATUM</div>
            <div className="header-subtitle">TERMINAL v2.1.85</div>
            <div className="header-actions">
              <button className="header-btn" onClick={handleReturnToMenu}>MENU</button>
              <button className="header-btn" onClick={() => setShowInventory(true)}>INVENTORY</button>
              <button className="header-btn" onClick={() => setShowJournal(true)}>JOURNAL</button>
              <button className="header-btn" onClick={() => setShowHelp(true)}>HELP</button>
            </div>
          </header>

          <main className="game-main">
            <aside className="card-panel">
              <CharacterCard character={gameState.character} shade={gameState.shade} />
              <ShadeBar value={gameState.shade} size="compact" />
            </aside>
            
            <section className="narrative-section">
              <NarrativePanel
                node={currentNode}
                gameState={gameState}
                onChoice={handleChoice}
                onExamine={handleExamine}
                systemOutput={systemOutput}
                commandResponse={commandResponse}
                isProcessing={isProcessing}
                activeHint={activeHint}
              />
              <CommandBar
                onCommand={handleCommand}
                onOpenInventory={() => setShowInventory(true)}
                onOpenJournal={() => setShowJournal(true)}
                onOpenHelp={() => setShowHelp(true)}
                onBack={handleBack}
                onDecision={() => triggerDecisionPulse()}
                canGoBack={navHistory.length > 0}
              />
            </section>
          </main>

          <footer className="game-footer">
            <div className="footer-status">
              <span className="status-indicator online" />
              SYSTEM ONLINE
            </div>
            <div className="footer-coords">
              {currentNode?.location || 'UNKNOWN SECTOR'}
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      {showInventory && (
        <InventoryModal
          inventory={gameState?.inventory}
          marks={gameState?.character?.marks}
          debt={gameState?.character?.debt}
          onClose={() => setShowInventory(false)}
          onCombineItems={handleCombineItems}
        />
      )}
      {showJournal && (
        <JournalModal journal={gameState?.journal} onClose={() => setShowJournal(false)} />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default App;
