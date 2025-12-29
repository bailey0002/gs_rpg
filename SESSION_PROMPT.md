# Grey Stratum — Session Start Prompt

Copy everything below into a new Claude session to establish context.

---

**Project**: Grey Stratum — Sci-fi RPG with Shade morality system  
**Repo**: `https://github.com/bailey0002/gs_rpg`  
**Architecture**: Modular React (files < 200 lines each)

## Before Starting Any Work

1. Read `PROJECT_MANIFEST.md` — lists all features that must be preserved
2. Read `INTEGRITY_CHECKLIST.md` — verification steps after modifications
3. Identify which files will be modified
4. Confirm no manifest features will be lost

## Current Architecture

```
src/
├── App.jsx                      # Orchestrator (~130 lines)
├── components/
│   ├── CharacterGallery.jsx     # Grok portrait selection
│   ├── CharacterCard.jsx        # Card display with stats
│   ├── NarrativePanel.jsx       # Story text + choices
│   ├── CommandBar.jsx           # Text parser + quick buttons
│   ├── ShadeBar.jsx             # -10 to +10 visual indicator
│   ├── InventoryModal.jsx       # Item display + combination
│   ├── JournalModal.jsx         # Echo Journal
│   └── HelpModal.jsx            # Command reference
├── data/
│   ├── classes/classLibrary.js  # 6 Grok classes + portrait paths
│   ├── acts/act1_circuit.js     # Act 1 story nodes
│   ├── systems/echo_journal.js  # Journal system
│   └── content/items.js         # Item catalog
├── engine/game_engine.js        # Core loop, state, save/load
└── styles/GameUI.css            # All styles
```

## Key Technical Details

- **Classes**: sentinel, void-stalker, oracle, vanguard, forger, cleric
- **Portrait paths**: `/character-images/{class}/{prefix}{n}.jpg`
- **Stats**: PHY, INT, DEF, HP, MANA
- **Shade**: -10 (Void) to +10 (Luminous)
- **Storage**: localStorage for saves

## Engine Functions

```javascript
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
```

## Story Node Types

- `narrative` — Text display, auto-advance
- `choice` — Player selects from options
- `check` — Skill check (stat + d6 vs difficulty)
- `combat` — Enemy encounter
- `reward` — Grant items/XP/marks
- `outcome` — Ending node

## Modification Protocol

1. **Read specific file(s)** to be modified
2. **Use `str_replace`** for surgical edits when possible
3. **Full file only** if restructuring needed
4. **Run integrity checks** after modification
5. **Update manifest** if features added/changed

## Current Task

[Describe what you need help with]

## Files to Reference

[List specific files relevant to this task]

---

*End of session prompt*
