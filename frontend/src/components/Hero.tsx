"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";

const TubesBackground = dynamic(() => import("./TubesBackground"), {
  ssr: false,
});
import CSSPrismaticBurst from "./CSSPrismaticBurst";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="hero-section" id="hero">
      
      {/* ── CSS Prismatic Burst Background (Always visible) ── */}
      <div className="absolute inset-0 z-0 md:hidden">
        <CSSPrismaticBurst />
      </div>

      {/* ── Tubes Background (Hidden on mobile) ── */}
      <div className="hidden md:block absolute inset-0 z-10">
        <TubesBackground className="w-[100vw] h-[100vh]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="absolute top-0 md:top-6 left-1/2 -translate-x-1/2 max-w-[1400px] w-full flex items-center justify-between px-8 md:px-16 py-8 z-50 pointer-events-none">
        <div className="font-primary text-sm font-medium tracking-[0.12em] uppercase text-white pointer-events-auto">
          Osmern D
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-12 list-none m-0 p-0 pointer-events-auto">
          <li>
            <a className="font-primary text-xs font-medium tracking-[0.14em] uppercase text-white/45 hover:text-white transition-colors cursor-pointer" href="#projects">PROJECT</a>
          </li>
          <li>
            <a className="font-primary text-xs font-medium tracking-[0.14em] uppercase text-white/45 hover:text-white transition-colors cursor-pointer" href="#socials">SOCIALS</a>
          </li>
          <li>
            <a className="font-primary text-xs font-medium tracking-[0.14em] uppercase text-white/45 hover:text-white transition-colors cursor-pointer" href="#contacts">CONTACTS</a>
          </li>
        </ul>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden text-white p-2 pointer-events-auto z-[110]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Full Screen Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center pointer-events-auto md:hidden">
            <div className="flex flex-col items-center gap-12">
              <a 
                className="font-primary text-3xl font-medium tracking-[0.14em] uppercase text-white hover:text-[#ff007a] transition-colors cursor-pointer" 
                href="#projects" 
                onClick={() => setIsMenuOpen(false)}
              >
                PROJECT
              </a>
              <a 
                className="font-primary text-3xl font-medium tracking-[0.14em] uppercase text-white hover:text-[#ff007a] transition-colors cursor-pointer" 
                href="#socials" 
                onClick={() => setIsMenuOpen(false)}
              >
                SOCIALS
              </a>
              <a 
                className="font-primary text-3xl font-medium tracking-[0.14em] uppercase text-white hover:text-[#ff007a] transition-colors cursor-pointer" 
                href="#contacts" 
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACTS
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="relative w-full max-w-[1400px] px-8 md:px-16 mx-auto">
          
          {/* Typography Layout */}
          <div className="relative w-full h-[22vw] md:h-[20vw]">
            
            {/* Creative (Left aligned, anchored top left, pushed left to balance visual weight) */}
            <h1 
              style={{ fontFamily: 'var(--font-primary)', color: '#ffffff', letterSpacing: '-0.03em' }}
              className="absolute top-0 left-[2vw] md:left-[4vw] text-[clamp(60px,11vw,180px)] leading-[0.85] font-medium m-0 z-30 pointer-events-none mix-blend-normal"
            >
              Creative
            </h1>

            {/* visual & designer wrapper (Right aligned, pushed inwards slightly) */}
            <div className="absolute top-[6vw] right-[4vw] md:right-[8vw] flex flex-col items-end z-10 pointer-events-none">
              
              {/* visual (tucked tightly above 'ner' in designer) */}
              <h2 
                style={{ fontFamily: 'var(--font-accent)', color: '#F1A21B', letterSpacing: '-0.02em' }}
                className="text-[clamp(65px,11vw,160px)] italic font-medium m-0 z-20 mr-[1vw] md:mr-[3vw] leading-[0.5] mb-[-12vw] md:mb-[-14vw]"
              >
                visual
              </h2>
              
              {/* designer (flush right) */}
              <h1 
                style={{ fontFamily: 'var(--font-primary)', color: '#ffffff', letterSpacing: '-0.03em' }}
                className="text-[clamp(60px,11vw,180px)] leading-[0.85] font-medium m-0 z-10"
              >
                designer
              </h1>
              
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom info (Always visible) ── */}
      <div className="absolute bottom-10 left-6 right-6 md:left-14 md:right-14 flex justify-between items-end z-10 pointer-events-none">
        <div className="flex gap-4 md:gap-16">
          <div className="font-primary text-[10px] md:text-[11px] font-medium tracking-[0.1em] uppercase text-white/45 leading-[1.5]">
            WEB &amp; MOBILE / UX&amp;UI
            <br />/ BRANDING
          </div>
          <div className="font-primary text-[10px] md:text-[11px] font-medium tracking-[0.1em] uppercase text-white/45 leading-[1.5]">
            BASED
            <br />
            IN NIGERIA
          </div>
          <div className="font-primary text-[10px] md:text-[11px] font-medium tracking-[0.1em] uppercase text-white/45 leading-[1.5] hidden lg:block">
            CURRENTLY AVAILABLE
            <br />
            FOR FREELANCE
            <br />
            WORLDWIDE
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center animate-bounce text-white/45">
          <span className="text-xl">↓</span>
        </div>
      </div>
    </section>
  );
}
