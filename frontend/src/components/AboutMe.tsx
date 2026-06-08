"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ServiceCard from "./ServiceCard";
import IllustrationCardSvg from "./IllustrationCardSvg";
import MobileWebCardSvg from "./MobileWebCardSvg";
import BrandingCardSvg from "./BrandingCardSvg";

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
      gsap.to(".service-card", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.5 
      });
    } else {
      gsap.to(".about-content", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to(".service-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
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
      className="relative w-full min-h-[100vh] overflow-hidden flex items-center"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-24">

          {/* Left Column — Bio Text */}
          <div className="flex-1 flex flex-col justify-center order-2 xl:order-1 z-30">
            <p
              className="about-content opacity-0 translate-y-[100px]"
              style={{
                fontFamily: "var(--font-primary)",
                fontWeight: 300,
                letterSpacing: "0.01em",
                fontSize: "clamp(24px, 2.5vw, 42px)",
                lineHeight: 1.4,
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
            <div className="about-content opacity-0 translate-y-[100px]" style={{ marginTop: "40px" }}>
              <span
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255, 255, 255, 0.35)",
                  lineHeight: 1.8,
                }}
              >
                WEB &amp; MOBILE / UX&amp;UI
                <br />/ BRANDING
              </span>
            </div>
          </div>

          {/* Right Column — Aurora Character & Cards */}
          <div className="about-content opacity-0 translate-y-[100px] flex-[1.5] flex items-center justify-center order-1 xl:order-2 relative min-h-[600px] xl:min-h-[800px] w-full">
            
            {/* Center Anchor for Circle */}
            <div className="absolute top-1/2 left-1/2 w-0 h-0 z-20">
              
              {/* Branding Card (Top) */}
              <div 
                className="absolute"
                style={{
                  transform: "translate(-50%, -50%) rotate(270deg) translate(clamp(200px, 24vw, 320px)) rotate(-270deg)",
                }}
              >
                <ServiceCard 
                  title="BRANDING" 
                  subtitle="IDENTITY"
                  svg={<BrandingCardSvg />} 
                />
              </div>

              {/* Mobile & Web Card (Bottom Left) */}
              <div 
                className="absolute"
                style={{
                  transform: "translate(-50%, -50%) rotate(150deg) translate(clamp(200px, 24vw, 320px)) rotate(-150deg)",
                }}
              >
                <ServiceCard 
                  title="MOBILE & WEB" 
                  subtitle="UX & UI"
                  svg={<MobileWebCardSvg />} 
                />
              </div>

              {/* Illustrations Card (Bottom Right) */}
              <div 
                className="absolute"
                style={{
                  transform: "translate(-50%, -50%) rotate(30deg) translate(clamp(200px, 24vw, 320px)) rotate(-30deg)",
                }}
              >
                <ServiceCard 
                  title="ILLUSTRATIONS" 
                  subtitle="GRAPHICS"
                  svg={<IllustrationCardSvg />} 
                />
              </div>
            </div>

            {/* Character */}
            <div className="relative z-10 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px]">
              <AuroraCharacter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
