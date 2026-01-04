import React from "react";

function Meter({ label, value = 0 }) {
  const blocks = Array.from({ length: 4 }, (_, i) => i < value);
  return (
    <div className="hud-meter">
      <div className="hud-meter-label">{label}</div>
      <div className="hud-meter-bars" aria-label={`${label} ${value}/4`}>
        {blocks.map((on, idx) => (
          <span key={idx} className={`hud-bar ${on ? "on" : ""}`} />
        ))}
      </div>
    </div>
  );
}

export default function HUDBar({ threat = 0, intel = 0, tempo = 0, comms = "SECURE" }) {
  return (
    <div className="hudbar" role="status" aria-label="Operational HUD">
      <div className="hud-left">
        <Meter label="THREAT" value={threat} />
        <Meter label="INTEL" value={intel} />
        <Meter label="TEMPO" value={tempo} />
      </div>
      <div className="hud-right">
        <div className="hud-comms-label">COMMS</div>
        <div className="hud-comms">{comms}</div>
      </div>
    </div>
  );
}
