"use client";

import React, { useEffect, useRef, useCallback } from "react";

/**
 * AuroraCharacter
 * A canvas-based character: soft diffused glowing sphere
 * with flowing cyan/blue/violet aurora gradients and minimal
 * geometric white face lines. The sphere is static — the entire
 * face (eyes, eyebrows, nose) follows the mouse cursor.
 * Eyes blink every 4 seconds.
 */

interface AuroraCharacterProps {
  className?: string;
}

export default function AuroraCharacter({ className = "" }: AuroraCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Mouse tracking (normalized -1 to 1 relative to window center)
  const mouseRef = useRef({ x: 0, y: 0 });
  // Smoothed mouse for lag effect
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Blink timing
  const lastBlinkRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const cw = w * dpr;
    const ch = h * dpr;

    ctx.clearRect(0, 0, cw, ch);

    const cx = cw / 2;
    const cy = ch / 2;
    const baseRadius = Math.min(cw, ch) * 0.28;

    // Sphere center is fixed (no floating)
    const centerX = cx;
    const centerY = cy;

    // Smooth the mouse with lerp for natural lag
    const lerp = 0.08;
    smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * lerp;
    smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * lerp;
    const sm = smoothMouseRef.current;

    // ── Aurora Sphere (static, gentle color shifting) ──
    const layers = [
      {
        offsetX: Math.cos(t * 0.3) * baseRadius * 0.25,
        offsetY: Math.sin(t * 0.4) * baseRadius * 0.2,
        color1: "rgba(0, 212, 255, 0.7)",
        color2: "rgba(0, 212, 255, 0.0)",
        radius: baseRadius * 1.1,
      },
      {
        offsetX: Math.sin(t * 0.25) * baseRadius * 0.15,
        offsetY: Math.cos(t * 0.35) * baseRadius * 0.18,
        color1: "rgba(100, 160, 255, 0.55)",
        color2: "rgba(100, 160, 255, 0.0)",
        radius: baseRadius * 1.0,
      },
      {
        offsetX: Math.cos(t * 0.2 + 2) * baseRadius * 0.3,
        offsetY: Math.sin(t * 0.3 + 1) * baseRadius * 0.25,
        color1: "rgba(160, 120, 240, 0.5)",
        color2: "rgba(160, 120, 240, 0.0)",
        radius: baseRadius * 0.95,
      },
      {
        offsetX: Math.sin(t * 0.45 + 3) * baseRadius * 0.2,
        offsetY: Math.cos(t * 0.55 + 2) * baseRadius * 0.15,
        color1: "rgba(200, 180, 255, 0.35)",
        color2: "rgba(200, 180, 255, 0.0)",
        radius: baseRadius * 0.85,
      },
    ];

    for (const layer of layers) {
      const lx = centerX + layer.offsetX;
      const ly = centerY + layer.offsetY;
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, layer.radius);
      grad.addColorStop(0, layer.color1);
      grad.addColorStop(0.6, layer.color1.replace(/[\d.]+\)$/, "0.15)"));
      grad.addColorStop(1, layer.color2);

      ctx.beginPath();
      ctx.arc(lx, ly, layer.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Outer soft glow
    const outerGlow = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, baseRadius * 1.6);
    outerGlow.addColorStop(0, "rgba(140, 200, 255, 0.08)");
    outerGlow.addColorStop(0.5, "rgba(140, 180, 255, 0.04)");
    outerGlow.addColorStop(1, "rgba(140, 180, 255, 0.0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();

    // ── Blink logic (every 4 seconds, quick 0.15s blink) ──
    const blinkCycle = t - lastBlinkRef.current;
    if (blinkCycle >= 4) {
      lastBlinkRef.current = t;
    }
    const blinkPhase = t - lastBlinkRef.current;
    let blink = 0;
    if (blinkPhase < 0.15) {
      blink = blinkPhase < 0.075
        ? blinkPhase / 0.075
        : 1 - (blinkPhase - 0.075) / 0.075;
    }

    // ── Face (entire face follows mouse) ──
    const scale = baseRadius / 100;
    const faceOffsetX = sm.x * 12 * scale; // entire face shifts towards mouse
    const faceOffsetY = sm.y * 8 * scale;

    ctx.save();
    ctx.translate(centerX + faceOffsetX, centerY + faceOffsetY);

    // Glow effect for face lines
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 8 * scale;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.lineWidth = 2.2 * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Left eyebrow
    ctx.beginPath();
    ctx.arc(-18 * scale, -18 * scale, 8 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Right eyebrow
    ctx.beginPath();
    ctx.arc(18 * scale, -18 * scale, 8 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // ── Eyes (blink animation) ──
    const eyeRadius = 2.5 * scale;
    const leftEyeX = -16 * scale;
    const rightEyeX = 16 * scale;
    const eyeY = -4 * scale;

    if (blink > 0.3) {
      const squish = 1 - blink;
      // Left eye blink
      ctx.beginPath();
      ctx.ellipse(leftEyeX, eyeY, eyeRadius * 1.2, Math.max(eyeRadius * squish, 0.3 * scale), 0, 0, Math.PI * 2);
      ctx.fill();
      // Right eye blink
      ctx.beginPath();
      ctx.ellipse(rightEyeX, eyeY, eyeRadius * 1.2, Math.max(eyeRadius * squish, 0.3 * scale), 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal eyes
      ctx.beginPath();
      ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // L-shaped nose
    ctx.beginPath();
    ctx.moveTo(0, 2 * scale);
    ctx.lineTo(0, 16 * scale);
    ctx.lineTo(8 * scale, 16 * scale);
    ctx.stroke();

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking (relative to entire window)
    const onMouseMove = (e: MouseEvent) => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      mouseRef.current = {
        x: Math.max(-1, Math.min(1, (e.clientX / ww - 0.5) * 2)),
        y: Math.max(-1, Math.min(1, (e.clientY / wh - 0.5) * 2)),
      };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = (now: number) => {
      if (!isVisibleRef.current) {
        lastTimeRef.current = now;
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = (now - (lastTimeRef.current || now)) / 1000;
      lastTimeRef.current = now;
      timeRef.current += delta;

      const rect = container.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, timeRef.current);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // IntersectionObserver for performance
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      io.disconnect();
    };
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
