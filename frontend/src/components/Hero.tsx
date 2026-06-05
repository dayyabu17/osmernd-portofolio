"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

/* ── Lazy-load heavy WebGL components (client-only) ── */
const PrismBackground = dynamic(() => import("./PrismBackground"), {
  ssr: false,
});
const ASCIIText = dynamic(() => import("./AsciiText"), { ssr: false });

/* ───────────────────────────────────────────
   Types
   ─────────────────────────────────────────── */
interface WordBounds {
  word: string;
  rect: DOMRect;
}

/* ───────────────────────────────────────────
   Hero Component
   ─────────────────────────────────────────── */
export default function Hero() {
  /* ── Refs ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const asciiOverlayRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLSpanElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const designerRef = useRef<HTMLSpanElement>(null);

  /* ── State ── */
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const [isOnPage, setIsOnPage] = useState(false);
  const [overlappedWord, setOverlappedWord] = useState<string | null>(null);

  const LENS_RADIUS = 100; // half of --lens-size (200px)

  /* ── Check if cursor overlaps a word ── */
  const getOverlappedWord = useCallback(
    (mx: number, my: number): string | null => {
      const words: WordBounds[] = [];

      if (creativeRef.current) {
        words.push({
          word: "Creative",
          rect: creativeRef.current.getBoundingClientRect(),
        });
      }
      if (visualRef.current) {
        words.push({
          word: "visual",
          rect: visualRef.current.getBoundingClientRect(),
        });
      }
      if (designerRef.current) {
        words.push({
          word: "designer",
          rect: designerRef.current.getBoundingClientRect(),
        });
      }

      for (const { word, rect } of words) {
        // Check if the lens circle overlaps the word bounding box
        const closestX = Math.max(rect.left, Math.min(mx, rect.right));
        const closestY = Math.max(rect.top, Math.min(my, rect.bottom));
        const distX = mx - closestX;
        const distY = my - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < LENS_RADIUS) {
          return word;
        }
      }
      return null;
    },
    [LENS_RADIUS]
  );

  /* ── Mouse tracking ── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setCursorPos({ x, y });
      setIsOnPage(true);

      // Update lens position directly for performance
      if (lensRef.current) {
        lensRef.current.style.left = `${x}px`;
        lensRef.current.style.top = `${y}px`;
      }

      // Update ASCII overlay clip-path
      const word = getOverlappedWord(x, y);
      setOverlappedWord(word);

      if (asciiOverlayRef.current) {
        if (word) {
          asciiOverlayRef.current.style.clipPath = `circle(${LENS_RADIUS}px at ${x}px ${y}px)`;
        } else {
          asciiOverlayRef.current.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        }
      }
    };

    const handleMouseLeave = () => {
      setIsOnPage(false);
      setOverlappedWord(null);
      if (asciiOverlayRef.current) {
        asciiOverlayRef.current.style.clipPath = `circle(0px at 0px 0px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [getOverlappedWord, LENS_RADIUS]);

  return (
    <section className="hero-section" ref={heroRef} id="hero">
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

      {/* ── Base headline layer (normal text) ── */}
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

      {/* ── ASCII overlay layer (revealed under cursor lens) ── */}
      <div
        className="ascii-overlay"
        ref={asciiOverlayRef}
        id="ascii-overlay"
        aria-hidden="true"
      >
        {overlappedWord && (
          <ASCIIText
            text={overlappedWord}
            asciiFontSize={8}
            textFontSize={200}
            textColor="#fdf9f3"
            planeBaseHeight={8}
            enableWaves={true}
          />
        )}
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
          {/* <div className="hero-info__item">BORN IN SAINT-P</div> */}
        </div>

        <div className="hero-arrow" id="hero-arrow">
          <div className="hero-arrow__line" />
          <span className="hero-arrow__icon">↓</span>
        </div>
      </div>

      {/* ── Cursor Lens ── */}
      <div
        className={`cursor-lens ${!isOnPage ? "cursor-lens--hidden" : ""}`}
        ref={lensRef}
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
