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
  processChoice,
  advanceNarrative,
  addItemToInventory,
  combineItems,
  saveGame,
  loadGame,
} from './engine/game_engine.js';

// Styles
import './styles/GameUI.css';

const App = () => {
  // Core state
  const [screen, setScreen] = useState('menu'); // menu, creator, game
  const [gameState, setGameState] = useState(null);
  const [systemOutput, setSystemOutput] = useState(null);
  const [commandResponse, setCommandResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal state
  const [showInventory, setShowInventory] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Navigation history for BACK command
  const [navHistory, setNavHistory] = useState([]);

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

  // Get current node
  const currentNode = gameState ? getCurrentNode(gameState) : null;

  // Character creation complete
  const handleCharacterCreated = (character) => {
    const initialState = createInitialGameState(character);
    setGameState(initialState);
    setScreen('game');
  };

  // Process story choice
  const handleChoice = useCallback((choiceId) => {
    if (!gameState || isProcessing) return;
    
    setIsProcessing(true);
    setCommandResponse(null);
    
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

  // Handle command input
  const handleCommand = useCallback((cmd) => {
    const node = currentNode;
    
    switch (cmd.type) {
      case 'look':
        if (cmd.target && node?.visibleItems) {
          const item = node.visibleItems.find(
            i => i.name.toLowerCase().includes(cmd.target.toLowerCase())
          );
          if (item) {
            setCommandResponse(item.text);
            if (item.action === 'take' && item.itemId) {
              setGameState(prev => addItemToInventory(prev, item.itemId));
            }
          } else {
            setCommandResponse(`You don't see "${cmd.target}" here.`);
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
            setGameState(prev => addItemToInventory(prev, item.itemId));
            setCommandResponse(`Taken: ${item.name}`);
          } else {
            setCommandResponse(`You can't take that.`);
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
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="stars" />
        <div className="nebula" />
        <div className="grid-overlay" />
      </div>

      {screen === 'menu' && (
        <div className="menu-screen">
          <h1>GREY STRATUM</h1>
          <div className="menu-buttons">
            <button onClick={() => setScreen('creator')}>NEW GAME</button>
            {loadGame() && <button onClick={() => { setGameState(loadGame()); setScreen('game'); }}>CONTINUE</button>}
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
              />
              <CommandBar
                onCommand={handleCommand}
                onOpenInventory={() => setShowInventory(true)}
                onOpenJournal={() => setShowJournal(true)}
                onOpenHelp={() => setShowHelp(true)}
                onBack={handleBack}
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
