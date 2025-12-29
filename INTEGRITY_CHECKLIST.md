# Grey Stratum — Integrity Checklist

Use this checklist after modifying ANY file to ensure structural soundness.

---

## Quick Check (Every Modification)

```
□ File saved without syntax errors
□ All imports point to existing files
□ All exports are properly declared
□ No console errors on load
□ Component renders without crash
```

---

## Component File Checks

When modifying `src/components/*.jsx`:

```
□ Component has default export OR named exports match imports elsewhere
□ All useState hooks have initial values
□ All useEffect hooks have dependency arrays
□ Event handlers (onClick, onChange) reference defined functions
□ Props destructured match what parent passes
□ No undefined variables in JSX
□ className strings match CSS rules in GameUI.css
```

### Specific Component Checks:

**CharacterGallery.jsx**
```
□ CLASS_LIBRARY imported from classLibrary.js
□ Portrait paths use format: character-images/{class}/{file}
□ onComplete callback passes full character object
□ Class selection updates portrait options
```

**CharacterCard.jsx**
```
□ Displays: name, class, hp, stats, shade, portrait
□ Portrait img src handles missing images gracefully
□ Stats show PHY, INT, DEF correctly
□ Shade bar renders with correct gradient
```

**NarrativePanel.jsx**
```
□ Displays current node text
□ Shows location header
□ Renders choices array as buttons
□ Handles class-specific choice filtering
□ Handles stat requirements display
```

**CommandBar.jsx**
```
□ Input captures Enter key
□ Quick buttons trigger correct commands
□ Command parsing handles: LOOK, GET, BACK, HELP, INVENTORY
□ Response display shows examine text or error
```

**InventoryModal.jsx**
```
□ Lists all inventory items
□ Shows item examine text on click
□ Displays marks and debt
□ Supports item combination (if implemented)
□ Modal closes on backdrop click or X
```

**JournalModal.jsx**
```
□ Two tabs: Entries and Insights
□ Entries sorted by timestamp
□ Insights show read/unread state
□ Modal closes properly
```

**ShadeBar.jsx**
```
□ Value bounded -10 to +10
□ Gradient renders (void purple → gray → luminous gold)
□ Current position marker shows correctly
□ Labels appear: Void Touched / Balanced / Luminous
```

---

## Data File Checks

When modifying `src/data/**/*.js`:

**classLibrary.js**
```
□ All 6 classes present: sentinel, void-stalker, oracle, vanguard, forger, cleric
□ Each class has: id, name, role, description, baseStats, baseHp, images[]
□ Image paths match actual files in /public/character-images/
□ baseStats has: phy, int, def
□ getClass() and getAllClasses() functions work
```

**act1_circuit.js**
```
□ ACT_1_META has startNode pointing to existing node
□ All nextNodeId values point to existing nodes
□ All choice.nextNodeId values point to existing nodes
□ No orphan nodes (nodes with no path to them)
□ All classRequired values match class IDs
□ All itemId values match items.js IDs
```

**items.js**
```
□ All items have unique IDs
□ COMBINATIONS keys match format: 'item1+item2'
□ Combination results point to existing item IDs
□ getItem() returns null for missing IDs (not undefined)
```

**echo_journal.js**
```
□ All ENTRY_TEMPLATES keys match journalEntry values in act nodes
□ All INSIGHT_TEMPLATES keys match insight values in act nodes
□ createJournalState() returns valid initial state
```

---

## Engine File Checks

When modifying `src/engine/game_engine.js`:

```
□ ACT_REGISTRY includes all act imports
□ createInitialGameState() uses character parameter
□ processChoice() handles all choice fields
□ advanceNarrative() handles all node fields
□ Save/load uses consistent localStorage keys
□ All exported functions are actually exported
```

---

## Style File Checks

When modifying `src/styles/GameUI.css`:

```
□ All component className references have rules
□ CSS variables defined in :root
□ Media queries don't break layout
□ Fonts imported: Orbitron, Share Tech Mono
□ Color scheme consistent: --cyan, --amber, --bg, --panel
```

---

## Integration Checks

After modifying multiple files:

```
□ App.jsx imports all components it renders
□ Components import data files they use
□ No circular imports
□ Game loads to main menu
□ Character creation completes successfully
□ Game starts at Act 1 prologue
□ Choices advance story correctly
□ Save/load preserves state
```

---

## Quick Syntax Verification

Run mentally or paste into validator:

```javascript
// Import check - all paths should be relative and correct
import { X } from './path/to/file.js';

// Export check - default or named
export default Component;
export const helper = () => {};
export { CONSTANT };

// JSX check - proper closure
<div className="foo">
  {condition && <span>text</span>}
</div>

// Event check - function reference, not call
onClick={handleClick}      // ✓ correct
onClick={handleClick()}    // ✗ wrong - calls immediately
```

---

## Common Errors to Watch

1. **Missing default export**: Component won't import
2. **Undefined destructured prop**: Runtime crash
3. **Stale closure in useEffect**: Unexpected behavior
4. **CSS class typo**: Style not applied (silent fail)
5. **Missing node ID in story**: Game crashes on that path
6. **Incorrect import path**: Module not found error

---

## Recovery Steps

If something breaks:

1. Check browser console for specific error
2. Identify which file/line threw error
3. Compare against last known working version
4. Restore from PROJECT_MANIFEST.md requirements
5. Re-run integrity checks
