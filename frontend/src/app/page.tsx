"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import NoisyGradientBackground, { NoisyGradientHandle } from "@/components/NoisyGradientBackground";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<"hero" | "about">("hero");
  const bgRef = useRef<NoisyGradientHandle>(null);
  
  // Throttle scrolling to prevent double-skipping
  const isAnimating = useRef(false);

  useEffect(() => {
    // Disable native scroll on body to ensure Scroll Hijacking works cleanly
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      // onUp fires when user scrolls DOWN (content moves UP) => Next Section
      onUp: () => {
        if (isAnimating.current || activeSection === "about") return;
        isAnimating.current = true;
        setActiveSection("about");
        
        // Animate background transition to About state (1)
        gsap.to({ val: 0 }, {
          val: 1,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function() {
            bgRef.current?.setTransition(this.targets()[0].val);
          },
          onComplete: () => { isAnimating.current = false; }
        });
      },
      // onDown fires when user scrolls UP (content moves DOWN) => Prev Section
      onDown: () => {
        if (isAnimating.current || activeSection === "hero") return;
        isAnimating.current = true;
        setActiveSection("hero");
        
        // Animate background transition back to Hero state (0)
        gsap.to({ val: 1 }, {
          val: 0,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function() {
            bgRef.current?.setTransition(this.targets()[0].val);
          },
          onComplete: () => { isAnimating.current = false; }
        });
      },
      tolerance: 40,
      preventDefault: true
    });

    return () => observer.kill();
  }, [activeSection]);

  return (
    <>
      {/* Container must be relative and stack children absolutely so they overlap during transition */}
      <main className="relative w-full h-[100vh] overflow-hidden">
        
        <NoisyGradientBackground ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" />
        
        {/* Hero Section */}
        <div className={`absolute inset-0 transition-all duration-1000 ${activeSection === 'hero' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <Hero isActive={activeSection === "hero"} />
        </div>

        {/* About Section */}
        <div className={`absolute inset-0 transition-all duration-1000 ${activeSection === 'about' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <AboutMe isActive={activeSection === "about"} />
        </div>

      </main>
    </>
  );
}
