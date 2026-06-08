import React from "react";

export default function IllustrationCardSvg() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
      {/* Hand */}
      <path
        d="M60 250 L80 150 C90 100, 110 80, 130 90 C140 95, 145 110, 135 125 C150 115, 170 115, 180 130 C190 145, 180 160, 175 165 C190 155, 210 160, 215 180 C220 200, 205 210, 195 215 C210 205, 230 215, 225 235 L215 250 Z"
        fill="#F0A500"
      />
      {/* Pencil */}
      <g transform="rotate(-15, 200, 150)">
        <rect x="120" y="140" width="160" height="20" fill="white" stroke="black" strokeWidth="3" />
        <path d="M280 140 L310 150 L280 160 Z" fill="white" stroke="black" strokeWidth="3" />
        <path d="M300 147 L310 150 L300 153 Z" fill="#00e5ff" />
        <line x1="140" y1="140" x2="140" y2="160" stroke="black" strokeWidth="3" />
        <line x1="160" y1="140" x2="160" y2="160" stroke="black" strokeWidth="3" />
      </g>
      
      {/* Right Canvas / Drawing */}
      <rect x="250" y="80" width="130" height="150" rx="10" stroke="#00e5ff" strokeWidth="3" fill="none" />
      {/* Chair */}
      <path d="M270 170 L270 230 M310 170 L310 230 M265 170 L315 170 M300 170 L300 120 M310 170 L310 120 M295 120 L315 120" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bowl */}
      <path d="M260 140 C260 170, 310 170, 310 140 Z" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Fruits */}
      <path d="M270 140 C270 120, 285 110, 285 130 C285 110, 300 110, 300 140" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
