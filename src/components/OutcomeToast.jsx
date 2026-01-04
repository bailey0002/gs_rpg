import React, { useEffect, useRef } from "react";

export default function OutcomeToast({
  kind = "amber",
  title = "OUTCOME",
  lines = [],
  onDone,
  durationMs = 2600,
}) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const t = window.setTimeout(() => doneRef.current?.(), Math.max(800, durationMs || 2600));
    return () => window.clearTimeout(t);
  }, [durationMs]);

  return (
    <div className={kind ? `toast ${kind}` : "toast"} role="status" aria-live="polite">
      <div className="toast-title">{title}</div>
      <div className="toast-lines">
        {(lines || []).filter(Boolean).slice(0, 4).map((ln, idx) => (
          <div key={idx} className="toast-line">{ln}</div>
        ))}
      </div>
      <button className="toast-ack" onClick={() => onDone?.()}>Acknowledge</button>
    </div>
  );
}
