# Grey Stratum

**Sci-fi RPG with Shade Morality System**

A text adventure RPG set in an underground megastructure, featuring:
- **Shade System**: Moral alignment from -10 (Void) to +10 (Luminous)
- **6 Character Classes**: Each with unique abilities and story options
- **Branching Narrative**: Choices affect relationships, factions, and endings
- **Classic Adventure Commands**: LOOK, GET, INVENTORY, BACK, HELP

## Quick Start

```bash
npm install
npm run dev
```

## Architecture

This project uses a modular architecture to prevent feature loss during modifications:

```
src/
├── App.jsx              # Main orchestrator (< 150 lines)
├── components/          # UI components (< 200 lines each)
├── data/               # Static data (classes, items, story)
├── engine/             # Game logic
└── styles/             # CSS
```

## Development Guidelines

1. **Read `PROJECT_MANIFEST.md`** before making changes
2. **Use `INTEGRITY_CHECKLIST.md`** after modifications
3. **Keep files small** — split if > 200 lines
4. **Use `str_replace`** for surgical edits when possible

## Character Classes

| Class | Role | Key Stat |
|-------|------|----------|
| Sentinel | Frontline Guardian | DEF |
| Void Stalker | Shadow Assassin | PHY |
| Oracle | Reality Manipulator | INT |
| Vanguard | Tech Warrior | Balanced |
| Forger | Combat Engineer | PHY |
| Cleric | Shade Healer | INT |

## Deployment

Deployed via Azure Static Web Apps with GitHub integration.

```bash
git add .
git commit -m "Update description"
git push
```

## Credits

- Character portraits generated with Grok
- Story architecture inspired by Colossal Cave Adventure and Zork
