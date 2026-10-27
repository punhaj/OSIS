"use client";

import * as React from "react";

export type DeviceTier = "low" | "medium" | "high";

export interface DeviceInfo {
  isLowEndDevice: boolean;
  canRender3D: boolean;
  deviceTier: DeviceTier;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  isMobile: boolean;
  reason: string;
}

const defaultDeviceInfo: DeviceInfo = {
  isLowEndDevice: false,
  canRender3D: true,
  deviceTier: "high",
  hardwareConcurrency: 4,
  deviceMemory: null,
  isMobile: false,
  reason: "Default state during hydration",
};

const DeviceCheckContext = React.createContext<DeviceInfo>(defaultDeviceInfo);

export function DeviceCheckProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(defaultDeviceInfo);

  React.useEffect(() => {
    // 1. Deteksi hardware concurrency (jumlah inti CPU)
    const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;

    // 2. Deteksi device memory API (Chrome/Chromium/Android)
    const memory =
      typeof navigator !== "undefined" && "deviceMemory" in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null
        : null;

    // 3. Deteksi mobile user agent
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

    // 4. Deteksi prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 5. Deteksi kemampuan WebGL
    let supportsWebGL = true;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        supportsWebGL = false;
      }
    } catch {
      supportsWebGL = false;
    }

    // Heuristik Klasifikasi Perangkat:
    // Low-end jika:
    // - Tidak mendukung WebGL
    // - RAM < 4 GB (jika API tersedia)
    // - Cores < 4 pada perangkat mobile
    // - User memilih reduced motion
    let isLow = false;
    let tier: DeviceTier = "high";
    const reasons: string[] = [];

    if (!supportsWebGL) {
      isLow = true;
      tier = "low";
      reasons.push("WebGL tidak didukung");
    } else if (prefersReducedMotion) {
      isLow = true;
      tier = "low";
      reasons.push("Mode reduced-motion aktif");
    } else if (memory !== null && memory < 4) {
      isLow = true;
      tier = "low";
      reasons.push(`RAM terdeteksi rendah (${memory}GB)`);
    } else if (isMobile && cores <= 4) {
      isLow = true;
      tier = "low";
      reasons.push(`Perangkat mobile dengan CPU terbatas (${cores} cores)`);
    } else if (cores < 4) {
      tier = "medium";
      reasons.push(`CPU moderate (${cores} cores)`);
    } else {
      tier = "high";
      reasons.push("Spesifikasi memadai untuk akselerasi 3D");
    }

    setDeviceInfo({
      isLowEndDevice: isLow,
      canRender3D: !isLow && supportsWebGL,
      deviceTier: tier,
      hardwareConcurrency: cores,
      deviceMemory: memory,
      isMobile,
      reason: reasons.join(", "),
    });
  }, []);

  return (
    <DeviceCheckContext.Provider value={deviceInfo}>
      {children}
    </DeviceCheckContext.Provider>
  );
}

export function useDeviceCheck(): DeviceInfo {
  return React.useContext(DeviceCheckContext);
}
