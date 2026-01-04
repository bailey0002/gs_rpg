Add these files to your repo (case-sensitive paths):

1) Create folder: src/components/
2) Add:
   - src/components/HUDBar.jsx
   - src/components/DecisionPulse.jsx
   - src/components/OutcomeToast.jsx

3) If your App.jsx imports are:
     import HUDBar from "./components/HUDBar.jsx";
     import DecisionPulse from "./components/DecisionPulse.jsx";
     import OutcomeToast from "./components/OutcomeToast.jsx";
   then no further change is required.

4) Optional styling:
   - Copy the contents of src/GameUI.css from this package into your existing stylesheet,
     OR append the section labeled "HUD + DecisionPulse + OutcomeToast" to your current GameUI.css.

Notes:
- Linux builds are case-sensitive. Ensure folder name is exactly "components" and filenames match exactly.
