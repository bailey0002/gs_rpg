import React, { useEffect } from "react";

export default function DecisionPulse({
  isOpen,
  prompt = "",
  options = [],
  onChoose,
  onDismiss,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onDismiss?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="decisionpulse-backdrop" role="dialog" aria-modal="true">
      <div className="decisionpulse-card">
        <div className="decisionpulse-header">
          <div className="decisionpulse-title">DECISION PULSE</div>
          <button className="decisionpulse-x" onClick={onDismiss} aria-label="Close decision pulse">
            ×
          </button>
        </div>

        <div className="decisionpulse-prompt">{prompt}</div>

        <div className="decisionpulse-options">
          {(options || []).map((opt) => (
            <button
              key={opt.id || opt.label}
              className={`decisionpulse-option ${opt.kind || ""}`}
              onClick={() => onChoose?.(opt)}
            >
              <div className="decisionpulse-option-label">{opt.label}</div>
              <div className="decisionpulse-option-impact">{opt.impact}</div>
            </button>
          ))}
        </div>

        <div className="decisionpulse-footer">
          <button className="decisionpulse-dismiss" onClick={onDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
