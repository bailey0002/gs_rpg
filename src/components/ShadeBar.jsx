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
        <div className="shade-bar-labels">
          <span className="shade-bar-label-left">VOID</span>
          <span className="shade-bar-label-center">{getLabel()}</span>
          <span className="shade-bar-label-right">LUMINOUS</span>
        </div>
      )}
      
      <div className="shade-bar-track">
        {/* Gradient background */}
        <div className="shade-bar-gradient" />
        
        {/* Center marker (0) */}
        <div className="shade-bar-center" />
        
        {/* Current position marker */}
        <div 
          className={`shade-bar-marker ${getColorClass()}`}
          style={{ left: `${position}%` }}
        >
          <span className="shade-bar-marker-value">
            {clampedValue > 0 ? '+' : ''}{clampedValue}
          </span>
        </div>
      </div>
      
      {/* Tick marks */}
      <div className="shade-bar-ticks">
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
