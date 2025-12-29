# Grey Stratum — Session Starter Template

**Copy and customize this for each new session.**

---

## Session: [DATE]

### What I Want to Work On

[Describe your goal in 1-3 sentences]

**Examples:**
- "Add a new character class called Infiltrator"
- "Fix the Shade bar not updating after choices"
- "Create Act 2 story content for the Midway"

---

### Files Likely Involved

[List the files you think need changes, or write "unsure"]

| File | Reason |
|------|--------|
| `src/components/X.jsx` | [what needs to change] |
| `src/data/Y.js` | [what needs to change] |

---

### Context From Previous Sessions

[Note anything relevant from recent work]

- Last session date: 
- What was completed:
- Any unresolved issues:

---

### My Constraints

- [ ] This is a quick fix (< 30 min)
- [ ] This is a feature addition (may need multiple files)
- [ ] This is a restructure (confirm before proceeding)

---

## For Claude

**Before making changes:**
1. Read `PROJECT_MANIFEST.md` if you need feature context
2. Read only the specific files I've listed (or identify which ones you need)
3. Propose approach before modifying

**When modifying:**
- Use `str_replace` for surgical edits
- Only regenerate full files if restructuring
- Keep components under 200 lines

**After modifying:**
- List all files changed
- Run through `INTEGRITY_CHECKLIST.md` mentally
- Provide git commands for deployment

---

## Quick Reference

**Class IDs:** sentinel, void-stalker, oracle, vanguard, forger, cleric

**Portrait paths:** `/character-images/{class}/{prefix}{n}.jpg`

**Stats:** PHY, INT, DEF, HP, MANA

**Shade:** -10 (Void) to +10 (Luminous)

**Key files:**
- Orchestrator: `src/App.jsx`
- Characters: `src/data/classes/classLibrary.js`
- Story: `src/data/acts/act1_circuit.js`
- Engine: `src/engine/game_engine.js`

---

*Delete everything above the "Session:" line when you paste into Claude.*
