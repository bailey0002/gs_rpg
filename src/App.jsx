import React, { useState, useCallback, useEffect } from 'react';

// =============================================================================
// SVG ASSET COMPONENTS (Simplified for cleaner code)
// =============================================================================

const createSVGCharacter = (config) => {
  const { colors } = config;
  
  const backgrounds = {
    'corridor': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:#0a0a15"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><path d="M0 50 L80 100 L80 350 L0 400" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.3"/><path d="M320 50 L240 100 L240 350 L320 400" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.3"/><ellipse cx="100" cy="380" rx="30" ry="8" fill="${colors.accent}" opacity="0.2"/><ellipse cx="220" cy="380" rx="30" ry="8" fill="${colors.accent}" opacity="0.2"/>`,
    'station': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#12122a"/><stop offset="100%" style="stop-color:#1a0a1a"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><rect x="20" y="30" width="80" height="60" rx="5" fill="#000010" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/><circle cx="45" cy="55" r="3" fill="${colors.accent}" opacity="0.3"/><rect x="250" y="100" width="50" height="80" fill="#1a1a30" stroke="${colors.accent}" stroke-width="1" opacity="0.4"/>`,
    'space': `<rect width="320" height="400" fill="#050510"/><circle cx="30" cy="40" r="1" fill="white" opacity="0.8"/><circle cx="80" cy="70" r="1.5" fill="white" opacity="0.6"/><circle cx="150" cy="30" r="1" fill="white" opacity="0.9"/><circle cx="200" cy="60" r="1" fill="white" opacity="0.5"/><circle cx="280" cy="45" r="1.5" fill="white" opacity="0.7"/><circle cx="50" cy="120" r="1" fill="white" opacity="0.4"/><circle cx="290" cy="150" r="1" fill="white" opacity="0.6"/><circle cx="20" cy="200" r="1" fill="${colors.accent}" opacity="0.8"/><ellipse cx="250" cy="80" rx="80" ry="50" fill="${colors.accent}" opacity="0.05"/>`,
    'planet': `<defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#1a0a2e"/><stop offset="60%" style="stop-color:#2a1a3e"/><stop offset="100%" style="stop-color:#3a2520"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><circle cx="260" cy="80" r="40" fill="#3a2a4a" opacity="0.6"/><ellipse cx="260" cy="80" rx="40" ry="8" fill="${colors.accent}" opacity="0.2"/><path d="M0 350 Q80 330 160 345 Q240 360 320 340 L320 400 L0 400 Z" fill="#2a1a1a" opacity="0.8"/>`,
    'abstract': `<rect width="320" height="400" fill="#0a0a15"/><polygon points="0,0 100,0 50,80" fill="${colors.accent}" opacity="0.1"/><polygon points="320,400 220,400 270,320" fill="${colors.accent}" opacity="0.1"/><circle cx="280" cy="60" r="40" fill="${colors.accent}" opacity="0.05"/><path d="M0 200 L320 180" stroke="${colors.accent}" stroke-width="1" opacity="0.2"/>`
  };

  const bodies = {
    'space-knight': { male: `<rect x="145" y="180" width="30" height="25" fill="${colors.skin}"/><path d="M100 205 L105 320 L215 320 L220 205 Q160 195 100 205" fill="${colors.undersuit}"/><path d="M105 210 L110 300 L210 300 L215 210 Q160 200 105 210" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><circle cx="160" cy="240" r="8" fill="${colors.accent}"/><ellipse cx="95" cy="215" rx="25" ry="15" fill="${colors.primary}"/><ellipse cx="225" cy="215" rx="25" ry="15" fill="${colors.primary}"/>`, female: `<rect x="148" y="182" width="24" height="23" fill="${colors.skin}"/><path d="M108 205 L112 315 L208 315 L212 205 Q160 195 108 205" fill="${colors.undersuit}"/><path d="M112 210 L116 295 L204 295 L208 210 Q160 200 112 210" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><circle cx="160" cy="238" r="6" fill="${colors.accent}"/><ellipse cx="100" cy="212" rx="22" ry="13" fill="${colors.primary}"/><ellipse cx="220" cy="212" rx="22" ry="13" fill="${colors.primary}"/>` },
    'tech-runner': { male: `<rect x="147" y="182" width="26" height="23" fill="${colors.skin}"/><path d="M115 205 L118 315 L202 315 L205 205 Q160 198 115 205" fill="${colors.undersuit}"/><path d="M118 208 L120 300 L200 300 L202 208 Q160 202 118 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><path d="M130 220 L130 290 M190 220 L190 290" stroke="${colors.accent}" stroke-width="2" opacity="0.7"/><ellipse cx="105" cy="210" rx="18" ry="12" fill="${colors.primary}"/><ellipse cx="215" cy="210" rx="18" ry="12" fill="${colors.primary}"/>`, female: `<rect x="150" y="184" width="20" height="21" fill="${colors.skin}"/><path d="M120 205 L122 310 L198 310 L200 205 Q160 198 120 205" fill="${colors.undersuit}"/><path d="M122 208 L124 295 L196 295 L198 208 Q160 202 122 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><ellipse cx="110" cy="208" rx="16" ry="10" fill="${colors.primary}"/><ellipse cx="210" cy="208" rx="16" ry="10" fill="${colors.primary}"/>` },
    'vanguard': { male: `<rect x="143" y="178" width="34" height="27" fill="${colors.skin}"/><path d="M90 205 L95 325 L225 325 L230 205 Q160 192 90 205" fill="${colors.undersuit}"/><path d="M95 208 L100 310 L220 310 L225 208 Q160 195 95 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="3"/><rect x="150" y="225" width="20" height="50" fill="${colors.accent}" opacity="0.6"/><ellipse cx="85" cy="215" rx="30" ry="18" fill="${colors.primary}"/><ellipse cx="235" cy="215" rx="30" ry="18" fill="${colors.primary}"/>`, female: `<rect x="146" y="180" width="28" height="25" fill="${colors.skin}"/><path d="M95 205 L100 320 L220 320 L225 205 Q160 195 95 205" fill="${colors.undersuit}"/><path d="M100 208 L105 305 L215 305 L220 208 Q160 198 100 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="3"/><ellipse cx="90" cy="212" rx="26" ry="15" fill="${colors.primary}"/><ellipse cx="230" cy="212" rx="26" ry="15" fill="${colors.primary}"/>` },
    'medic': { male: `<rect x="147" y="182" width="26" height="23" fill="${colors.skin}"/><path d="M112 205 L115 315 L205 315 L208 205 Q160 198 112 205" fill="${colors.undersuit}"/><path d="M115 208 L118 300 L202 300 L205 208 Q160 202 115 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><rect x="152" y="230" width="16" height="40" fill="${colors.accent}"/><rect x="145" y="242" width="30" height="16" fill="${colors.accent}"/><ellipse cx="102" cy="210" rx="20" ry="12" fill="${colors.primary}"/><ellipse cx="218" cy="210" rx="20" ry="12" fill="${colors.primary}"/>`, female: `<rect x="150" y="184" width="20" height="21" fill="${colors.skin}"/><path d="M118 205 L120 310 L200 310 L202 205 Q160 198 118 205" fill="${colors.undersuit}"/><path d="M120 208 L122 295 L198 295 L200 208 Q160 202 120 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><rect x="154" y="232" width="12" height="35" fill="${colors.accent}"/><rect x="148" y="243" width="24" height="13" fill="${colors.accent}"/><ellipse cx="108" cy="208" rx="18" ry="10" fill="${colors.primary}"/><ellipse cx="212" cy="208" rx="18" ry="10" fill="${colors.primary}"/>` },
    'scout': { male: `<rect x="148" y="183" width="24" height="22" fill="${colors.skin}"/><path d="M118 205 L120 312 L200 312 L202 205 Q160 199 118 205" fill="${colors.undersuit}"/><path d="M120 207 L122 298 L198 298 L200 207 Q160 202 120 207" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1" stroke-dasharray="4,2"/><ellipse cx="108" cy="208" rx="17" ry="11" fill="${colors.primary}"/><ellipse cx="212" cy="208" rx="17" ry="11" fill="${colors.primary}"/>`, female: `<rect x="151" y="185" width="18" height="20" fill="${colors.skin}"/><path d="M122 205 L124 308 L196 308 L198 205 Q160 199 122 205" fill="${colors.undersuit}"/><path d="M124 207 L126 294 L194 294 L196 207 Q160 202 124 207" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1" stroke-dasharray="4,2"/><ellipse cx="112" cy="206" rx="15" ry="9" fill="${colors.primary}"/><ellipse cx="208" cy="206" rx="15" ry="9" fill="${colors.primary}"/>` },
    'engineer': { male: `<rect x="147" y="182" width="26" height="23" fill="${colors.skin}"/><path d="M115 205 L118 315 L202 315 L205 205 Q160 198 115 205" fill="${colors.undersuit}"/><path d="M118 208 L120 300 L200 300 L202 208 Q160 202 118 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><path d="M125 215 L125 290 M195 215 L195 290 M125 250 L195 250" stroke="${colors.accent}" stroke-width="3"/><ellipse cx="105" cy="210" rx="18" ry="12" fill="${colors.primary}"/><ellipse cx="215" cy="210" rx="18" ry="12" fill="${colors.primary}"/>`, female: `<rect x="150" y="184" width="20" height="21" fill="${colors.skin}"/><path d="M120 205 L122 310 L198 310 L200 205 Q160 198 120 205" fill="${colors.undersuit}"/><path d="M122 208 L124 295 L196 295 L198 208 Q160 202 122 208" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><path d="M130 215 L130 285 M190 215 L190 285" stroke="${colors.accent}" stroke-width="3"/><ellipse cx="110" cy="208" rx="16" ry="10" fill="${colors.primary}"/><ellipse cx="210" cy="208" rx="16" ry="10" fill="${colors.primary}"/>` }
  };

  const faces = {
    male: {
      'face-1': `<ellipse cx="160" cy="120" rx="45" ry="55" fill="${colors.skin}"/><ellipse cx="145" cy="110" rx="8" ry="5" fill="${colors.eyes}"/><ellipse cx="175" cy="110" rx="8" ry="5" fill="${colors.eyes}"/><path d="M155 130 L165 130" stroke="${colors.skinDark}" stroke-width="2"/><path d="M148 145 Q160 152 172 145" stroke="${colors.skinDark}" stroke-width="2" fill="none"/>`,
      'face-2': `<ellipse cx="160" cy="120" rx="43" ry="52" fill="${colors.skin}"/><rect x="135" y="105" width="18" height="8" rx="2" fill="${colors.eyes}"/><rect x="167" y="105" width="18" height="8" rx="2" fill="${colors.eyes}"/><path d="M155 128 L165 128" stroke="${colors.skinDark}" stroke-width="3"/><path d="M175 95 L185 125" stroke="${colors.skinDark}" stroke-width="2" opacity="0.5"/>`,
      'face-3': `<ellipse cx="160" cy="118" rx="47" ry="58" fill="${colors.skin}"/><ellipse cx="143" cy="108" rx="10" ry="6" fill="${colors.eyes}"/><ellipse cx="177" cy="108" rx="10" ry="6" fill="${colors.eyes}"/><path d="M152 130 L168 130" stroke="${colors.skinDark}" stroke-width="2"/><ellipse cx="160" cy="155" rx="25" ry="15" fill="${colors.skinDark}" opacity="0.3"/>`
    },
    female: {
      'face-1': `<ellipse cx="160" cy="118" rx="42" ry="52" fill="${colors.skin}"/><ellipse cx="146" cy="108" rx="9" ry="6" fill="${colors.eyes}"/><ellipse cx="174" cy="108" rx="9" ry="6" fill="${colors.eyes}"/><path d="M156 128 L164 128" stroke="${colors.skinDark}" stroke-width="2"/><path d="M150 145 Q160 150 170 145" stroke="${colors.skinDark}" stroke-width="2" fill="none"/>`,
      'face-2': `<ellipse cx="160" cy="116" rx="40" ry="50" fill="${colors.skin}"/><ellipse cx="147" cy="106" rx="8" ry="5" fill="${colors.eyes}"/><ellipse cx="173" cy="106" rx="8" ry="5" fill="${colors.eyes}"/><path d="M157 125 L163 125" stroke="${colors.skinDark}" stroke-width="2"/><circle cx="175" cy="130" r="2" fill="${colors.skinDark}"/>`,
      'face-3': `<ellipse cx="160" cy="117" rx="41" ry="51" fill="${colors.skin}"/><path d="M140 105 L152 108 L140 111 M180 105 L168 108 L180 111" stroke="${colors.eyes}" stroke-width="3" fill="none"/><path d="M156 126 L164 126" stroke="${colors.skinDark}" stroke-width="2"/><path d="M120 110 L135 110 M185 110 L200 110" stroke="${colors.accent}" stroke-width="2"/>`
    }
  };

  const helmets = {
    'none': '',
    'visor': `<path d="M110 60 Q160 40 210 60 L215 130 Q160 145 105 130 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><path d="M120 85 Q160 75 200 85 L198 125 Q160 135 122 125 Z" fill="${colors.visor}" opacity="0.8"/><path d="M125 90 Q160 82 195 90" stroke="${colors.visorShine}" stroke-width="2" opacity="0.5"/>`,
    'full-helm': `<path d="M105 55 Q160 30 215 55 L220 160 Q160 175 100 160 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><path d="M115 80 Q160 65 205 80 L203 140 Q160 155 117 140 Z" fill="${colors.visor}" opacity="0.9"/><rect x="108" y="145" width="20" height="8" fill="${colors.secondary}"/><rect x="192" y="145" width="20" height="8" fill="${colors.secondary}"/><path d="M160 35 L160 75" stroke="${colors.accent}" stroke-width="4"/>`,
    'recon': `<path d="M112 58 Q160 42 208 58 L212 145 Q160 158 108 145 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><ellipse cx="140" cy="100" rx="22" ry="18" fill="${colors.visor}" opacity="0.9"/><ellipse cx="180" cy="100" rx="22" ry="18" fill="${colors.visor}" opacity="0.9"/><circle cx="140" cy="100" r="8" fill="${colors.visorShine}" opacity="0.3"/><circle cx="180" cy="100" r="8" fill="${colors.visorShine}" opacity="0.3"/><path d="M205 70 L225 50" stroke="${colors.accent}" stroke-width="2"/><circle cx="228" cy="48" r="4" fill="${colors.accent}"/>`,
    'heavy': `<path d="M95 50 Q160 25 225 50 L230 165 Q160 185 90 165 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="3"/><path d="M110 85 Q160 70 210 85 L208 135 Q160 148 112 135 Z" fill="${colors.visor}" opacity="0.85"/><path d="M95 100 L110 95 L112 140 L95 145 Z" fill="${colors.secondary}"/><path d="M225 100 L210 95 L208 140 L225 145 Z" fill="${colors.secondary}"/><path d="M140 30 L160 20 L180 30 L160 40 Z" fill="${colors.accent}"/>`,
    'tech': `<path d="M115 60 Q160 45 205 60 L208 150 Q160 162 112 150 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><path d="M125 90 Q160 80 195 90 L193 130 Q160 140 127 130 Z" fill="${colors.visor}" opacity="0.9"/><rect x="130" y="95" width="25" height="3" fill="${colors.accent}" opacity="0.7"/><rect x="165" y="95" width="25" height="3" fill="${colors.accent}" opacity="0.7"/><rect x="100" y="90" width="15" height="30" rx="3" fill="${colors.secondary}"/><rect x="205" y="90" width="15" height="30" rx="3" fill="${colors.secondary}"/><circle cx="107" cy="100" r="3" fill="${colors.accent}"/><circle cx="213" cy="100" r="3" fill="${colors.accent}"/>`
  };

  const shoulders = {
    'none': '',
    'light': `<ellipse cx="85" cy="215" rx="28" ry="16" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><ellipse cx="235" cy="215" rx="28" ry="16" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/>`,
    'heavy': `<path d="M55 200 L75 190 L115 200 L115 240 L75 250 L55 240 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><path d="M265 200 L245 190 L205 200 L205 240 L245 250 L265 240 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/>`,
    'asymmetric': `<path d="M50 195 L80 185 L115 200 L115 245 L70 255 L50 240 Z" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><circle cx="70" cy="220" r="8" fill="${colors.secondary}"/><ellipse cx="230" cy="215" rx="25" ry="14" fill="${colors.primary}"/>`,
    'tech-pads': `<rect x="60" y="198" width="50" height="35" rx="5" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><rect x="210" y="198" width="50" height="35" rx="5" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="1"/><rect x="68" y="206" width="12" height="12" fill="${colors.accent}" opacity="0.6"/><rect x="240" y="206" width="12" height="12" fill="${colors.accent}" opacity="0.6"/>`
  };

  const weapons = {
    'none': '',
    'blade': `<rect x="240" y="260" width="8" height="45" rx="2" fill="${colors.weaponHandle}"/><path d="M244 215 L244 260 L248 260 L248 215 L252 200 L240 200 Z" fill="${colors.weaponBlade}"/><rect x="238" y="255" width="12" height="8" rx="1" fill="${colors.accent}"/>`,
    'pistol': `<rect x="235" y="275" width="35" height="18" rx="3" fill="${colors.weaponHandle}"/><rect x="265" y="268" width="20" height="12" rx="2" fill="${colors.weaponHandle}"/><rect x="282" y="270" width="8" height="8" fill="${colors.weaponBlade}"/><circle cx="250" cy="284" r="4" fill="${colors.accent}"/>`,
    'rifle': `<rect x="70" y="250" width="12" height="55" rx="2" fill="${colors.weaponHandle}"/><rect x="65" y="240" width="22" height="20" rx="3" fill="${colors.weaponHandle}"/><rect x="60" y="230" width="32" height="15" rx="2" fill="${colors.weaponBlade}"/><rect x="55" y="233" width="8" height="9" fill="${colors.accent}"/>`,
    'gauntlets': `<ellipse cx="70" cy="295" rx="18" ry="22" fill="${colors.weaponHandle}" stroke="${colors.accent}" stroke-width="2"/><ellipse cx="250" cy="295" rx="18" ry="22" fill="${colors.weaponHandle}" stroke="${colors.accent}" stroke-width="2"/><path d="M60 280 L55 270 M70 278 L70 265 M80 280 L85 270 M240 280 L235 270 M250 278 L250 265 M260 280 L265 270" stroke="${colors.weaponBlade}" stroke-width="3"/>`,
    'tool': `<rect x="235" y="265" width="10" height="40" rx="2" fill="${colors.weaponHandle}"/><path d="M232 260 L248 260 L250 250 L245 240 L240 245 L235 240 L230 250 Z" fill="${colors.weaponBlade}"/><circle cx="240" cy="252" r="3" fill="${colors.accent}"/>`
  };

  const showFace = config.helmet === 'none' || config.helmet === 'visor';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400">
    ${backgrounds[config.background] || backgrounds.corridor}
    ${bodies[config.class]?.[config.gender] || bodies['space-knight'].male}
    ${showFace ? (faces[config.gender]?.[config.face] || faces.male['face-1']) : ''}
    ${helmets[config.helmet] || ''}
    ${shoulders[config.shoulders] || ''}
    ${weapons[config.weapon] || ''}
    <defs><radialGradient id="vignette" cx="50%" cy="50%" r="70%"><stop offset="60%" style="stop-color:transparent"/><stop offset="100%" style="stop-color:rgba(0,0,0,0.6)"/></radialGradient></defs>
    <rect width="320" height="400" fill="url(#vignette)"/>
  </svg>`;
};

// =============================================================================
// COLOR PALETTES
// =============================================================================

const PALETTES = {
  primary: [
    { name: 'Slate', value: '#3a4a6a' },
    { name: 'Gunmetal', value: '#4a4a5a' },
    { name: 'Forest', value: '#3a5a4a' },
    { name: 'Burgundy', value: '#5a3a4a' },
    { name: 'Navy', value: '#2a3a5a' },
    { name: 'Charcoal', value: '#3a3a3a' }
  ],
  accent: [
    { name: 'Cyan', value: '#00f0ff' },
    { name: 'Orange', value: '#ff8800' },
    { name: 'Magenta', value: '#ff00aa' },
    { name: 'Lime', value: '#88ff00' },
    { name: 'Gold', value: '#ffcc00' },
    { name: 'Red', value: '#ff3366' }
  ],
  visor: [
    { name: 'Amber', value: '#ff8800' },
    { name: 'Cyan', value: '#00ccff' },
    { name: 'Red', value: '#ff2200' },
    { name: 'Green', value: '#00ff66' }
  ],
  skin: [
    { name: 'Light', value: '#f0d0b0' },
    { name: 'Medium', value: '#d0a080' },
    { name: 'Tan', value: '#c08060' },
    { name: 'Brown', value: '#8b6040' },
    { name: 'Dark', value: '#5a4030' }
  ]
};

const CLASS_DEFS = {
  'space-knight': { name: 'Space Knight', stats: { phy: 4, int: 2, def: 3 }, hp: 12, gear: ['pulse-blade', 'standard-armor'], traits: [] },
  'tech-runner': { name: 'Tech Runner', stats: { phy: 2, int: 5, def: 2 }, hp: 10, gear: ['hack-tool', 'light-vest'], traits: [] },
  'vanguard': { name: 'Vanguard', stats: { phy: 5, int: 2, def: 4 }, hp: 14, gear: ['heavy-gauntlets', 'plated-armor'], traits: [] },
  'medic': { name: 'Medic', stats: { phy: 3, int: 4, def: 2 }, hp: 11, gear: ['med-kit', 'sidearm'], traits: ['field-medicine'] },
  'scout': { name: 'Scout', stats: { phy: 3, int: 3, def: 3 }, hp: 10, gear: ['scanner', 'combat-knife'], traits: ['eagle-eye'] },
  'engineer': { name: 'Engineer', stats: { phy: 2, int: 5, def: 2 }, hp: 10, gear: ['repair-tool', 'drone-companion'], traits: ['jury-rig'] }
};

// =============================================================================
// CHARACTER CREATOR COMPONENT
// =============================================================================

function CharacterCreator({ onComplete, onCancel }) {
  const [config, setConfig] = useState({
    class: 'space-knight',
    gender: 'male',
    face: 'face-1',
    helmet: 'visor',
    shoulders: 'light',
    weapon: 'blade',
    background: 'corridor',
    colors: {
      primary: '#3a4a6a',
      secondary: '#2a3a4a',
      accent: '#00f0ff',
      visor: '#ff8800',
      visorShine: '#ffffff',
      skin: '#f0d0b0',
      skinDark: '#c0a080',
      eyes: '#304050',
      undersuit: '#1a1a2a',
      weaponHandle: '#2a2a3a',
      weaponBlade: '#a0b0c0'
    }
  });
  const [name, setName] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const svg = createSVGCharacter(config);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [config]);

  const updateConfig = (key, value) => setConfig(p => ({ ...p, [key]: value }));
  const updateColor = (key, value) => setConfig(p => ({ ...p, colors: { ...p.colors, [key]: value } }));

  const randomize = () => {
    const rand = arr => arr[Math.floor(Math.random() * arr.length)];
    setConfig(p => ({
      ...p,
      class: rand(Object.keys(CLASS_DEFS)),
      gender: rand(['male', 'female']),
      face: rand(['face-1', 'face-2', 'face-3']),
      helmet: rand(['none', 'visor', 'full-helm', 'recon', 'heavy', 'tech']),
      shoulders: rand(['none', 'light', 'heavy', 'asymmetric', 'tech-pads']),
      weapon: rand(['none', 'blade', 'pistol', 'rifle', 'gauntlets', 'tool']),
      background: rand(['corridor', 'station', 'space', 'planet', 'abstract']),
      colors: {
        ...p.colors,
        primary: rand(PALETTES.primary).value,
        accent: rand(PALETTES.accent).value,
        visor: rand(PALETTES.visor).value,
        skin: rand(PALETTES.skin).value
      }
    }));
  };

  const exportPNG = async () => {
    return new Promise(resolve => {
      const svg = createSVGCharacter(config);
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    const portraitUrl = await exportPNG();
    onComplete({ name: name.trim(), class: config.class, portraitUrl, config });
  };

  const cls = CLASS_DEFS[config.class];

  return (
    <div className="creator">
      <div className="creator-header">
        <h1>CREATE OPERATIVE</h1>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="creator-body">
        <div className="preview-panel">
          <div className="preview-frame">
            {preview && <img src={preview} alt="Preview" />}
          </div>
          <div className="preview-stats">
            <span>PHY {cls.stats.phy}</span>
            <span>INT {cls.stats.int}</span>
            <span>DEF {cls.stats.def}</span>
            <span>HP {cls.hp}</span>
          </div>
          <button className="rand-btn" onClick={randomize}>🎲 RANDOMIZE</button>
        </div>
        <div className="options-panel">
          <div className="opt-group">
            <label>CLASS</label>
            <select value={config.class} onChange={e => updateConfig('class', e.target.value)}>
              {Object.entries(CLASS_DEFS).map(([id, c]) => <option key={id} value={id}>{c.name}</option>)}
            </select>
          </div>
          <div className="opt-group">
            <label>GENDER</label>
            <select value={config.gender} onChange={e => updateConfig('gender', e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="opt-section">APPEARANCE</div>
          <div className="opt-group">
            <label>FACE</label>
            <select value={config.face} onChange={e => updateConfig('face', e.target.value)}>
              <option value="face-1">Type 1</option>
              <option value="face-2">Type 2</option>
              <option value="face-3">Type 3</option>
            </select>
          </div>
          <div className="opt-group">
            <label>HELMET</label>
            <select value={config.helmet} onChange={e => updateConfig('helmet', e.target.value)}>
              <option value="none">None</option>
              <option value="visor">Visor</option>
              <option value="full-helm">Full Helm</option>
              <option value="recon">Recon</option>
              <option value="heavy">Heavy</option>
              <option value="tech">Tech</option>
            </select>
          </div>
          <div className="opt-group">
            <label>SHOULDERS</label>
            <select value={config.shoulders} onChange={e => updateConfig('shoulders', e.target.value)}>
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="heavy">Heavy</option>
              <option value="asymmetric">Asymmetric</option>
              <option value="tech-pads">Tech</option>
            </select>
          </div>
          <div className="opt-group">
            <label>WEAPON</label>
            <select value={config.weapon} onChange={e => updateConfig('weapon', e.target.value)}>
              <option value="none">None</option>
              <option value="blade">Blade</option>
              <option value="pistol">Pistol</option>
              <option value="rifle">Rifle</option>
              <option value="gauntlets">Gauntlets</option>
              <option value="tool">Tool</option>
            </select>
          </div>
          <div className="opt-section">COLORS</div>
          <div className="color-row">
            <label>ARMOR</label>
            <div className="swatches">{PALETTES.primary.map(c => <button key={c.value} className={`swatch ${config.colors.primary === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('primary', c.value)} />)}</div>
          </div>
          <div className="color-row">
            <label>ACCENT</label>
            <div className="swatches">{PALETTES.accent.map(c => <button key={c.value} className={`swatch ${config.colors.accent === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('accent', c.value)} />)}</div>
          </div>
          <div className="color-row">
            <label>VISOR</label>
            <div className="swatches">{PALETTES.visor.map(c => <button key={c.value} className={`swatch ${config.colors.visor === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => updateColor('visor', c.value)} />)}</div>
          </div>
          <div className="color-row">
            <label>SKIN</label>
            <div className="swatches">{PALETTES.skin.map(c => <button key={c.value} className={`swatch ${config.colors.skin === c.value ? 'sel' : ''}`} style={{ background: c.value }} onClick={() => { updateColor('skin', c.value); updateColor('skinDark', c.value.replace(/[0-9a-f]{2}/gi, h => Math.max(0, parseInt(h, 16) - 40).toString(16).padStart(2, '0'))); }} />)}</div>
          </div>
          <div className="opt-section">BACKGROUND</div>
          <div className="opt-group">
            <label>SCENE</label>
            <select value={config.background} onChange={e => updateConfig('background', e.target.value)}>
              <option value="corridor">Corridor</option>
              <option value="station">Station</option>
              <option value="space">Space</option>
              <option value="planet">Planet</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>
        </div>
      </div>
      <div className="creator-footer">
        <input type="text" placeholder="Enter name..." value={name} onChange={e => setName(e.target.value)} />
        <button className="create-btn" onClick={handleCreate} disabled={!name.trim()}>CREATE</button>
      </div>
    </div>
  );
}

// =============================================================================
// QUEST DATA
// =============================================================================

const QUEST = {
  nodes: {
    'start': { type: 'narrative', location: 'SECTOR 7 — APPROACH', text: `Your shuttle cuts through debris surrounding Station Omega-7. Dark except for a blinking light.\n\nThirty years ago—a xenobiology lab. Then silence.\n\nThree days ago: "EXPERIMENT VIABLE. AWAITING RETRIEVAL."\n\nYour mission: Find out why.`, nextNodeId: 'airlock' },
    'airlock': { type: 'choice', location: 'STATION — AIRLOCK', text: `Stale air. Amber emergency lights. Scanner shows faint power signatures deeper in.\n\nMain corridor ahead. Maintenance shaft with fresh scrape marks to the left.\n\nMetal groans in the distance.`, choices: [
      { id: 'a', text: 'Main corridor, weapon ready', nextNodeId: 'corridor-check' },
      { id: 'b', text: 'Maintenance shaft', nextNodeId: 'shaft-check' },
      { id: 'c', text: 'Scan for life signs', nextNodeId: 'scan-check' },
      { id: 'd', text: 'Return to ship', nextNodeId: 'retreat' }
    ]},
    'corridor-check': { type: 'check', text: 'Advancing. Scraping from overhead vent. Something watching.\n\nCombat instincts engage.', checkType: 'phy', difficulty: 3, successNodeId: 'corridor-win', failureNodeId: 'corridor-ambush', successXp: 15 },
    'corridor-win': { type: 'narrative', text: 'Spin and strike. Blade through grate as drone drops—claws miss. It sparks and dies.\n\nContinue forward.', nextNodeId: 'main-lab' },
    'corridor-ambush': { type: 'combat', text: 'Too slow. Drone on your back, claws raking armor. Roll to throw it off.\n\nRed sensors. Feral.', enemy: { name: 'Feral Drone', hp: 6, phy: 2, def: 1 }, victoryNodeId: 'drone-win', defeatNodeId: 'defeat', fleeNodeId: 'main-lab', victoryXp: 25 },
    'drone-win': { type: 'reward', text: 'Drone sparks out. Among parts: intact med-stim.', rewards: [{ type: 'item', itemId: 'med-stim' }], nextNodeId: 'main-lab' },
    'shaft-check': { type: 'check', location: 'MAINTENANCE SHAFT', text: 'Tight space. Tally marks on walls. Junction box—wires rerouted.\n\nCan you trace the modification?', checkType: 'int', difficulty: 3, successNodeId: 'shaft-win', failureNodeId: 'shaft-fail', successXp: 20 },
    'shaft-win': { type: 'narrative', text: 'All power routed to xenobiology lab. And you found a direct path—above the main lab. Drop in from above.', nextNodeId: 'lab-above' },
    'shaft-fail': { type: 'narrative', text: 'Wiring too corrupted. Dead ends. Eventually opens to main corridor.', nextNodeId: 'main-lab' },
    'scan-check': { type: 'check', text: 'Scanner sweeps corridor. Decades of ghosts to filter.\n\nTakes skill to get clear reading.', checkType: 'int', difficulty: 4, successNodeId: 'scan-win', failureNodeId: 'scan-fail', successXp: 15 },
    'scan-win': { type: 'choice', text: 'Three signatures:\n\n• Vent contact—mechanical, erratic. Drone.\n• Main lab—active cryo. Something cold.\n• Secondary lab—organic. Alive.\n\nSomeone else is here.', choices: [
      { id: 'a', text: 'Main lab carefully', nextNodeId: 'main-lab' },
      { id: 'b', text: 'Investigate survivor', nextNodeId: 'survivor' },
      { id: 'c', text: 'Clear drone first', nextNodeId: 'corridor-check' }
    ]},
    'scan-fail': { type: 'narrative', text: 'Static. No clear read. Old-fashioned way.', nextNodeId: 'airlock' },
    'survivor': { type: 'choice', location: 'SECONDARY LAB', text: `Makeshift quarters. Cot, nutrient paste.\n\nGreyed woman, shock prod ready.\n\n"Thirty years containing it. Now they want it back?"\n\n"Cryo failing. When it wakes..." She shakes her head.`, choices: [
      { id: 'a', text: '"What is it?"', nextNodeId: 'tanaka-info' },
      { id: 'b', text: '"Help me destroy it."', nextNodeId: 'tanaka-ally' },
      { id: 'c', text: 'Go to main lab', nextNodeId: 'main-lab' }
    ]},
    'tanaka-info': { type: 'narrative', text: `"Adaptive organism. Found dormant. Wasn't dormant—waiting.\n\nWhen thawed, it integrated. Equipment. Researchers. I reached the bulkheads.\n\nThirty years keeping cryo running. Hours until it wakes. And it remembers everything it absorbed."`, nextNodeId: 'lab-choice' },
    'tanaka-ally': { type: 'reward', text: `Hope in her eyes.\n\n"Overload reactor—vaporize the lab."\n\nShe hands you a keycard. "Control room. I'll start the sequence."`, rewards: [{ type: 'item', itemId: 'keycard' }], nextNodeId: 'lab-choice' },
    'main-lab': { type: 'choice', location: 'MAIN LAB — EXTERIOR', text: 'Through viewport: cryo pod failing. Condensation. Temperature climbing.\n\nDoor controls active.', choices: [
      { id: 'a', text: 'Enter', nextNodeId: 'lab-interior' },
      { id: 'b', text: 'Hack cryo remotely', nextNodeId: 'hack-check' }
    ]},
    'lab-choice': { type: 'choice', location: 'MAIN LAB — EXTERIOR', text: 'Cryo pod failing through viewport.', choices: [
      { id: 'a', text: 'Enter and face it', nextNodeId: 'lab-interior' },
      { id: 'b', text: 'Overload reactor', nextNodeId: 'reactor', requirement: { itemId: 'keycard' } },
      { id: 'c', text: 'Hack cryo', nextNodeId: 'hack-check' }
    ]},
    'lab-above': { type: 'choice', location: 'MAIN LAB — CEILING', text: 'Through grate: cryo pod. Something pressing against glass. Testing.\n\nAlready awake. Waiting.', choices: [
      { id: 'a', text: 'Surprise attack', nextNodeId: 'boss-adv' },
      { id: 'b', text: 'Find another way', nextNodeId: 'lab-choice' }
    ]},
    'hack-check': { type: 'check', text: 'External panel. Reroute power to cryo. System fights back—corrupted code, active resistance.', checkType: 'int', difficulty: 5, successNodeId: 'hack-win', failureNodeId: 'hack-fail', successXp: 25 },
    'hack-win': { type: 'reward', text: 'Cryo stabilizes. Downloaded research logs too.', rewards: [{ type: 'xp', amount: 25 }, { type: 'item', itemId: 'data-chip' }], nextNodeId: 'lab-choice' },
    'hack-fail': { type: 'narrative', text: 'System rejects. Klaxons. Cryo emergency shutdown.\n\nPod opening.', nextNodeId: 'lab-interior' },
    'lab-interior': { type: 'narrative', location: 'MAIN LAB — INTERIOR', text: `Lab preserved. Equipment running.\n\nExcept the bodies.\n\nThree researchers—part of the organism now. Fused with equipment, walls. Biomechanical roots from cryo pod.\n\nPod cracks.\n\nToo many limbs. Too many eyes. Absorbed faces.\n\n"NEW. NEW PATTERNS."`, nextNodeId: 'boss-fight' },
    'reactor': { type: 'choice', location: 'ENGINEERING', text: 'Reactor hums. Enough for a century or instant vaporization.\n\nDisable safeties. Push critical. Three minutes.\n\nYour hand hovers.', choices: [
      { id: 'a', text: 'Initiate overload', nextNodeId: 'victory-destroy' },
      { id: 'b', text: 'Face it directly', nextNodeId: 'boss-fight' }
    ]},
    'boss-adv': { type: 'combat', location: 'MAIN LAB — SURPRISE', text: 'Drop, blade first. Strike through limb before it knows.\n\nThree-voiced scream.', enemy: { name: 'Amalgam (Wounded)', hp: 8, phy: 4, def: 1 }, victoryNodeId: 'victory-combat', defeatNodeId: 'defeat', victoryXp: 40 },
    'boss-fight': { type: 'combat', location: 'MAIN LAB — CONFRONTATION', text: 'Creature flows toward you. Victims\' faces swim across surface.\n\nThirty years absorbing knowledge. It knows how to fight.\n\nSo do you.', enemy: { name: 'The Amalgam', hp: 12, phy: 4, def: 2 }, victoryNodeId: 'victory-combat', defeatNodeId: 'defeat', fleeNodeId: 'reactor', victoryXp: 50 },
    'victory-combat': { type: 'outcome', location: 'AFTERMATH', text: 'Creature collapses. Stolen forms silent.\n\nGather salvageable data. Shuttle pulls away.\n\nYou did your job.\n\nMISSION COMPLETE', outcome: 'victory', xpAwarded: 50 },
    'victory-destroy': { type: 'outcome', location: 'ESCAPE POD', text: 'Overload irreversible. Two minutes.\n\nThrough corridors, past the shambling thing, into pod. Doors seal as it reaches airlock.\n\nStation comes apart. White light. Vaporized.\n\nDr. Tanaka watches with peace.\n\n"Thank you."\n\nMISSION COMPLETE', outcome: 'victory', xpAwarded: 50 },
    'defeat': { type: 'outcome', text: 'You fall. It looms.\n\n"NEW PATTERNS. THANK YOU."\n\nMISSION FAILED\n\nRescued by beacon. Creature escaped.', outcome: 'defeat', xpAwarded: 10 },
    'retreat': { type: 'outcome', location: 'SHUTTLE', text: 'Something wrong. It waited thirty years. Can wait more.\n\nReturn to shuttle.\n\nPulling away—shape in viewport. Watching.\n\nIt waves.\n\nMISSION INCOMPLETE', outcome: 'retreat', xpAwarded: 5 }
  }
};

// =============================================================================
// GAME LOGIC
// =============================================================================

const generateId = () => Math.random().toString(36).substr(2, 9);

function createCharacter(name, classId, portraitUrl) {
  const cls = CLASS_DEFS[classId];
  const now = new Date().toISOString();
  return {
    id: generateId(), name, class: classId, version: '1.0', portraitUrl,
    stats: { ...cls.stats }, hp: { current: cls.hp, max: cls.hp },
    xp: { current: 0, toNextLevel: 100 }, level: 1,
    traits: [...cls.traits], inventory: cls.gear.map(g => ({ itemId: g, quantity: 1 })),
    provenance: [{ id: generateId(), timestamp: now, version: '1.0', eventType: 'created', description: 'Created' }],
    questsCompleted: 0, enemiesDefeated: 0
  };
}

const doCheck = (char, type, diff) => {
  const stat = char.stats[type];
  const roll = Math.floor(Math.random() * 6) + 1;
  const total = stat + roll;
  const target = diff + 6;
  return { stat, roll, total, target, success: total >= target };
};

const doCombat = (char, enemy) => {
  let pHp = char.hp.current, eHp = enemy.hp;
  const rounds = [];
  while (pHp > 0 && eHp > 0 && rounds.length < 10) {
    const pRoll = Math.floor(Math.random() * 6) + 1;
    const pDmg = Math.max(0, char.stats.phy + pRoll - enemy.def);
    eHp -= pDmg;
    let eDmg = 0;
    if (eHp > 0) {
      const eRoll = Math.floor(Math.random() * 6) + 1;
      eDmg = Math.max(0, enemy.phy + eRoll - char.stats.def);
      pHp -= eDmg;
    }
    rounds.push({ pRoll, pDmg, eDmg, pHp, eHp });
  }
  return { rounds, victory: eHp <= 0, pHp, dmgTaken: char.hp.current - pHp };
};

// =============================================================================
// QUEST SCREEN
// =============================================================================

function QuestScreen({ character, setCharacter, onComplete }) {
  const [nodeId, setNodeId] = useState('start');
  const [sysOut, setSysOut] = useState(null);
  const [combat, setCombat] = useState(null);
  const [busy, setBusy] = useState(false);

  const node = QUEST.nodes[nodeId];

  const goTo = async (id) => { setBusy(true); await new Promise(r => setTimeout(r, 300)); setNodeId(id); setSysOut(null); setCombat(null); setBusy(false); };

  const runCheck = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    const res = doCheck(character, n.checkType, n.difficulty);
    setSysOut({ ...res, checkType: n.checkType, difficulty: n.difficulty });
    if (res.success && n.successXp) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + n.successXp } }));
    await new Promise(r => setTimeout(r, 1200));
    setNodeId(res.success ? n.successNodeId : n.failureNodeId);
    setBusy(false);
  };

  const runCombat = async (n) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    const res = doCombat(character, n.enemy);
    setCombat({ enemy: n.enemy, ...res });
    setCharacter(c => ({ ...c, hp: { ...c.hp, current: Math.max(0, res.pHp) } }));
    if (res.victory && n.victoryXp) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + n.victoryXp }, enemiesDefeated: c.enemiesDefeated + 1 }));
    setBusy(false);
  };

  const claimReward = (n) => {
    n.rewards?.forEach(r => {
      if (r.type === 'item') setCharacter(c => ({ ...c, inventory: [...c.inventory, { itemId: r.itemId, quantity: 1 }] }));
      if (r.type === 'xp') setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + r.amount } }));
    });
    goTo(n.nextNodeId);
  };

  const finishQuest = () => {
    if (node.xpAwarded) setCharacter(c => ({ ...c, xp: { ...c.xp, current: c.xp.current + node.xpAwarded } }));
    const prov = { id: generateId(), timestamp: new Date().toISOString(), version: character.version, eventType: node.outcome === 'victory' ? 'quest_completed' : 'quest_failed', description: node.outcome === 'victory' ? 'Completed: Silent Station' : 'Failed: Silent Station' };
    setCharacter(c => ({ ...c, provenance: [...c.provenance, prov], questsCompleted: node.outcome === 'victory' ? c.questsCompleted + 1 : c.questsCompleted }));
    onComplete(node.outcome, node.xpAwarded);
  };

  useEffect(() => {
    if (node.type === 'check' && !sysOut && !busy) runCheck(node);
    if (node.type === 'combat' && !combat && !busy) runCombat(node);
  }, [nodeId]);

  const hasItem = (id) => character.inventory.some(i => i.itemId === id);
  const hpPct = (character.hp.current / character.hp.max) * 100;
  const xpPct = (character.xp.current / character.xp.toNextLevel) * 100;

  return (
    <div className="game-layout">
      <aside className="sidebar">
        <div className="card">
          <div className="card-top"><span>◇ GREY STRATUM</span><span>v{character.version}</span></div>
          {character.portraitUrl ? <img src={character.portraitUrl} alt="" className="portrait" /> : <div className="portrait-placeholder">{CLASS_DEFS[character.class]?.name[0]}</div>}
          <div className="card-name">{character.name}</div>
          <div className="card-class">{CLASS_DEFS[character.class]?.name}</div>
          <div className="bars">
            <div className="bar"><span>HP</span><span>{character.hp.current}/{character.hp.max}</span></div>
            <div className="bar-track"><div className="bar-fill hp" style={{ width: `${hpPct}%`, background: hpPct > 50 ? '#00ff88' : hpPct > 25 ? '#ffaa00' : '#ff3366' }} /></div>
            <div className="bar"><span>XP</span><span>{character.xp.current}/{character.xp.toNextLevel}</span></div>
            <div className="bar-track"><div className="bar-fill xp" style={{ width: `${xpPct}%` }} /></div>
          </div>
          <div className="stats-row">
            <div><span>PHY</span><b>{character.stats.phy}</b></div>
            <div><span>INT</span><b>{character.stats.int}</b></div>
            <div><span>DEF</span><b>{character.stats.def}</b></div>
          </div>
        </div>
      </aside>
      <main className="narrative">
        {node.location && <div className="location">◆ {node.location}</div>}
        <div className="text">{node.text}</div>
        {sysOut && <div className="sys-out"><div className="sys-head">◈ SYSTEM</div><div>{sysOut.checkType.toUpperCase()} CHECK — Diff {sysOut.difficulty}</div><div>Base {sysOut.stat} + Roll {sysOut.roll} = {sysOut.total} vs {sysOut.target}</div><div className={sysOut.success ? 'win' : 'lose'}>{sysOut.success ? '██ SUCCESS ██' : '░░ FAILURE ░░'}</div></div>}
        {combat && <div className="sys-out"><div className="sys-head">◈ COMBAT — {combat.enemy.name}</div><div className="combat-log">{combat.rounds.map((r, i) => <div key={i}>R{i + 1}: You {r.pDmg} dmg, Enemy {r.eDmg} dmg — HP {r.pHp}/{r.eHp}</div>)}</div><div className={combat.victory ? 'win' : 'lose'}>{combat.victory ? '██ VICTORY ██' : '░░ DEFEAT ░░'}</div></div>}
        <div className="choices">
          {node.type === 'choice' && node.choices.map(c => {
            const ok = !c.requirement || hasItem(c.requirement.itemId);
            return <button key={c.id} disabled={busy || !ok} onClick={() => goTo(c.nextNodeId)}><span>[{c.id.toUpperCase()}]</span> {c.text} {c.requirement && !ok && <span className="req">🔒</span>}</button>;
          })}
          {node.type === 'narrative' && <button disabled={busy} onClick={() => goTo(node.nextNodeId)}>Continue...</button>}
          {node.type === 'reward' && <><div className="reward">{node.rewards?.map((r, i) => <div key={i}>+ {r.type === 'item' ? r.itemId : `${r.amount} XP`}</div>)}</div><button disabled={busy} onClick={() => claimReward(node)}>Continue...</button></>}
          {node.type === 'combat' && combat && !busy && (combat.victory ? <button onClick={() => goTo(node.victoryNodeId)}>Continue...</button> : <><button onClick={() => goTo(node.defeatNodeId)}>Accept defeat...</button>{node.fleeNodeId && <button onClick={() => goTo(node.fleeNodeId)}>Flee!</button>}</>)}
          {node.type === 'outcome' && <><div className="xp-award">+{node.xpAwarded} XP</div><button onClick={finishQuest}>Return to Menu</button></>}
        </div>
      </main>
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [character, setCharacter] = useState(null);
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('gs-char');
    if (saved) try { setCharacter(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    if (character) localStorage.setItem('gs-char', JSON.stringify(character));
  }, [character]);

  const handleCreatorDone = (data) => {
    const char = createCharacter(data.name, data.class, data.portraitUrl);
    setCharacter(char);
    setScreen('menu');
  };

  const handleQuestDone = (result, xp) => {
    setOutcome({ result, xp });
    setScreen('outcome');
  };

  return (
    <>
      <style>{appStyles}</style>
      <div className="app">
        <header><div className="brand">GREY STRATUM</div><div className="sub">v2.1</div></header>
        {screen === 'menu' && (
          <div className="menu">
            <h1>GREY STRATUM</h1>
            {character && (
              <div className="menu-card">
                {character.portraitUrl && <img src={character.portraitUrl} alt="" />}
                <div><b>{character.name}</b><br />{CLASS_DEFS[character.class]?.name} Lv{character.level}</div>
              </div>
            )}
            <button onClick={() => setScreen('quest')} disabled={!character}>▸ START MISSION</button>
            <button onClick={() => setScreen('create')}>▸ NEW CHARACTER</button>
          </div>
        )}
        {screen === 'create' && <CharacterCreator onComplete={handleCreatorDone} onCancel={() => setScreen('menu')} />}
        {screen === 'quest' && character && <QuestScreen character={character} setCharacter={setCharacter} onComplete={handleQuestDone} />}
        {screen === 'outcome' && (
          <div className="outcome">
            <h1 className={outcome?.result}>{outcome?.result === 'victory' ? 'MISSION COMPLETE' : outcome?.result === 'defeat' ? 'MISSION FAILED' : 'INCOMPLETE'}</h1>
            <div className="xp">+{outcome?.xp} XP</div>
            <button onClick={() => setScreen('menu')}>Menu</button>
          </div>
        )}
        <footer><span>● ONLINE</span><span>SECTOR 7</span></footer>
      </div>
    </>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const appStyles = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600&family=Share+Tech+Mono&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--panel:#12121a;--card:#1a1a25;--border:#2a2a3a;--cyan:#00f0ff;--amber:#ffaa00;--green:#00ff88;--red:#ff3366;--text:#c0c0d0;--dim:#606080}
body{background:var(--bg);color:var(--text);font-family:'Rajdhani',sans-serif}
.app{min-height:100vh;display:flex;flex-direction:column}
header{padding:.75rem 1.5rem;background:var(--panel);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.brand{font-family:'Orbitron',sans-serif;color:var(--cyan);letter-spacing:.2em}
.sub{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--dim)}
footer{padding:.5rem 1.5rem;background:var(--panel);border-top:1px solid var(--border);display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--dim)}
footer span:first-child::before{content:'';display:inline-block;width:6px;height:6px;background:var(--green);border-radius:50%;margin-right:.4rem}

.menu{max-width:500px;margin:3rem auto;padding:2rem;text-align:center}
.menu h1{font-family:'Orbitron',sans-serif;font-size:1.8rem;color:var(--cyan);letter-spacing:.3em;margin-bottom:2rem}
.menu button{display:block;width:100%;padding:.9rem;margin:.5rem 0;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.8rem;color:var(--text);letter-spacing:.1em;cursor:pointer}
.menu button:hover{border-color:var(--cyan);color:var(--cyan)}
.menu button:disabled{opacity:.4;cursor:not-allowed}
.menu-card{display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--card);border-radius:6px;margin-bottom:1.5rem;text-align:left}
.menu-card img{width:80px;height:100px;object-fit:cover;border-radius:4px}

.outcome{max-width:500px;margin:3rem auto;padding:2rem;text-align:center}
.outcome h1{font-family:'Orbitron',sans-serif;font-size:1.3rem;letter-spacing:.2em;margin-bottom:1rem}
.outcome h1.victory{color:var(--green)}
.outcome h1.defeat{color:var(--red)}
.outcome h1.retreat{color:var(--amber)}
.outcome .xp{font-family:'Share Tech Mono',monospace;color:var(--cyan);margin-bottom:2rem}
.outcome button{padding:.75rem 2rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);cursor:pointer}

.creator{max-width:850px;margin:1rem auto;background:var(--panel);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.creator-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--card);border-bottom:1px solid var(--border)}
.creator-header h1{font-family:'Orbitron',sans-serif;font-size:.9rem;color:var(--cyan);letter-spacing:.15em}
.creator-header button{background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:pointer}
.creator-body{display:grid;grid-template-columns:300px 1fr;gap:1px;background:var(--border)}
.preview-panel{background:var(--bg);padding:1rem;display:flex;flex-direction:column;align-items:center}
.preview-frame{width:240px;height:300px;background:#000;border:2px solid var(--border);border-radius:6px;overflow:hidden}
.preview-frame img{width:100%;height:100%;object-fit:cover}
.preview-stats{display:flex;gap:.75rem;margin-top:.75rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.rand-btn{margin-top:.75rem;padding:.5rem 1rem;background:var(--card);border:1px solid var(--border);border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.65rem;color:var(--dim);cursor:pointer;letter-spacing:.1em}
.rand-btn:hover{color:var(--cyan)}
.options-panel{background:var(--panel);padding:1rem;overflow-y:auto;max-height:420px}
.opt-section{font-family:'Orbitron',sans-serif;font-size:.6rem;color:var(--cyan);letter-spacing:.1em;margin:1rem 0 .5rem;padding-bottom:.3rem;border-bottom:1px solid var(--border)}
.opt-group{margin-bottom:.6rem}
.opt-group label{display:block;font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--dim);letter-spacing:.08em;margin-bottom:.2rem}
.opt-group select{width:100%;padding:.4rem;background:var(--card);border:1px solid var(--border);border-radius:3px;color:var(--text);font-size:.8rem}
.color-row{margin-bottom:.6rem}
.color-row label{display:block;font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--dim);margin-bottom:.3rem}
.swatches{display:flex;gap:.3rem;flex-wrap:wrap}
.swatch{width:24px;height:24px;border:2px solid transparent;border-radius:3px;cursor:pointer}
.swatch:hover{transform:scale(1.1)}
.swatch.sel{border-color:#fff;box-shadow:0 0 8px rgba(255,255,255,.3)}
.creator-footer{padding:.75rem 1rem;background:var(--card);border-top:1px solid var(--border);display:flex;gap:.75rem}
.creator-footer input{flex:1;padding:.6rem;background:var(--panel);border:1px solid var(--border);border-radius:4px;color:#fff;font-size:.9rem}
.creator-footer input::placeholder{color:var(--dim)}
.create-btn{padding:.6rem 1.5rem;background:linear-gradient(90deg,#00a0aa,var(--cyan));border:none;border-radius:4px;font-family:'Orbitron',sans-serif;font-size:.75rem;color:var(--bg);cursor:pointer}
.create-btn:disabled{opacity:.5}

.game-layout{flex:1;display:grid;grid-template-columns:280px 1fr;background:var(--border);gap:1px}
.sidebar{background:var(--panel);padding:1rem;overflow-y:auto}
.card{background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden}
.card-top{display:flex;justify-content:space-between;padding:.5rem .6rem;background:#1a1a25;border-bottom:1px solid var(--border);font-family:'Orbitron',sans-serif;font-size:.5rem;color:var(--cyan)}
.card-top span:last-child{color:var(--amber);background:rgba(255,170,0,.1);padding:.1rem .3rem;border-radius:2px}
.portrait{width:100%;height:180px;object-fit:cover}
.portrait-placeholder{height:140px;display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--dim);background:var(--bg)}
.card-name{text-align:center;font-family:'Orbitron',sans-serif;font-size:.9rem;color:#fff;padding:.5rem .5rem 0}
.card-class{text-align:center;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--cyan);padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.bars{padding:.6rem}
.bar{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--dim);margin-bottom:.15rem}
.bar-track{height:6px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:.4rem}
.bar-fill{height:100%;transition:width .3s}
.bar-fill.hp{background:var(--green)}
.bar-fill.xp{background:linear-gradient(90deg,#00a0aa,var(--cyan))}
.stats-row{display:flex;justify-content:space-around;padding:.5rem;border-top:1px solid var(--border)}
.stats-row div{text-align:center}
.stats-row span{display:block;font-family:'Orbitron',sans-serif;font-size:.45rem;color:var(--dim)}
.stats-row b{font-family:'Orbitron',sans-serif;font-size:1.1rem;color:#fff}

.narrative{background:var(--panel);padding:1.5rem;overflow-y:auto}
.location{font-family:'Orbitron',sans-serif;font-size:.65rem;color:var(--amber);letter-spacing:.2em;margin-bottom:1rem}
.text{font-size:1rem;line-height:1.7;white-space:pre-wrap;max-width:650px}
.sys-out{background:var(--bg);border:1px solid var(--border);border-left:3px solid var(--cyan);padding:.75rem;margin:1rem 0;font-family:'Share Tech Mono',monospace;font-size:.75rem;max-width:450px}
.sys-head{color:var(--cyan);margin-bottom:.5rem;font-size:.65rem;letter-spacing:.1em}
.sys-out .win{color:var(--green);margin-top:.5rem;font-weight:bold}
.sys-out .lose{color:var(--red);margin-top:.5rem;font-weight:bold}
.combat-log{max-height:120px;overflow-y:auto;margin:.5rem 0;font-size:.65rem;color:var(--dim)}
.choices{margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1rem}
.choices button{display:flex;align-items:center;gap:.6rem;width:100%;padding:.65rem .8rem;margin-bottom:.4rem;background:var(--card);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:.85rem;cursor:pointer;text-align:left}
.choices button:hover:not(:disabled){background:#222230;border-color:var(--cyan);transform:translateX(3px)}
.choices button:disabled{opacity:.4;cursor:not-allowed}
.choices button span:first-child{font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--cyan)}
.choices .req{color:var(--amber);font-size:.7rem}
.choices .reward{color:var(--green);font-family:'Share Tech Mono',monospace;font-size:.8rem;margin-bottom:.5rem}
.choices .xp-award{color:var(--cyan);font-family:'Share Tech Mono',monospace;margin-bottom:.5rem}

@media(max-width:768px){
  .creator-body,.game-layout{grid-template-columns:1fr}
  .sidebar{display:none}
}
`;
