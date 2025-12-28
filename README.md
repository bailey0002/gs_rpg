# Grey Stratum v1.0

A sci-fi text RPG with character persistence, evolution, and provenance tracking.

## Features

- **6 Character Classes**: Space Knight, Tech Runner, Vanguard, Medic, Scout, Engineer
- **Full Quest**: "The Silent Station" - ~15-20 branching story nodes
- **Skill Checks**: PHY/INT/DEF stats with d6 + stat vs difficulty
- **Combat System**: Turn-based resolution with HP tracking
- **Character Persistence**: Saved to localStorage
- **Provenance Logging**: All major events recorded to character history
- **Evolution Ready**: XP system with level thresholds

## Quick Start

```bash
npm install
npm start
```

Opens at http://localhost:3000

## Deploy to Azure Static Web Apps

1. Push this folder to GitHub
2. Azure Portal → Create Static Web App
3. Connect to your GitHub repo
4. Build settings:
   - App location: `/`
   - Output location: `build`
5. Deploy!

## Game Flow

1. **Create Character** - Pick class, name your character
2. **Start Mission** - Play through "The Silent Station"
3. **Make Choices** - Branch the story with your decisions
4. **Pass Checks** - Roll dice for skill challenges
5. **Win Combat** - Fight enemies with PHY vs DEF
6. **Earn XP** - Build toward evolution
7. **Track History** - Provenance logs all major events

## Character Classes

| Class | PHY | INT | DEF | HP | Specialty |
|-------|-----|-----|-----|----|----|
| Space Knight | 4 | 2 | 3 | 12 | Balanced |
| Tech Runner | 2 | 5 | 2 | 10 | Hacking |
| Vanguard | 5 | 2 | 4 | 14 | Tank |
| Medic | 3 | 4 | 2 | 11 | Healing |
| Scout | 3 | 3 | 3 | 10 | Stealth |
| Engineer | 2 | 5 | 2 | 10 | Tech |

## Next Development

- [ ] More quests
- [ ] Evolution UI (level-up choices)
- [ ] Inventory management
- [ ] Trading system
- [ ] Backend persistence (Cosmos DB)
- [ ] Multiplayer

## Tech Stack

- React 18
- CSS-in-JS
- localStorage for persistence
- Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
