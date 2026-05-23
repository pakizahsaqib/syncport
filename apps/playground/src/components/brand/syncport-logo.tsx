"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";

const LOGOS = {
  light: {
    src: "/syncport-logo.png",
    width: 848,
    height: 173,
  },
  dark: {
    src: "/syncport-logo-dark.png",
    width: 848,
    height: 173,
  },
} as const;

export interface SyncportLogoProps {
  className?: string;
  /** Render height in CSS pixels; width scales proportionally. */
  height?: number;
  /** Accessible label (default: syncport). */
  title?: string;
  priority?: boolean;
  /** `auto` follows playground theme; use `light` on the marketing page. */
  variant?: "light" | "dark" | "auto";
}

/** Official syncport wordmark (transparent PNG). */
export function SyncportLogo({
  className,
  height = 28,
  title = "syncport",
  priority = false,
  variant = "light",
}: SyncportLogoProps) {
  const theme = useThemeStore((s) => s.theme);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const resolved =
    variant === "auto"
      ? hydrated && theme === "dark"
        ? "dark"
        : "light"
      : variant;
  const logo = LOGOS[resolved];
  const aspect = logo.width / logo.height;

  return (
    <Image
      src={logo.src}
      alt={title}
      width={logo.width}
      height={logo.height}
      priority={priority}
      sizes={`${Math.round(height * aspect)}px`}
      className={cn("w-auto shrink-0", className)}
      style={{ height, width: "auto" }}
    />
  );
}
