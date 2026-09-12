"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Padel racket head profile: a rounded diamond/teardrop, traced with quadratic
// curves so the silhouette reads as a paddle rather than a tennis racket.
function buildHeadShape() {
  const shape = new THREE.Shape();
  const w = 1.05;
  const hTop = 1.55;
  const hBottom = 0.35;
  shape.moveTo(0, hTop);
  shape.quadraticCurveTo(w, hTop * 0.72, w * 0.98, 0.15);
  shape.quadraticCurveTo(w * 0.95, -hBottom * 1.4, 0, -hBottom);
  shape.quadraticCurveTo(-w * 0.95, -hBottom * 1.4, -w * 0.98, 0.15);
  shape.quadraticCurveTo(-w, hTop * 0.72, 0, hTop);
  return shape;
}

// Perforation pattern baked into a canvas texture instead of real geometry
// holes (no boolean/CSG dependency, and it reads convincingly at hero scale).
function makeFaceTexture(accent, dot) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, accent[0]);
  grad.addColorStop(1, accent[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = dot;
  const spacing = 30;
  const radius = 7;
  for (let y = 60; y < size - 60; y += spacing) {
    for (let x = 60; x < size - 60; x += spacing) {
      const cx = size / 2,
        cy = size * 0.44;
      const dx = (x - cx) / (size * 0.42);
      const dy = (y - cy) / (size * 0.5);
      if (dx * dx + dy * dy < 1) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function RacketModel({ reduceMotion }) {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const headGeometry = useMemo(() => {
    const shape = buildHeadShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.center();
    return geo;
  }, []);

  const faceTexture = useMemo(() => makeFaceTexture(["#3a1a0c", "#1c0f08"], "#ff5a1f"), []);

  const handleGeometry = useMemo(() => new THREE.CapsuleGeometry(0.16, 0.9, 6, 12), []);

  useFrame((state, delta) => {
    if (!group.current || reduceMotion) return;

    group.current.rotation.y += delta * 0.32;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;

    // Pointer parallax: gently lean toward the cursor.
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04;
    group.current.rotation.x = -pointer.current.y * 0.25;
    group.current.rotation.z = pointer.current.x * 0.12;
  });

  return (
    <group ref={group} rotation={[0.15, 0.6, 0]} position={[0, 0.1, 0]} scale={1.05}>
      <mesh geometry={headGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={faceTexture}
          roughness={0.38}
          metalness={0.12}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>
      <mesh geometry={handleGeometry} position={[0, -2.05, 0]} castShadow>
        <meshStandardMaterial color="#161009" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, -1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.03, 8, 24]} />
        <meshStandardMaterial color="#FF8A3D" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
