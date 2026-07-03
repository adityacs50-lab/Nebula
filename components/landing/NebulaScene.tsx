"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The hero galaxy: a particle spiral in Nebula's brand palette
 * (pink core -> violet arms -> blue rim) that slowly rotates and tilts
 * toward the mouse. Rendered with additive blending so overlapping
 * particles bloom like gas clouds.
 */
function Galaxy() {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const { positions, colors } = useMemo(() => {
    const count = 7000;
    const branches = 4;
    const maxRadius = 6.5;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const core = new THREE.Color("#EC4899");
    const mid = new THREE.Color("#7C3AED");
    const rim = new THREE.Color("#3B82F6");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 0.65) * maxRadius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = radius * 0.75;

      // Cubed random offsets cluster particles tight to the arms while
      // still letting a few drift into the void between them.
      const spread = 0.45 + radius * 0.12;
      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread * 0.55;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

      const t = radius / maxRadius;
      const color = core.clone();
      if (t < 0.45) color.lerp(mid, t / 0.45);
      else color.copy(mid).lerp(rim, (t - 0.45) / 0.55);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.045;
    if (group.current) {
      // Ease the whole galaxy toward the pointer for a weighty parallax
      const targetX = state.pointer.y * 0.12;
      const targetY = state.pointer.x * 0.22;
      group.current.rotation.x +=
        (targetX - group.current.rotation.x) * 0.04;
      group.current.rotation.z +=
        (targetY * 0.35 - group.current.rotation.z) * 0.04;
    }
  });

  return (
    <group ref={group} rotation={[0.42, 0, 0.12]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          sizeAttenuation
          vertexColors
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Distant static stars so the space behind the galaxy isn't dead black. */
function Stars() {
  const positions = useMemo(() => {
    const count = 1200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color="#8b8b9e"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export default function NebulaScene() {
  return (
    <Canvas
      camera={{ position: [0, 2.1, 7.5], fov: 48 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={
        typeof document !== "undefined" ? document.body : undefined
      }
    >
      <Galaxy />
      <Stars />
    </Canvas>
  );
}
