"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles as DreiSparkles } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, Cpu, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeviceCheck } from "@/components/providers/device-check-provider";

gsap.registerPlugin(ScrollTrigger);

function Osis3DLogo() {
  const groupRef = React.useRef<THREE.Group>(null);
  const coreRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.2} rotationIntensity={0.7} floatIntensity={0.9}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      <DreiSparkles count={45} scale={4.5} size={1.8} speed={0.4} color="#7dd3fc" />
    </group>
  );
}

export function HeroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const visualRef = React.useRef<HTMLDivElement>(null);
  const { canRender3D, isLowEndDevice, reason } = useDeviceCheck();

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        visualRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            scrub: false,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-slate-800/80 py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_55%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Kolom Teks Hero */}
        <div ref={contentRef} className="flex flex-col gap-6 lg:col-span-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-300">
            <Sparkles className="size-3.5 text-sky-400" />
            <span>Era Baru Kepemimpinan Siswa SMAN 2 Pangkep</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Portal Digital &{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Inovasi OSIS
            </span>{" "}
            Futuristik
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Pusat transparansi program kerja, struktur kepengurusan, warta kegiatan
            sekolah, serta ruang aspirasi digital siswa SMAN 2 Pangkep yang aman,
            interaktif, dan real-time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/#proker">
              <Button className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 px-5 py-2.5">
                Lihat Roadmap Proker
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/#aspirasi">
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900/70 text-slate-200 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300 px-5 py-2.5"
              >
                <MessageSquarePlus className="mr-2 size-4 text-sky-400" />
                Kirim Aspirasi Siswa
              </Button>
            </Link>
          </div>
        </div>

        {/* Kolom Visual 3D / Fallback Gambar Statis */}
        <div ref={visualRef} className="lg:col-span-5">
          <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-sky-500/25 bg-slate-900/70 shadow-[0_0_40px_rgba(14,165,233,0.12)]">
            {canRender3D ? (
              <Canvas camera={{ position: [0, 0, 4.2], fov: 48 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[4, 4, 4]} intensity={1.4} />
                <Osis3DLogo />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
              </Canvas>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/40 p-6 text-center">
                <div className="relative mb-4 flex size-24 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 shadow-inner">
                  <Image
                    src="/globe.svg"
                    alt="Logo Statis OSIS SMAN 2 Pangkep"
                    width={64}
                    height={64}
                    className="invert opacity-90"
                    priority
                  />
                </div>
                <h2 className="text-sm font-semibold text-white">
                  Mode Visual Statis (Hemat Daya)
                </h2>
                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  {isLowEndDevice
                    ? `Render 3D dinonaktifkan otomatis (${reason}).`
                    : "Menampilkan visual statis ramah perangkat."}
                </p>
              </div>
            )}

            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-1.5 text-[11px] text-slate-400 backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <Cpu className="size-3.5 text-sky-400" />
                {canRender3D ? "WebGL 3D Interactive" : "2D Static Fallback"}
              </span>
              <span className="text-sky-400 font-medium">SMAN 2 PANGKEP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
