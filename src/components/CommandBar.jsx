// =============================================================================
// GREY STRATUM — COMMAND BAR
// /src/components/CommandBar.jsx
// =============================================================================
// Text parser for adventure game commands.

import React, { useState, useRef, useEffect } from 'react';

const CommandBar = ({ 
  onCommand, 
  onOpenInventory, 
  onOpenJournal,
  onOpenHelp,
  onBack,
  canGoBack = false,
  disabled = false 
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    
    const command = input.trim().toUpperCase();
    const parts = command.split(/\s+/);
    const action = parts[0];
    const target = parts.slice(1).join(' ');
    
    // Process command
    switch (action) {
      case 'LOOK':
      case 'L':
      case 'X':
      case 'EXAMINE':
        onCommand({ type: 'look', target });
        break;
        
      case 'GET':
      case 'TAKE':
      case 'GRAB':
      case 'PICK':
        onCommand({ type: 'get', target });
        break;
        
      case 'INVENTORY':
      case 'I':
      case 'INV':
        onOpenInventory();
        break;
        
      case 'JOURNAL':
      case 'J':
      case 'LOG':
        onOpenJournal();
        break;
        
      case 'BACK':
      case 'B':
      case 'GO BACK':
        if (canGoBack) {
          onBack();
        } else {
          onCommand({ type: 'error', message: 'Cannot go back from here.' });
        }
        break;
        
      case 'HELP':
      case 'H':
      case '?':
        onOpenHelp();
        break;
        
      case 'USE':
        onCommand({ type: 'use', target });
        break;
        
      case 'COMBINE':
        onCommand({ type: 'combine', target });
        break;
        
      default:
        onCommand({ 
          type: 'error', 
          message: `I don't understand "${input.trim()}". Type HELP for commands.` 
        });
    }
    
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInput('');
    }
  };

  return (
    <div className="command-bar">
      <form onSubmit={handleSubmit} className="command-form">
        <span className="command-prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
        />
      </form>
      
      <div className="quick-buttons">
        <button 
          onClick={() => onCommand({ type: 'look', target: '' })} 
          title="Look around"
          disabled={disabled}
        >
          L
        </button>
        <button 
          onClick={onOpenInventory} 
          title="Inventory"
          disabled={disabled}
        >
          I
        </button>
        <button 
          onClick={onOpenJournal} 
          title="Journal"
          disabled={disabled}
        >
          J
        </button>
        <button 
          onClick={onBack} 
          title="Go back"
          disabled={disabled || !canGoBack}
        >
          B
        </button>
        <button 
          onClick={onOpenHelp} 
          title="Help"
          disabled={disabled}
        >
          ?
        </button>
      </div>
    </div>
  );
};

export default CommandBar;
