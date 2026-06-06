"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AuroraCharacter = dynamic(() => import("./AuroraCharacter"), {
  ssr: false,
});

export interface AboutMeProps {
  isActive: boolean;
}

export default function AboutMe({ isActive }: AboutMeProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (isActive) {
      gsap.to(".about-content", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.2 // Wait slightly for Hero to exit
      });
    } else {
      gsap.to(".about-content", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, { dependencies: [isActive], scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="about"
      style={{
        padding: "80px clamp(32px, 6vw, 96px)",
      }}
      className="relative w-full h-[100vh] overflow-hidden flex items-center"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">

          {/* Left Column — Bio Text */}
          <div className="flex-1 flex flex-col justify-center order-2 md:order-1">
            <p
              className="about-content opacity-0 translate-y-[100px]"
              style={{
                fontFamily: "var(--font-primary)",
                fontWeight: 300,
                letterSpacing: "0.01em",
                fontSize: "clamp(16px, 1.8vw, 24px)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.75)",
              }}
            >
              I am Osmern D,
              <br />
              i create{" "}
              <span
                style={{
                  fontFamily: "var(--font-accent)",
                  color: "var(--color-accent)",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                unconventional
              </span>
              <br />
              yet functional &amp; visually
              <br />
              pleasing interfaces for
              <br />
              the mobile and web
            </p>

            {/* Service Tags */}
            <div className="about-content opacity-0 translate-y-[100px]" style={{ marginTop: "24px" }}>
              <span
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255, 255, 255, 0.35)",
                  lineHeight: 1.5,
                }}
              >
                WEB &amp; MOBILE / UX&amp;UI
                <br />/ BRANDING
              </span>
            </div>
          </div>

          {/* Right Column — Aurora Character */}
          <div className="about-content opacity-0 translate-y-[100px] flex-1 flex items-center justify-center order-1 md:order-2">
            <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
              <AuroraCharacter />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
