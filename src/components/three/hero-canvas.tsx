"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { Cpu, Sparkles } from "lucide-react";
import { useDeviceCheck } from "@/components/providers/device-check-provider";

export function FuturisticOrb() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    if (!meshRef.current) return;
    const animation = gsap.to(meshRef.current.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      animation.kill();
    };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#38bdf8" wireframe />
      </mesh>
    </Float>
  );
}

export function HeroCanvas() {
  const { canRender3D, isLowEndDevice, reason } = useDeviceCheck();

  // Fallback 2D jika perangkat terdeteksi low-end atau tidak mendukung WebGL
  if (!canRender3D) {
    return (
      <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-sky-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0,transparent_70%)]" />
        <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Sparkles className="size-7 animate-pulse" />
        </div>
        <div className="relative z-10 mt-3 flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-slate-200">
            Visual Futuristik OSIS (Fallback 2D)
          </h3>
          <p className="max-w-md text-xs text-slate-400">
            {isLowEndDevice
              ? `Mode hemat daya aktif (${reason}). Akselerasi 3D dimatikan untuk performa optimal.`
              : "Menyiapkan kanvas grafis..."}
          </p>
        </div>
        <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-400">
          <Cpu className="size-3 text-sky-400" />
          <span>Optimal Performance Mode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <FuturisticOrb />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
