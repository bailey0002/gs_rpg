import React, { useEffect } from "react";

export default function DecisionPulse({
  isOpen = false,
  prompt = "",
  options = [],
  onChoose,
  onDismiss,
}) {
  // ESC to close
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
    <div className="pulse-overlay" role="dialog" aria-modal="true" aria-label="Decision">
      <div className="pulse-panel">
        <div className="pulse-header">
          <div className="pulse-title">DECISION PULSE</div>
          <button className="pulse-close" onClick={() => onDismiss?.()} aria-label="Close">×</button>
        </div>

        {prompt ? <div className="pulse-prompt">{prompt}</div> : null}

        <div className="pulse-options">
          {(options || []).map((opt) => (
            <button
              key={opt?.id || opt?.label}
              className={opt?.kind ? `pulse-option ${opt.kind}` : "pulse-option"}
              onClick={() => onChoose?.(opt)}
            >
              <div className="pulse-option-label">{opt?.label || "Option"}</div>
              {opt?.impact ? <div className="pulse-option-impact">{opt.impact}</div> : null}
            </button>
          ))}
        </div>

        <div className="pulse-footer">
          <button className="pulse-dismiss" onClick={() => onDismiss?.()}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
