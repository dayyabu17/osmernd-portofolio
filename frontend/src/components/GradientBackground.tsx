"use client";

/**
 * GradientBackground Component
 * A high-performance WebGL gradient background with subtle motion and optional hover drift.
 */

import React, { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

export type GradientProps = {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate";
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
  className?: string;
};

const GradientBackground: React.FC<GradientProps> = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.4 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    const TS = Math.max(0, timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));

    const driftStrength =
      animationType === "3drotate" ? 0.9 : animationType === "hover" ? 0.15 : 0.45;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({
      dpr,
      alpha: transparent,
      antialias: false,
    });

    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    } as Partial<CSSStyleDeclaration>);

    container.appendChild(gl.canvas);

    const vertex = /* glsl */ `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform vec2  iResolution;
      uniform float iTime;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uTimeScale;
      uniform float uDriftStrength;
      uniform vec2  uPointer;
      uniform int   uUsePointer;
      uniform float uHoverStrength;

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) / iResolution.y;
        float t = iTime * uTimeScale;
        vec2 drift = uDriftStrength * vec2(cos(t * 0.4), sin(t * 0.3));
        if (uUsePointer == 1) {
          drift += uPointer * uHoverStrength * 0.35;
        }

        vec2 p = uv * (0.6 + uScale * 0.18) + drift;
        float g1 = 0.5 + 0.5 * sin((p.x + p.y) * uColorFreq + t * 0.25);
        float g2 = 0.5 + 0.5 * sin((p.x * 1.4 - p.y * 0.6) * (uColorFreq * 0.85) - t * 0.2);

        vec3 c0 = vec3(0.0);
        vec3 c1 = vec3(0.05, 0.26, 0.5);
        vec3 c2 = vec3(0.72, 0.52, 0.9);
        vec3 c3 = vec3(0.1, 0.7, 0.75);
        vec3 col = mix(c1, c2, g1);
        col = mix(col, c3, g2 * 0.65);

        vec2 b1 = vec2(0.6 * cos(t * 0.25), 0.6 * sin(t * 0.22));
        vec2 b2 = vec2(0.45 * cos(t * 0.31 + 1.7), 0.55 * sin(t * 0.27 + 0.8));
        vec2 b3 = vec2(0.5 * cos(t * 0.19 - 1.1), 0.4 * sin(t * 0.21 - 0.4));
        float f1 = 0.18 / (length(uv + drift * 0.7 - b1) + 0.18);
        float f2 = 0.15 / (length(uv + drift * 0.8 - b2) + 0.2);
        float f3 = 0.16 / (length(uv + drift * 0.6 - b3) + 0.2);
        float goo = clamp(f1 + f2 + f3, 0.0, 1.8);
        float blackMix = smoothstep(0.35, 1.1, goo);

        float vignette = smoothstep(1.4, 0.2, length(uv));
        vec3 colored = col * mix(0.85, 1.2, vignette);
        colored *= (0.55 + 0.45 * uGlow) * (0.7 + 0.3 * uBloom);

        float n = rand(gl_FragCoord.xy + vec2(iTime));
        colored += (n - 0.5) * (uNoise * 0.6);
        colored = clamp(colored, 0.0, 1.0);

        col = mix(c0, colored, blackMix);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if (abs(uHueShift) > 0.0001) {
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);
    const pointerBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uTimeScale: { value: TS },
        uDriftStrength: { value: driftStrength },
        uPointer: { value: pointerBuf },
        uUsePointer: { value: 0 },
        uHoverStrength: { value: HOVSTR },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0;
    const t0 = performance.now();

    const startRAF = () => {
      if (raf) return;
      raf = requestAnimationFrame(render);
    };

    const stopRAF = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      const cx = ww * 0.5;
      const cy = wh * 0.5;
      const nx = (e.clientX - cx) / (ww * 0.5);
      const ny = (e.clientY - cy) / (wh * 0.5);
      pointer.tx = Math.max(-1, Math.min(1, nx));
      pointer.ty = Math.max(-1, Math.min(1, ny));
      pointer.inside = true;
    };

    const onLeave = () => {
      pointer.inside = false;
    };

    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    if (animationType === "hover") {
      onPointerMove = (e: PointerEvent) => {
        onMove(e);
        startRAF();
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;

      let continueRAF = true;
      if (animationType === "hover") {
        const targetX = pointer.inside ? pointer.tx : 0;
        const targetY = pointer.inside ? pointer.ty : 0;
        pointer.x = lerp(pointer.x, targetX, INERT);
        pointer.y = lerp(pointer.y, targetY, INERT);
        pointerBuf[0] = pointer.x;
        pointerBuf[1] = pointer.y;

        if (NOISE_IS_ZERO && TS < 1e-6) {
          const settled =
            Math.abs(pointer.x - targetX) < 1e-4 &&
            Math.abs(pointer.y - targetY) < 1e-4;
          if (settled) continueRAF = false;
        }
      }

      renderer.render({ scene: mesh });
      if (continueRAF) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    interface GradientContainer extends HTMLElement {
      __gradientIO?: IntersectionObserver;
    }

    if (suspendWhenOffscreen) {
      const io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) startRAF();
        else stopRAF();
      });
      io.observe(container);
      startRAF();
      (container as GradientContainer).__gradientIO = io;
    } else {
      startRAF();
    }

    return () => {
      stopRAF();
      ro.disconnect();
      if (animationType === "hover") {
        if (onPointerMove)
          window.removeEventListener(
            "pointermove",
            onPointerMove as EventListener
          );
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
      }
      if (suspendWhenOffscreen) {
        const io = (container as GradientContainer).__gradientIO as
          | IntersectionObserver
          | undefined;
        if (io) io.disconnect();
        delete (container as GradientContainer).__gradientIO;
      }
      if (gl.canvas.parentElement === container)
        container.removeChild(gl.canvas);
    };
  }, [
    height,
    baseWidth,
    animationType,
    glow,
    noise,
    offset?.x,
    offset?.y,
    scale,
    transparent,
    hueShift,
    colorFrequency,
    timeScale,
    hoverStrength,
    inertia,
    bloom,
    suspendWhenOffscreen,
  ]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className}`}
      ref={containerRef}
    />
  );
};

export default GradientBackground;
