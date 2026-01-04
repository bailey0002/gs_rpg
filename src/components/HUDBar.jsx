import React from "react";

const clamp = (n, min = 0, max = 4) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));

const Pip = ({ on }) => (
  <span
    className={on ? "hud-pip on" : "hud-pip"}
    aria-hidden="true"
  />
);

export default function HUDBar({ threat = 0, intel = 0, tempo = 0, comms = "SECURE" }) {
  const t = clamp(threat);
  const i = clamp(intel);
  const p = clamp(tempo);

  return (
    <div className="hud-bar" role="region" aria-label="HUD">
      <div className="hud-item">
        <div className="hud-label">THREAT</div>
        <div className="hud-pips" aria-label={`Threat ${t} of 4`}>
          {[1,2,3,4].map((k) => <Pip key={k} on={k <= t} />)}
        </div>
      </div>

      <div className="hud-item">
        <div className="hud-label">INTEL</div>
        <div className="hud-pips" aria-label={`Intel ${i} of 4`}>
          {[1,2,3,4].map((k) => <Pip key={k} on={k <= i} />)}
        </div>
      </div>

      <div className="hud-item">
        <div className="hud-label">TEMPO</div>
        <div className="hud-pips" aria-label={`Tempo ${p} of 4`}>
          {[1,2,3,4].map((k) => <Pip key={k} on={k <= p} />)}
        </div>
      </div>

      <div className="hud-comms" aria-label={`Comms ${comms}`}>
        <span className="hud-comms-label">COMMS</span>
        <span className="hud-comms-value">{String(comms || "SECURE")}</span>
      </div>
    </div>
  );
}
