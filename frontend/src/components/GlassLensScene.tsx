"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function LensMesh({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport, size } = useThree();
  const targetPos = new THREE.Vector3();
  const currentScale = useRef(1);

  useFrame(() => {
    if (groupRef.current) {
      targetPos.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        1.5
      );
      groupRef.current.position.lerp(targetPos, 0.15);

      const targetRadiusPx = isHovered ? 100 : 50;
      const targetRadius3D = (targetRadiusPx / size.width) * viewport.width;

      currentScale.current += (targetRadius3D - currentScale.current) * 0.12;
      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Glass Sphere (Flattened by parent group) */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          transmission={1} // 100% glass, no milky solid color
          thickness={1.5}  // Thickness drives the refraction amount
          roughness={0.18} // High roughness for the strong blur seen in the image
          ior={1.2}        // Low IOR to prevent extreme edge warping
          chromaticAberration={0.15} // High RGB splitting
          clearcoat={0}    // No shiny 3D bubble glare
          envMapIntensity={0} // No surface reflections, pure 2D cutout look
          backside
        />
      </mesh>

      {/* Crisp, thin 2D White Border */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.985, 1.0, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.35} 
          depthTest={false} 
        />
      </mesh>
    </group>
  );
}

function SceneText({ setHovered }: { setHovered: (v: boolean) => void }) {
  const { viewport } = useThree();

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
        color="#fb923c"
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

          {/* The environment provides the light/colors that the glass refracts. 
              Without this, the glass refracts the empty transparent canvas (which is black). */}
          <Environment preset="city" />
          
          <SceneText setHovered={setIsHovered} />
          <group scale={[1, 1, 0.25]}>
            {/* The Z scale flattens the sphere so it acts like a subtle magnifying glass instead of a warping marble */}
            <LensMesh isHovered={isHovered} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
