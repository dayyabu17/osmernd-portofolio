"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface NoisyGradientBackgroundProps {
  className?: string;
}

export interface NoisyGradientHandle {
  setTransition: (val: number) => void;
}

const vertexShader = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform float uTransition; // 0 = Hero, 1 = AboutMe

// ── 3D Simplex Noise Function ──
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z); 

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// ── Static White Noise for Film Grain ──
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// ── Hero Palette (Extremely Subtle Dark Blue) ──
vec3 getHeroColor(float n) {
    vec3 colorBase = vec3(0.015, 0.025, 0.04);
    vec3 colorMid = vec3(0.025, 0.04, 0.07);
    vec3 colorHighlight = vec3(0.04, 0.06, 0.1);
    vec3 color = mix(colorBase, colorMid, smoothstep(0.1, 0.5, n));
    return mix(color, colorHighlight, smoothstep(0.5, 0.9, n));
}

// ── About Me Palette (Vibrant Magenta, Orange, Cyan with distinct shapes) ──
vec3 getAboutColor(float n, vec2 st) {
    // Spatial layout to create distinct blobs instead of a muddy gradient
    vec3 orange = vec3(0.8, 0.4, 0.05); // Bottom Left Edge
    vec3 magenta = vec3(0.45, 0.02, 0.3); // Left Side Vertical
    vec3 teal = vec3(0.02, 0.55, 0.55); // Right Side Sweep
    vec3 darkPurple = vec3(0.03, 0.0, 0.06); // Deep space between
    
    // Create base zones based on screen coordinates
    float leftZone = smoothstep(0.6, 0.1, st.x); // Stronger on the left
    float rightZone = smoothstep(0.4, 0.9, st.x); // Stronger on the right
    float bottomZone = smoothstep(0.5, 0.0, st.y); // Stronger at the bottom
    
    // Distort the zones with noise to make them organic
    float distortedLeft = smoothstep(0.2, 0.8, leftZone * n * 1.5);
    float distortedRight = smoothstep(0.3, 0.9, rightZone * n * 1.2);
    float distortedBottom = smoothstep(0.4, 1.0, bottomZone * leftZone * n * 2.0);
    
    // Mix the colors distinctly
    vec3 finalCol = darkPurple;
    finalCol = mix(finalCol, magenta, distortedLeft);
    finalCol = mix(finalCol, teal, distortedRight);
    
    // Add the bright orange highlight at the bottom left
    finalCol = mix(finalCol, orange, distortedBottom);

    return finalCol;
}

void main() {
    // Normalize coordinates
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 stRatio = st;
    stRatio.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.12; // Slightly slower organic movement
    vec3 coord = vec3(stRatio * 1.0, t); // Scaled for larger blobs

    // Calculate base noise
    float n = 0.0;
    n += 1.0 * snoise(coord);
    n += 0.5 * snoise(coord * 1.5 - vec3(t * 0.5));
    n = n * 0.5 + 0.5; // Normalize roughly to 0..1

    // Morph the noise shape dynamically based on transition
    // During Hero (0), noise is very flat. During About (1), noise is high-contrast
    float dynamicNoise = mix(n * 0.8, smoothstep(0.2, 0.8, n), smoothstep(0.1, 0.9, uTransition));

    // Calculate both color palettes
    vec3 heroColor = getHeroColor(dynamicNoise);
    vec3 aboutColor = getAboutColor(dynamicNoise, st);

    // Smoothly morph between the two based on transition value
    vec3 color = mix(heroColor, aboutColor, smoothstep(0.0, 1.0, uTransition));

    // Apply Static Grain / Noise Overlay
    float grain = rand(gl_FragCoord.xy) - 0.5;
    color += grain * 0.08;

    fragColor = vec4(color, 1.0);
}
`;

const NoisyGradientBackground = forwardRef<NoisyGradientHandle, NoisyGradientBackgroundProps>(
  ({ className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const programRef = useRef<Program | null>(null);

    useImperativeHandle(ref, () => ({
      setTransition: (val: number) => {
        if (programRef.current) {
          programRef.current.uniforms.uTransition.value = val;
        }
      }
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Setup OGL Renderer
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const renderer = new Renderer({ dpr, alpha: false, antialias: false });
      rendererRef.current = renderer;
      const gl = renderer.gl;

      gl.canvas.style.position = "absolute";
      gl.canvas.style.inset = "0";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      container.appendChild(gl.canvas);

      // 2. Setup Program (Shader)
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] as [number, number] },
          uTransition: { value: 0 },
        },
      });
      programRef.current = program;

      // 3. Setup Mesh
      const geometry = new Triangle(gl);
      const mesh = new Mesh(gl, { geometry, program });

      // 4. Resize Handler
      const resize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      };
      window.addEventListener("resize", resize);
      resize();

      // 5. Animation Loop
      let rafId = 0;
      let lastTime = performance.now();
      let accumTime = 0;

      const update = (now: number) => {
        const dt = Math.max(0, now - lastTime) * 0.001;
        lastTime = now;

        if (!document.hidden) {
          accumTime += dt;
          program.uniforms.uTime.value = accumTime;
          renderer.render({ scene: mesh });
        }
        
        rafId = requestAnimationFrame(update);
      };

      rafId = requestAnimationFrame(update);

      // 6. Cleanup
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        try {
          if (container && gl.canvas) container.removeChild(gl.canvas);
        } catch (e) {}
        rendererRef.current = null;
        programRef.current = null;
      };
    }, []);

    return <div ref={containerRef} className={`w-full h-full overflow-hidden ${className}`} />;
  }
);

NoisyGradientBackground.displayName = "NoisyGradientBackground";

export default NoisyGradientBackground;
