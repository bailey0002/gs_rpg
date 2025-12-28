# Grey Stratum UI Prototype

A sci-fi RPG game interface prototype built with React.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Features

- **Character Card Panel** - Displays hero stats (PHY/INT/DEF), HP/XP bars, traits, gear, and provenance history
- **Narrative Panel** - Story text with action choices and skill check indicators
- **Mission Log** - Running record of player choices and check outcomes
- **Skill Check System** - Simulated dice rolls presented as "system calculations"

## How Skill Checks Work

When you select an action with a skill check:
- The system rolls a d6 and adds your relevant stat (PHY or INT)
- Target = Difficulty + 6
- Success if total >= target

Example: INT check, Difficulty 4
- Your INT: 3
- Roll: 5
- Total: 8 vs Target: 10
- Result: FAILURE

## Project Structure

```
grey-stratum-ui/
├── public/
│   └── index.html
├── src/
│   ├── index.js          # React entry point
│   └── GreyStratumUI.jsx # Main game component
├── package.json
└── README.md
```

## Next Steps

- Add actual card artwork
- Implement quest progression (story nodes)
- Add inventory management
- Implement save/load functionality
- Add character evolution system
- Build trading/provenance validation

## Tech Stack

- React 18
- CSS-in-JS (embedded styles)
- Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
