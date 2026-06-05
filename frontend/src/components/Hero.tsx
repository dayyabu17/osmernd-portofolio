"use client";

import React from "react";
import dynamic from "next/dynamic";
import GrainyMeshBackground from "./GrainyMeshBackground";

// Lazy load the heavy WebGL scene (client-only)
const GlassLensScene = dynamic(() => import("./GlassLensScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="hero-section cursor-none" id="hero">
      {/* ── Background Layer (DOM) ── */}
      <GrainyMeshBackground />

      {/* ── Refractive Lens & 3D Typography Layer (WebGL) ── */}
      <GlassLensScene />

      {/* ── Overlay UI Layer (DOM) ── */}
      {/* We add pointer-events-none to the section wrapper, 
          but pointer-events-auto to the nav so links are clickable */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-[var(--page-padding)]">
        
        {/* Navbar */}
        <nav className="navbar pointer-events-auto" id="navbar">
          <div className="navbar__brand">Osmern D</div>
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

        {/* Screen Reader Only Typography (for SEO and accessibility) */}
        <h1 className="sr-only">
          Creative visual designer
        </h1>

        {/* Bottom Info */}
        <div className="hero-bottom pointer-events-auto" id="hero-bottom">
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
      </div>
    </section>
  );
}
