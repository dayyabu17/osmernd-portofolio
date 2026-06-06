"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CSSPrismaticBurstProps {
  className?: string;
}

export function CSSPrismaticBurst({ className = "" }: CSSPrismaticBurstProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Dampen movement
      setMousePos((prev) => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#000b18] ${className}`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slowSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes reverseSpin {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
      `}} />

      {/* Deep Background Glows */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(77, 61, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(255, 0, 122, 0.3) 0%, transparent 60%)
          `
        }}
      />

      {/* Rotating Rays Layer 1 */}
      <div 
        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] opacity-30 mix-blend-screen pointer-events-none"
        style={{
          background: "repeating-conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.1) 10deg, transparent 20deg)",
          animation: "slowSpin 60s linear infinite"
        }}
      />

      {/* Rotating Rays Layer 2 (Reverse, different color) */}
      <div 
        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: "repeating-conic-gradient(from 15deg, transparent 0deg, rgba(77,61,255,0.15) 15deg, transparent 30deg)",
          animation: "reverseSpin 90s linear infinite"
        }}
      />

      {/* Central Core Glow to obscure the sharp center of the conic gradients */}
      <div 
        className="absolute inset-0 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.2) 0%, rgba(77, 61, 255, 0.1) 20%, transparent 60%)`
        }}
      />

      {/* Vignette Edge Fade */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,11,24,1)]" />
    </div>
  );
}

export default CSSPrismaticBurst;
