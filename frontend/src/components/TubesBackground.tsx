"use client";

import React, { useEffect, useRef } from 'react';
import TubesCursor from 'threejs-components/build/cursors/tubes1.min.js';

// Optimize: Reusable color generator to avoid array allocation per click
const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    // Respect user motion preferences
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let cleanup: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    const initTubes = () => {
      if (!canvasRef.current) return;

      try {
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        tubesRef.current = app;

        // Reduce Pixel Ratio
        if (app && app.renderer) {
          app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }

        // Pause rendering when tab is hidden
        const handleVisibilityChange = () => {
          if (!tubesRef.current) return;
          if (document.hidden) {
            if (typeof tubesRef.current.pause === 'function') tubesRef.current.pause();
          } else {
            if (typeof tubesRef.current.resume === 'function') tubesRef.current.resume();
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        cleanup = () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          // Proper Cleanup
          if (tubesRef.current) {
            if (typeof tubesRef.current.destroy === 'function') tubesRef.current.destroy();
            else if (typeof tubesRef.current.dispose === 'function') tubesRef.current.dispose();
            
            // Fallback for raw Three.js resources if exposed
            if (tubesRef.current.renderer && typeof tubesRef.current.renderer.dispose === 'function') {
              tubesRef.current.renderer.dispose();
            }
          }
        };
      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    // Lazy Load the Effect
    if (containerRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!tubesRef.current) {
              initTubes();
            } else if (tubesRef.current.resume) {
              tubesRef.current.resume();
            }
          } else {
            if (tubesRef.current && tubesRef.current.pause) {
              tubesRef.current.pause();
            }
          }
        });
      }, { threshold: 0.01 });

      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    // Minimal array allocation for garbage collection
    const colors = [generateColor(), generateColor(), generateColor()];
    const lightsColors = [generateColor(), generateColor(), generateColor(), generateColor()];
    
    if (tubesRef.current.tubes) {
      tubesRef.current.tubes.setColors(colors);
      tubesRef.current.tubes.setLightsColors(lightsColors);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-[100vw] h-[100vh] min-h-[400px] overflow-hidden", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-[100vw] h-[100vh] block"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-[100vw] h-[100vh] pointer-events-none">
        {children}
      </div>
    </div>
  );
}

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export default TubesBackground;
