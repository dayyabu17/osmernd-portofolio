"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

/* ── Lazy-load heavy WebGL background (client-only) ── */
const PrismBackground = dynamic(() => import("./PrismBackground"), {
  ssr: false,
});

/* ───────────────────────────────────────────
   Constants
   ─────────────────────────────────────────── */
const LENS_RADIUS_SMALL = 50; // half of 100px default lens
const LENS_RADIUS_LARGE = 100; // half of 200px expanded lens

/* ───────────────────────────────────────────
   Hero Component
   ─────────────────────────────────────────── */
export default function Hero() {
  /* ── Refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensContentRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLSpanElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const designerRef = useRef<HTMLSpanElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const redOffsetRef = useRef<SVGFEOffsetElement>(null);
  const blueOffsetRef = useRef<SVGFEOffsetElement>(null);

  /* ── State (low-frequency changes only) ── */
  const [isOnPage, setIsOnPage] = useState(false);
  const [overlappedWord, setOverlappedWord] = useState<string | null>(null);

  /* ── Check if the lens circle overlaps a word ── */
  const getOverlappedWord = useCallback(
    (mx: number, my: number): string | null => {
      const refs = [
        { word: "Creative", ref: creativeRef },
        { word: "visual", ref: visualRef },
        { word: "designer", ref: designerRef },
      ];

      for (const { word, ref } of refs) {
        if (!ref.current) continue;
        const rect = ref.current.getBoundingClientRect();
        const closestX = Math.max(rect.left, Math.min(mx, rect.right));
        const closestY = Math.max(rect.top, Math.min(my, rect.bottom));
        const dx = mx - closestX;
        const dy = my - closestY;
        if (Math.sqrt(dx * dx + dy * dy) < LENS_RADIUS_SMALL) {
          return word;
        }
      }
      return null;
    },
    []
  );

  /* ── Mouse tracking ── */
  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let targetX = 0;
    let targetY = 0;
    let speed = 0;

    const updateFilter = (t: number) => {
      const dt = Math.max(8, t - lastT);
      const dx = targetX - lastX;
      const dy = targetY - lastY;
      const dist = Math.hypot(dx, dy);
      const v = (dist / dt) * 120;
      speed += (v - speed) * 0.12;

      const spread = Math.min(14, 2 + speed * 0.22);
      const disp = Math.min(18, 4 + speed * 0.3);
      const base = 0.008 + 0.0035 * Math.sin(t * 0.0012);
      const freq = Math.min(0.02, base + speed * 0.0005);

      if (redOffsetRef.current) redOffsetRef.current.setAttribute("dx", `${-spread}`);
      if (blueOffsetRef.current) blueOffsetRef.current.setAttribute("dx", `${spread}`);
      if (displacementRef.current) displacementRef.current.setAttribute("scale", `${disp}`);
      if (turbulenceRef.current)
        turbulenceRef.current.setAttribute("baseFrequency", `${freq.toFixed(4)}`);

      lastX = targetX;
      lastY = targetY;
      lastT = t;
      raf = requestAnimationFrame(updateFilter);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setIsOnPage(true);
      targetX = x;
      targetY = y;

      // Move lens via ref (no React re-render)
      if (lensRef.current) {
        lensRef.current.style.left = `${x}px`;
        lensRef.current.style.top = `${y}px`;
      }

      // Align inner content so the duplicate text overlaps the original
      if (lensContentRef.current) {
        lensContentRef.current.style.left = `calc(50% - ${x}px)`;
        lensContentRef.current.style.top = `calc(50% - ${y}px)`;
        lensContentRef.current.style.transformOrigin = `${x}px ${y}px`;
      }

      // Word overlap detection (infrequent state change)
      const word = getOverlappedWord(x, y);
      setOverlappedWord(word);
    };

    const handleMouseLeave = () => {
      setIsOnPage(false);
      setOverlappedWord(null);
    };

    raf = requestAnimationFrame(updateFilter);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [getOverlappedWord]);

  return (
    <section className="hero-section" ref={heroRef} id="hero">
      {/* ── SVG filter: chromatic aberration ── */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="hero-chromatic"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="2"
              ref={turbulenceRef}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              ref={displacementRef}
              result="distorted"
            />
            {/* Red channel — shifted left */}
            <feColorMatrix
              in="distorted"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="r"
            />
            <feOffset in="r" dx="-4" dy="0" result="r-off" ref={redOffsetRef} />

            {/* Green channel — centered */}
            <feColorMatrix
              in="distorted"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="g"
            />

            {/* Blue channel — shifted right */}
            <feColorMatrix
              in="distorted"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="b"
            />
            <feOffset in="b" dx="4" dy="0" result="b-off" ref={blueOffsetRef} />

            {/* Recombine with screen blend */}
            <feBlend in="r-off" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b-off" mode="screen" result="rgb" />

            {/* Subtle blur for softness */}
            <feGaussianBlur in="rgb" stdDeviation="1.2" />
          </filter>
        </defs>
      </svg>

      {/* ── Prism Background ── */}
      <div className="prism-bg">
        <PrismBackground
          animationType="hover"
          height={3.2}
          baseWidth={5.2}
          scale={3.8}
          glow={1.1}
          bloom={1.15}
          noise={0.55}
          hueShift={0.0}
          colorFrequency={1.1}
          timeScale={0.35}
          suspendWhenOffscreen={true}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar" id="navbar">
        <div className="navbar__brand">OSMEERN D</div>
        <ul className="navbar__links">
          <li>
            <a className="navbar__link" href="#projects" id="nav-projects">
              PROJECT
            </a>
          </li>
          <li>
            <a className="navbar__link" href="#socials" id="nav-socials">
              SOCIALS
            </a>
          </li>
          <li>
            <a className="navbar__link" href="#contacts" id="nav-contacts">
              CONTACTS
            </a>
          </li>
        </ul>
      </nav>

      {/* ── Original headline (visible outside the lens) ── */}
      <div className="hero-headline" id="hero-headline">
        <span className="hero-headline__line" ref={creativeRef}>
          Creative
        </span>
        <span
          className="hero-headline__line hero-headline__line--designer"
          ref={designerRef}
        >
          designer
        </span>
      </div>

      {/* ── Accent word ── */}
      <div className="hero-accent" id="hero-accent">
        <span className="hero-accent__word" ref={visualRef}>
          visual
        </span>
      </div>

      {/* ── Bottom info ── */}
      <div className="hero-bottom" id="hero-bottom">
        <div className="hero-info">
          <div className="hero-info__item">
            WEB &amp; MOBILE / UX&amp;UI
            <br />/ BRANDING
          </div>
          <div className="hero-info__item">
            BASED
            <br />
            IN NIGERIA
          </div>
          <div className="hero-info__item">
            CURRENTLY AVAILABLE
            <br />
            FOR FREELANCE
            <br />
            WORLDWIDE
          </div>
        </div>

        <div className="hero-arrow" id="hero-arrow">
          <div className="hero-arrow__line" />
          <span className="hero-arrow__icon">↓</span>
        </div>
      </div>

      {/* ── Cursor Lens ──
           The lens is a circular viewport (overflow: hidden + border-radius).
           backdrop-filter blurs the background behind it.
           Inside: a full-viewport duplicate of the hero text, positioned
           to align perfectly with the original, with chromatic aberration
           SVG filter + scale magnification. ── */}
      <div
        className={`cursor-lens ${!isOnPage ? "cursor-lens--hidden" : ""} ${
          overlappedWord ? "cursor-lens--expanded" : ""
        }`}
        ref={lensRef}
        aria-hidden="true"
      >
        <div className="lens-content" ref={lensContentRef}>
          {/* Duplicate hero text — uses same CSS classes for identical positioning */}
          <div className="hero-headline">
            <span className="hero-headline__line">Creative</span>
            <span className="hero-headline__line hero-headline__line--designer">
              designer
            </span>
          </div>
          <div className="hero-accent">
            <span className="hero-accent__word">visual</span>
          </div>
        </div>
      </div>
    </section>
  );
}
