// =============================================================================
// GREY STRATUM — SHADE BAR
// /src/components/ShadeBar.jsx
// =============================================================================
// Visual indicator for Shade alignment (-10 to +10).

import React from 'react';

const ShadeBar = ({ value = 0, showLabels = true, size = 'normal' }) => {
  // Clamp value to valid range
  const clampedValue = Math.max(-10, Math.min(10, value));
  
  // Calculate position (0% = -10, 50% = 0, 100% = +10)
  const position = ((clampedValue + 10) / 20) * 100;
  
  // Determine label based on value
  const getLabel = () => {
    if (clampedValue <= -7) return 'Void Touched';
    if (clampedValue <= -3) return 'Shadow Aligned';
    if (clampedValue < 3) return 'Balanced';
    if (clampedValue < 7) return 'Light Aligned';
    return 'Luminous';
  };
  
  // Determine color class based on value
  const getColorClass = () => {
    if (clampedValue <= -7) return 'void';
    if (clampedValue <= -3) return 'shadow';
    if (clampedValue < 3) return 'balanced';
    if (clampedValue < 7) return 'light';
    return 'luminous';
  };

  return (
    <div className={`shade-bar ${size}`}>
      {showLabels && (
        <div className="shade-labels">
          <span className="shade-label-left">VOID</span>
          <span className="shade-label-center">{getLabel()}</span>
          <span className="shade-label-right">LUMINOUS</span>
        </div>
      )}
      
      <div className="shade-track">
        {/* Gradient background */}
        <div className="shade-gradient" />
        
        {/* Center marker (0) */}
        <div className="shade-center-mark" />
        
        {/* Current position marker */}
        <div 
          className={`shade-marker ${getColorClass()}`}
          style={{ left: `${position}%` }}
        >
          <span className="shade-marker-value">
            {clampedValue > 0 ? '+' : ''}{clampedValue}
          </span>
        </div>
      </div>
      
      {/* Tick marks */}
      <div className="shade-ticks">
        <span>-10</span>
        <span>-5</span>
        <span>0</span>
        <span>+5</span>
        <span>+10</span>
      </div>
    </div>
  );
};

export default ShadeBar;
