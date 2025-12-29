# GREY STRATUM — Modular Architecture

## Directory Structure

```
grey_stratum_modular/
│
├── game_engine.js              # Core engine - loads acts, manages state
│
├── data/
│   ├── acts/
│   │   ├── act1_circuit.js     # Act 1: The Circuit (complete)
│   │   ├── act2_midway.js      # Act 2: The Midway (future)
│   │   ├── act3_murk.js        # Act 3: The Murk (future)
│   │   ├── act4_abyss.js       # Act 4: The Abyss (future)
│   │   └── act5_core.js        # Act 5: The Core (future)
│   │
│   ├── systems/
│   │   ├── echo_journal.js     # Journal entries, hints, insights
│   │   ├── shade.js            # Shade calculations (future)
│   │   ├── combat.js           # Combat system (future)
│   │   └── relationships.js    # NPC relationship tracking (future)
│   │
│   └── content/
│       ├── items.js            # All item definitions + combinations
│       ├── enemies.js          # Enemy definitions (future)
│       ├── npcs.js             # NPC definitions (future)
│       └── locations.js        # Location metadata (future)
│
└── components/                  # React components (future)
    ├── EchoJournal.jsx
    ├── InventoryPanel.jsx
    ├── VisibleItems.jsx
    └── StratumSync.jsx
```

## How It Works

### Adding New Content

**New Items**: Add to `data/content/items.js`
```javascript
'new-item-id': {
  id: 'new-item-id',
  name: 'New Item',
  category: 'key',
  description: 'Short description',
  examineText: 'Detailed examination text'
}
```

**New Story Nodes**: Add to appropriate act file
```javascript
'new-node-id': {
  type: 'choice',  // or 'narrative', 'check', 'combat', 'puzzle', 'reward'
  location: 'LOCATION NAME',
  text: 'Scene description...',
  choices: [
    { id: 'a', text: 'Option A', nextNodeId: 'next-node' }
  ]
}
```

**New Journal Entries**: Add to `data/systems/echo_journal.js`
```javascript
'entry-template-id': {
  title: 'Entry Title',
  content: 'Entry content...',
  category: 'reflection' // or 'event', 'discovery', 'character'
}
```

### Swapping Acts

To replace an act entirely:
1. Create new file (e.g., `act1_circuit_v2.js`)
2. Update import in `game_engine.js`
3. Update `ACT_REGISTRY`

### Extending the Engine

The game engine exposes these functions:
- `createInitialGameState(character)` - Start new game
- `getCurrentNode(gameState)` - Get current scene
- `processChoice(gameState, choiceId)` - Handle player choice
- `advanceNarrative(gameState)` - Progress narrative nodes
- `addItemToInventory(gameState, itemId)` - Add item
- `combineItems(gameState, itemId1, itemId2)` - Combine items
- `performCheck(gameState, stat, difficulty)` - Skill check
- `saveGame(gameState, slot)` - Save to localStorage
- `loadGame(slot)` - Load from localStorage

## Integration with Existing App.jsx

Replace the `QUEST` object with:

```javascript
import { 
  ACT_REGISTRY,
  createInitialGameState,
  getCurrentNode,
  processChoice,
  advanceNarrative
} from './game_engine.js';

// In your game component:
const [gameState, setGameState] = useState(() => 
  createInitialGameState(character)
);

const node = getCurrentNode(gameState);

const handleChoice = (choiceId) => {
  setGameState(prev => processChoice(prev, choiceId));
};
```

## Inspired By: Colossal Cave Adventure

The structure follows the classic "excursion loop":

```
Enter Area → Explore → Solve Puzzle → Return with Progress → Repeat
     ↓           ↓          ↓               ↓
  (narrative)  (visible   (check/       (rewards +
              items)     puzzle)      next node)
```

Key patterns from Grok's research:
- **Visible items** clearly listed in each scene
- **Multi-step puzzles** using inventory combinations
- **Branching consequences** that echo forward
- **No softlocks** - always a path forward
- **Humor in failure** - witty responses to wrong actions

## File Sizes (Estimated)

| File | Lines | Purpose |
|------|-------|---------|
| game_engine.js | ~350 | Core loop |
| act1_circuit.js | ~500 | Full Act 1 |
| items.js | ~200 | Item catalog |
| echo_journal.js | ~250 | Journal system |

Total: ~1,300 lines vs. a monolithic ~5,000+ line single file

## Next Steps

1. **Complete Act 1**: Add remaining job paths (heist, collection, package)
2. **Build React Components**: EchoJournal, InventoryPanel, VisibleItems
3. **Test Integration**: Drop into existing App.jsx
4. **Act 2 Draft**: Begin Midway faction content
5. **Polish**: Add witty failure responses, more item combinations
