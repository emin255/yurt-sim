# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start frontend dev server (port 3000)
npm start

# Start NPC AI backend server (port 3001) - required for NPC dialogue
node server.js

# Build for production
npm run build

# Run tests
npm test
```

The frontend and backend must run simultaneously for full functionality. The backend requires `REACT_APP_ANTHROPIC_API_KEY` in `.env.local`.

## Architecture

**Yurt Sim** is a web-based dormitory RPG simulation. Players manage a character's stats (academic, health, social, energy, money) through a pixel-art campus with multiple rooms, NPC interactions, mini-games, and random events.

### Core State: `src/hooks/useOyun.js`
Central game logic hook managing:
- Stats with hourly decay
- Time progression (day/hour/semester system)
- Event system (~15+ triggered events with branching choices)
- Daily task generation and tracking
- Activity execution (each activity modifies stats)

### Rendering Engine: `src/components/OdaCanvas.js`
HTML5 Canvas-based renderer (~52KB). Handles:
- Room layouts (Yurt Odası, Koridor, Kütüphane, Ortak Alan, Bahçe, Kafeterya, Spor Sahası)
- Character and NPC sprite rendering
- Keyboard input (Arrow/WASD for movement, E for interaction)
- NPC dialogue flow, including calls to the AI backend

### Orchestration: `src/App.js`
Connects `useOyun()` and `useKarakter()` hooks to all UI. Renders the canvas, stats sidebar, modal stack, and manages screen fade transitions during sleep.

### NPC AI Backend: `server.js`
Express server on port 3001. Receives NPC dialogue context and calls Anthropic Claude Haiku API to generate dynamic responses. Endpoint: `POST /api/npc-chat`.

### Character System: `src/hooks/useKarakter.js` + `src/config/characterConfig.js`
Manages character appearance (6 skin tones, 8 hair types, 6 outfits). Asset paths are defined in `characterConfig.js` pointing to `public/assets/MetroCity/`.

### Modal Stack
Modals in `src/components/`: `OlayModal` (random events), `DonemSonuModal` (semester-end evaluation), `UykuSecimModal` (sleep duration), `KarakterOzellistirme` (character creator), `MiniOyun` (mini-game wrapper).

### Mini-Games
`src/components/GarsonlukOyunu.js` (waiter game) is the primary implemented mini-game. `MiniOyun.js` wraps all mini-game types (memory, coding, cleaning, party).

## Key Conventions

- **Language**: UI text and variable names are in Turkish (e.g., `saglik` = health, `para` = money, `enerji` = energy, `akademik` = academic, `sosyal` = social)
- **Styling**: Mix of `index.css` global styles and inline styles. Dark pixel-art theme with "Press Start 2P" Google Font.
- **State**: All game state flows through `useOyun` hook; character appearance state flows through `useKarakter`. No Redux or external state library.
- **Canvas rendering**: `OdaCanvas` uses direct canvas draw calls, not React elements, for the game world.
