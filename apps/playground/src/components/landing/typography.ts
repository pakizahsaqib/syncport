/**
 * Landing page type scale — 16px body base, common SaaS/modular steps.
 * @see https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html
 */
export const landingType = {
  /** Hero headline — 36–48px responsive */
  display: "text-4xl font-bold tracking-tight text-ide-fg sm:text-5xl lg:text-6xl",
  /** Section headings — 24–30px */
  sectionTitle: "text-2xl font-semibold tracking-tight text-ide-fg sm:text-3xl",
  /** Feature / adapter card titles — 18px */
  cardTitle: "text-lg font-semibold text-ide-fg",
  /** Hero & section intros — 18–20px */
  lead: "text-lg leading-relaxed text-ide-muted sm:text-xl",
  /** Body copy, lists, card descriptions — 16px */
  body: "text-base leading-relaxed text-ide-muted",
  /** Eyebrow labels — 14px */
  eyebrow: "text-sm text-ide-muted",
  /** Footer, metadata — 14px */
  caption: "text-sm text-ide-muted",
  /** Primary actions — 14px */
  button: "text-sm font-medium",
  /** Inline code blocks — 14px mono */
  code: "font-mono text-sm leading-relaxed text-ide-fg",
  /** Compact hover tooltips — 13px, tight line height */
  tooltip: "text-[13px] leading-tight",
} as const;
