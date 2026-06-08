import React from "react";

export default function MobileWebCardSvg() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
      <defs>
        <linearGradient id="screenGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="50%" stopColor="#7000ff" />
          <stop offset="100%" stopColor="#ff00a0" />
        </linearGradient>
      </defs>
      
      {/* Screen */}
      <rect x="50" y="40" width="300" height="160" rx="16" fill="url(#screenGradient)" />
      
      {/* Inner Screen Elements */}
      <rect x="60" y="50" width="280" height="140" rx="10" fill="rgba(255, 255, 255, 0.1)" />
      <text x="200" y="100" fill="white" fontSize="24" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="2">WEB</text>
      <text x="200" y="130" fill="white" fontSize="32" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">MOBILE <tspan fontSize="20" fill="rgba(255,255,255,0.7)">UX/UI</tspan></text>
      
      {/* Keyboard Base */}
      <path d="M30 200 L370 200 L390 250 L10 250 Z" fill="white" />
      
      {/* Keyboard Keys */}
      <g fill="#1a1a1a">
        {[...Array(12)].map((_, i) => (
          <circle key={`row1-${i}`} cx={50 + i * 27} cy={215} r="6" />
        ))}
        {[...Array(12)].map((_, i) => (
          <circle key={`row2-${i}`} cx={50 + i * 27} cy={235} r="6" />
        ))}
      </g>
    </svg>
  );
}
