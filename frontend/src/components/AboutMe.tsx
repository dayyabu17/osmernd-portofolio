"use client";

import React from "react";
import dynamic from "next/dynamic";

const AuroraCharacter = dynamic(() => import("./AuroraCharacter"), {
  ssr: false,
});

export default function AboutMe() {
  return (
    <section
      id="about"
      style={{
        background: "var(--color-bg)",
        padding: "80px clamp(32px, 6vw, 96px)",
      }}
      className="relative w-full min-h-screen overflow-hidden flex items-center"
    >
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">

          {/* Left Column — Bio Text */}
          <div className="flex-1 flex flex-col justify-center order-2 md:order-1">
            <p
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
            <div style={{ marginTop: "24px" }}>
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
          <div className="flex-1 flex items-center justify-center order-1 md:order-2">
            <div className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
              <AuroraCharacter />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle separator line at the top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "clamp(32px, 6vw, 96px)",
          right: "clamp(32px, 6vw, 96px)",
          height: "1px",
          background: "rgba(255, 255, 255, 0.06)",
        }}
      />
    </section>
  );
}
