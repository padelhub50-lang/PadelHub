"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A padel racket's head is not a smooth teardrop: it has a rounded top,
// widens across the middle, then pulls in sharply into a narrow "throat"
// before the handle — that waist is what makes the silhouette read as a
// padel bat rather than a generic paddle blob.
function buildHeadShape() {
  const shape = new THREE.Shape();
  const w = 1.12;
  const topY = 1.5;
  const wideY = 0.45;
  const neckY = -1.05;
  const neckW = 0.3;
  const bottomY = -1.32;

  shape.moveTo(0, topY);
  shape.quadraticCurveTo(w * 1.02, topY * 0.78, w, wideY);
  shape.quadraticCurveTo(w * 0.94, neckY * 0.35, neckW, neckY);
  shape.quadraticCurveTo(neckW * 1.15, bottomY * 0.9, 0, bottomY);
  shape.quadraticCurveTo(-neckW * 1.15, bottomY * 0.9, -neckW, neckY);
  shape.quadraticCurveTo(-w * 0.94, neckY * 0.35, -w, wideY);
  shape.quadraticCurveTo(-w * 1.02, topY * 0.78, 0, topY);
  return shape;
}

// Slightly smaller inset of the same silhouette, so the outer ring reads as
// the racket's rubber protective bumper rather than a flat painted stripe.
function buildFaceShape() {
  const shape = new THREE.Shape();
  const s = 0.9;
  const w = 1.12 * s;
  const topY = 1.5 * s;
  const wideY = 0.45 * s;
  const neckY = -1.05 * s;
  const neckW = 0.3 * s;
  const bottomY = -1.32 * s;

  shape.moveTo(0, topY);
  shape.quadraticCurveTo(w * 1.02, topY * 0.78, w, wideY);
  shape.quadraticCurveTo(w * 0.94, neckY * 0.35, neckW, neckY);
  shape.quadraticCurveTo(neckW * 1.15, bottomY * 0.9, 0, bottomY);
  shape.quadraticCurveTo(-neckW * 1.15, bottomY * 0.9, -neckW, neckY);
  shape.quadraticCurveTo(-w * 0.94, neckY * 0.35, -w, wideY);
  shape.quadraticCurveTo(-w * 1.02, topY * 0.78, 0, topY);
  return shape;
}

// Perforation grid baked into a canvas texture (no boolean/CSG dependency).
// Real padel faces read as a dense, evenly-spaced hex grid of holes with a
// clean, unperforated border near the frame — not scattered random dots.
function makeFaceTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#FF7A3D");
  grad.addColorStop(1, "#C4440F");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const cx = size * 0.5;
  const cy = size * 0.46;
  const rx = size * 0.36;
  const ry = size * 0.43;
  const rowH = 24;
  const holeR = 6.5;

  ctx.fillStyle = "#241209";
  let row = 0;
  for (let y = cy - ry; y < cy + ry; y += rowH) {
    const offsetX = row % 2 === 0 ? 0 : rowH / 2;
    for (let x = cx - rx; x < cx + rx; x += rowH) {
      const px = x + offsetX;
      const dx = (px - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy < 0.92) {
        ctx.beginPath();
        ctx.arc(px, y, holeR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    row++;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Diagonal overgrip wrap for the handle instead of a bare plastic cylinder.
function makeGripTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#14100b";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#241a10";
  ctx.lineWidth = 10;
  for (let i = -size; i < size * 2; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

export default function RacketModel({ reduceMotion }) {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const bumperGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildHeadShape(), {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: 4,
      curveSegments: 28,
    });
    geo.center();
    return geo;
  }, []);

  const faceGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildFaceShape(), {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 3,
      curveSegments: 28,
    });
    geo.center();
    return geo;
  }, []);

  const faceTexture = useMemo(() => makeFaceTexture(), []);
  const gripTexture = useMemo(() => makeGripTexture(), []);

  // Short tapered throat bridging the head's neck into the handle.
  const throatGeometry = useMemo(() => new THREE.CylinderGeometry(0.24, 0.15, 0.36, 16), []);
  const handleGeometry = useMemo(() => new THREE.CapsuleGeometry(0.155, 1.05, 6, 12), []);

  useFrame((state, delta) => {
    if (!group.current || reduceMotion) return;

    group.current.rotation.y += delta * 0.32;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;

    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04;
    group.current.rotation.x = -pointer.current.y * 0.25;
    group.current.rotation.z = pointer.current.x * 0.12;
  });

  return (
    <group ref={group} rotation={[0.15, 0.6, 0]} position={[0, 0.15, 0]} scale={0.92}>
      {/* Bumper (protective rubber edge) sits behind, slightly larger. */}
      <mesh geometry={bumperGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#100b07" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Perforated hitting face, inset in front of the bumper. */}
      <mesh geometry={faceGeometry} position={[0, 0, 0.01]} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={faceTexture}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
        />
      </mesh>

      <mesh geometry={throatGeometry} position={[0, -1.55, 0]} scale={[1, 1, 0.55]} castShadow>
        <meshStandardMaterial color="#100b07" roughness={0.6} metalness={0.1} />
      </mesh>

      <mesh geometry={handleGeometry} position={[0, -2.35, 0]} castShadow>
        <meshStandardMaterial map={gripTexture} roughness={0.85} metalness={0} />
      </mesh>

      {/* Wrist-strap loop at the very end of the grip, not the throat. */}
      <mesh position={[0, -2.98, 0.08]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.1, 0.022, 8, 20]} />
        <meshStandardMaterial color="#FF8A3D" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}
