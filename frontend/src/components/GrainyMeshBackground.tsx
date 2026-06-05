"use client";

import React, { useEffect, useRef } from "react";

export default function GrainyMeshBackground() {
  const followOrbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const orb = followOrbRef.current;
    if (!orb) return;

    const current = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };
    const target = { ...current };
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const animate = () => {
      current.x = lerp(current.x, target.x, 0.08);
      current.y = lerp(current.y, target.y, 0.08);
      orb.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate3d(-50%, -50%, 0)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 isolate overflow-hidden bg-[#0a0a0c]">
      <div className="orb-float-a absolute -top-1/4 left-[-10%] h-[520px] w-[520px] rounded-full bg-[#143b7a]/60 blur-[120px] mix-blend-screen" />
      <div className="orb-float-b absolute bottom-[-15%] right-[-5%] h-[520px] w-[520px] rounded-full bg-[#0f6b6b]/50 blur-[140px] mix-blend-screen" />
      <div
        ref={followOrbRef}
        className="absolute left-0 top-0 h-[380px] w-[380px] rounded-full bg-[#f1a36b]/40 blur-[120px] mix-blend-screen"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20">
        <svg
          className="h-full w-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <filter id="grain-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-noise)" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
