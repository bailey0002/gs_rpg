import React, { useEffect } from "react";

export default function OutcomeToast({ kind = "amber", title = "OUTCOME", lines = [], onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`outcometoast ${kind}`} role="status" aria-label="Outcome">
      <div className="outcometoast-title">{title}</div>
      <div className="outcometoast-lines">
        {(lines || []).filter(Boolean).map((l, i) => (
          <div key={i} className="outcometoast-line">{l}</div>
        ))}
      </div>
    </div>
  );
}
