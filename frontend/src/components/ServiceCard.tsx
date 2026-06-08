import React, { ReactNode } from "react";

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  svg: ReactNode;
  className?: string;
  delay?: number;
}

export default function ServiceCard({ title, subtitle, svg, className = "", delay = 0 }: ServiceCardProps) {
  return (
    <div 
      className={`w-[280px] sm:w-[320px] lg:w-[380px] aspect-[16/10] bg-[#0a0a0a] border border-white/10 rounded-[16px] flex flex-col shadow-2xl service-card opacity-0 relative overflow-hidden ${className}`}
      style={{
        transform: "translateY(50px)",
      }}
      data-delay={delay}
    >
      {/* Padded Content Area */}
      <div className="px-6 pt-6 md:px-8 md:pt-8 flex flex-col gap-3 md:gap-4 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-3">
          <h3 className="text-white font-sans font-medium tracking-wider text-[10px] md:text-[12px] uppercase whitespace-nowrap">
            {title}
          </h3>
          <div className="flex-1 h-[1px] bg-white/20 min-w-[20px]"></div>
          {subtitle && (
            <span className="text-white/70 font-sans font-medium tracking-wider text-[9px] md:text-[11px] uppercase whitespace-nowrap">
              {subtitle}
            </span>
          )}
        </div>

        {/* Button */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>

      {/* SVG Container - Positioned to bleed to edges */}
      <div className="absolute right-0 bottom-0 w-[85%] h-[80%] z-0 flex items-end justify-end pointer-events-none">
        {svg}
      </div>
    </div>
  );
}
