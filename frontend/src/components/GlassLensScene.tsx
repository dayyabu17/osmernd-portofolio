"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function LensMesh({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport, size } = useThree();
  const targetPos = new THREE.Vector3();
  const currentScale = useRef(1);

  useFrame(() => {
    if (meshRef.current) {
      // 1. Smooth position tracking
      targetPos.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        1.5
      );
      meshRef.current.position.lerp(targetPos, 0.15);

      // 2. Smooth scale (radius) tracking
      const targetRadiusPx = isHovered ? 100 : 50;
      const targetRadius3D = (targetRadiusPx / size.width) * viewport.width;

      currentScale.current += (targetRadius3D - currentScale.current) * 0.12;
      
      // Apply uniform scale (Z is flattened by the parent group)
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Base geometry radius of 1 so the scale exactly matches the target radius */}
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={1.2}
        roughness={0}
        ior={1.4}
        chromaticAberration={0.06}
        clearcoat={1}
        backside
      />
    </mesh>
  );
}

function SceneText({ setHovered }: { setHovered: (v: boolean) => void }) {
  const { viewport } = useThree();

  // Responsive font sizing
  const responsiveFontSize = Math.min(viewport.width * 0.16, 4.5);
  const lineSpacing = responsiveFontSize * 0.9;
  
  return (
    <group 
      position={[0, 0, -2]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Text
        fontSize={responsiveFontSize}
        position={[0, lineSpacing, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.02}
      >
        Creative
      </Text>
      <Text
        fontSize={responsiveFontSize}
        position={[0, 0, 0]}
        color="#fb923c" // Tailwind orange-400
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.02}
      >
        visual
      </Text>
      <Text
        fontSize={responsiveFontSize}
        position={[0, -lineSpacing, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.02}
      >
        designer
      </Text>
    </group>
  );
}

export default function GlassLensScene() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Attach R3F events to the document body so pointer tracking works globally
    setEventSource(document.body);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        eventSource={eventSource || undefined}
        eventPrefix="client"
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* City environment preset gives excellent reflections for glass */}
          <Environment preset="city" />
          
          <SceneText setHovered={setIsHovered} />
          <group scale={[1, 1, 0.3]}>
            {/* We scale the Z axis down to flatten the sphere into a thin lens shape */}
            <LensMesh isHovered={isHovered} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
