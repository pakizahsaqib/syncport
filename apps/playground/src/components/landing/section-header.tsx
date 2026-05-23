import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { landingType } from "./typography";

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  className,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", "mb-10 max-w-2xl", centered && "mx-auto", className)}>
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <h2 className={landingType.sectionTitle}>{title}</h2>
      {description ? <p className={cn("mt-4", landingType.lead)}>{description}</p> : null}
    </div>
  );
}
