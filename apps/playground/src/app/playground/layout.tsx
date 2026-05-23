"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("playground-dark", theme === "dark");
    return () => {
      document.documentElement.classList.remove("playground-dark");
    };
  }, [theme]);

  return children;
}
