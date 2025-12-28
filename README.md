# Grey Stratum v1.1

Sci-fi text RPG with visual character creator and quest system.

## New in v1.1: Character Creator

- **Visual character builder** with SVG-based layered assets
- Pick class, gender, face, helmet, shoulders, weapon
- Customize armor colors, accent, visor, skin tone
- Choose background scene
- Randomize button for quick generation
- **Exports PNG** portrait to character card

## Features

- 6 character classes with unique stats
- Full branching quest: "The Silent Station"
- Skill checks (PHY/INT vs difficulty)
- Turn-based combat
- XP and provenance tracking
- localStorage persistence

## Quick Start

```bash
npm install
npm start
```

## Deploy to Azure

Push to GitHub → Azure Static Web Apps auto-deploys.

Build settings:
- App location: `/`
- Output: `build`

## Character Creator Flow

1. Select class (determines base stats)
2. Choose gender and face type
3. Pick helmet, shoulders, weapon
4. Customize colors (armor, accent, visor, skin)
5. Select background scene
6. Enter name → CREATE

The generated portrait becomes your character card image.

## Classes

| Class | PHY | INT | DEF | HP |
|-------|-----|-----|-----|----|
| Space Knight | 4 | 2 | 3 | 12 |
| Tech Runner | 2 | 5 | 2 | 10 |
| Vanguard | 5 | 2 | 4 | 14 |
| Medic | 3 | 4 | 2 | 11 |
| Scout | 3 | 3 | 3 | 10 |
| Engineer | 2 | 5 | 2 | 10 |

## Asset System

Characters are built from layered SVG components:
- Base body (class + gender specific)
- Face (3 variants per gender)
- Helmet (6 options)
- Shoulders (5 options)
- Weapon (6 options)
- Background (5 scenes)
- Color palettes for customization

All rendering happens client-side. PNG export via Canvas API.
