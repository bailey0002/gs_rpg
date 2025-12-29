# Grey Stratum — Project Manifest

**Last Updated**: 2025-12-29  
**Version**: 2.0 (Modular Architecture)

---

## Purpose

This manifest is the **source of truth** for Grey Stratum features. Before modifying any file, Claude should:
1. Read this manifest
2. Identify which features the modification touches
3. Verify all listed features remain intact after changes

---

## Core Architecture

```
src/
├── App.jsx                      # Orchestrator only (~100 lines max)
├── components/
│   ├── CharacterGallery.jsx     # Grok portrait selection
│   ├── CharacterCard.jsx        # Card display with stats
│   ├── NarrativePanel.jsx       # Story text + choices
│   ├── CommandBar.jsx           # Text parser + quick buttons
│   ├── InventoryModal.jsx       # Item display + combination
│   ├── JournalModal.jsx         # Echo Journal entries + insights
│   └── ShadeBar.jsx             # -10 to +10 visual indicator
├── data/
│   ├── classes/
│   │   └── classLibrary.js      # All 6 Grok classes + portrait paths
│   ├── acts/
│   │   └── act1_circuit.js      # Act 1 story nodes (already exists)
│   ├── systems/
│   │   └── echo_journal.js      # Journal system (already exists)
│   └── content/
│       └── items.js             # Item catalog (already exists)
├── engine/
│   └── game_engine.js           # Core loop (already exists)
└── styles/
    └── GameUI.css               # All styles (already exists)
```

---

## Feature Checklist

### Character System
- [ ] **CLASS_LIBRARY** with 6 Grok classes
  - Sentinel (PHY:4, INT:2, DEF:4, HP:13)
  - Void Stalker (PHY:4, INT:3, DEF:2, HP:10)
  - Oracle (PHY:2, INT:5, DEF:2, HP:9)
  - Vanguard (PHY:3, INT:4, DEF:3, HP:11)
  - Forger (PHY:5, INT:3, DEF:3, HP:13)
  - Cleric (PHY:2, INT:5, DEF:2, HP:10)
- [ ] **Portrait paths**: `/character-images/{class}/{prefix}{n}.jpg`
  - sentinel: s1.jpg, s2.jpg, s3.jpg
  - stalker: st1.jpg, st2.jpg, st3.jpg, st4.jpg
  - oracle: o1.jpg, o2.jpg
  - vanguard: v1.jpg, v2.jpg
  - forger: f1.jpg, f2.jpg
  - cleric: c1.jpg, c2.jpg
- [ ] **Portrait selection** in character creator

### Shade System
- [ ] **Shade value**: -10 to +10 integer
- [ ] **Visual bar**: Gradient from void (black/purple) to luminous (white/gold)
- [ ] **Labels**: Void Touched → Balanced → Luminous

### Game Systems
- [ ] **Echo Journal**: Entries tab + Insights tab
- [ ] **Visible Items**: Clickable hotspots per scene
- [ ] **Inventory**: Items, marks, debt tracking
- [ ] **Command Parser**: LOOK, GET, BACK, HELP, INVENTORY

### UI Elements
- [ ] **Mobile viewport lock**: No horizontal scroll/bounce
- [ ] **Command input bar**: Text input + quick buttons
- [ ] **Modals**: Inventory, Journal, Help (overlay style)
- [ ] **Header**: GREY STRATUM branding + action buttons

### Story Content
- [ ] **Act 1 nodes**: Prologue → Circuit Hub → Jobs → Descent
- [ ] **Class-specific choices**: Oracle read, Sentinel shield, Stalker assassinate
- [ ] **Consequence flags**: Relationships, subplots, debt

### Visual Style
- [ ] **Fonts**: Orbitron (headers), Share Tech Mono (body)
- [ ] **Colors**: Cyan (#00f0ff), Amber (#ffaa00), Dark (#0a0a12)
- [ ] **Theme**: Dark cyberpunk terminal aesthetic

---

## File Modification Rules

### When modifying a component file:
1. Only modify that specific component
2. Do not touch imports in other files unless necessary
3. Verify component still exports correctly

### When modifying data files:
1. Preserve all existing IDs (breaking IDs breaks save games)
2. Add new content at end of arrays/objects
3. Never remove existing entries without explicit request

### When modifying App.jsx:
1. Keep it under 150 lines
2. It should only import and orchestrate
3. All logic belongs in components or engine

---

## Integrity Check Procedure

After any file modification, verify:

1. **Imports resolve**: All `import` statements point to existing files
2. **Exports exist**: All imported functions/objects are exported from source
3. **IDs preserved**: No story node IDs, item IDs, or class IDs changed
4. **No orphans**: No components reference removed functions
5. **CSS classes**: All className references have matching CSS rules

---

## Session Protocol

### Starting a session:
1. Read PROJECT_MANIFEST.md first
2. Identify scope of requested changes
3. List files that will be modified
4. Confirm no manifest features will be lost

### Ending a session:
1. Update "Last Updated" date in manifest if features changed
2. List all files modified
3. Note any new features added
4. Flag any unresolved issues for next session

---

## Known Issues / TODO

- [ ] Combat system needs expansion (currently basic)
- [ ] Stratum Sync timing challenge not implemented
- [ ] Acts 2-5 story content not created
- [ ] Sound effects not implemented
- [ ] Save game versioning not implemented

---

## File Size Guidelines

To prevent context overload:
- Components: < 200 lines each
- Data files: < 500 lines each (split if larger)
- App.jsx: < 150 lines
- CSS: Can be larger (split if >500 lines)
