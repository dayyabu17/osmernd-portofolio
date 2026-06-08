import React from "react";

export default function BrandingCardSvg() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
      <defs>
        <linearGradient id="brandGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3366" />
          <stop offset="100%" stopColor="#ff9933" />
        </linearGradient>
        <linearGradient id="brandGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#33ccff" />
          <stop offset="100%" stopColor="#cc33ff" />
        </linearGradient>
      </defs>

      {/* Background Pattern */}
      <rect x="20" y="20" width="360" height="210" rx="20" fill="#111" />
      <circle cx="100" cy="125" r="80" fill="url(#brandGrad1)" opacity="0.6" style={{ mixBlendMode: 'screen' }} />
      <circle cx="180" cy="125" r="80" fill="url(#brandGrad2)" opacity="0.6" style={{ mixBlendMode: 'screen' }} />
      <polygon points="260,60 340,125 260,190" fill="#00e5ff" opacity="0.8" style={{ mixBlendMode: 'screen' }} />
      
      {/* Brand Guidelines elements */}
      <rect x="40" y="40" width="80" height="8" rx="4" fill="white" opacity="0.8" />
      <rect x="40" y="60" width="50" height="4" rx="2" fill="white" opacity="0.4" />
      
      <rect x="280" y="40" width="60" height="8" rx="4" fill="white" opacity="0.8" />
      
      {/* Typography representation */}
      <text x="40" y="200" fill="white" fontSize="28" fontFamily="serif" fontWeight="bold">Aa</text>
      <text x="85" y="200" fill="white" fontSize="28" fontFamily="sans-serif" fontWeight="bold">Aa</text>
    </svg>
  );
}
