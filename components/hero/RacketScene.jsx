"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import RacketModel from "./RacketModel.jsx";

function CanvasA11y() {
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.setAttribute("role", "img");
    gl.domElement.setAttribute(
      "aria-label",
      "Інтерактивна 3D-модель ракетки для падел-тенісу, що обертається у просторі."
    );
    gl.domElement.setAttribute("tabindex", "-1");
  }, [gl]);
  return null;
}

export default function RacketScene() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.2, 6.4], fov: 32 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CanvasA11y />
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} color="#FFD9A8" castShadow />
      <directionalLight position={[-3, 1, 4]} intensity={0.9} color="#FFB84D" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#5B7FFF" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#FF5A1F" />
      <RacketModel reduceMotion={reduceMotion} />
    </Canvas>
  );
}
