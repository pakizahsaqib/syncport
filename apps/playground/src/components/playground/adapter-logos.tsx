"use client";

import { useState } from "react";
import { ADAPTER_LOGOS } from "@/lib/adapter-brands";
import type { AdapterId } from "@/lib/presets";
import { cn } from "@/lib/utils";

interface AdapterLogoProps {
  id: AdapterId;
  size?: number;
  className?: string;
  /** Show white padded frame (recommended in adapter cards) */
  framed?: boolean;
}

export function AdapterLogo({ id, size = 28, className, framed = true }: AdapterLogoProps) {
  const logo = ADAPTER_LOGOS[id];
  const sources = [logo.src, logo.fallback];
  const [srcIndex, setSrcIndex] = useState(0);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        framed && "rounded-md border border-ide-border bg-ide-logo-frame p-1 shadow-sm",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources[srcIndex]}
        alt={logo.alt}
        width={framed ? size - 8 : size}
        height={framed ? size - 8 : size}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (srcIndex < sources.length - 1) {
            setSrcIndex((i) => i + 1);
          }
        }}
      />
    </span>
  );
}
