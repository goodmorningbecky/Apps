import React from "react";

interface EpistemicBadgeProps {
  tier: string;
  className?: string;
}

export const EpistemicBadge: React.FC<EpistemicBadgeProps> = ({ tier, className = "" }) => {
  let badgeStyles = "bg-neutral-800 text-neutral-300 border-neutral-700";
  let label = tier.replace(/_/g, " ");

  switch (tier) {
    case "ESTABLISHED_FACT":
      badgeStyles = "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950";
      label = "Established Fact";
      break;
    case "SCIENTIFICALLY_PLAUSIBLE":
      badgeStyles = "bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950";
      label = "Scientifically Plausible";
      break;
    case "THEORETICALLY_SPECULATIVE":
      badgeStyles = "bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950";
      label = "Theoretically Speculative";
      break;
    case "PHYSICALLY_IMPLAUSIBLE":
      badgeStyles = "bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950";
      label = "Physically Implausible / Unsupported";
      break;
    case "PARADOXICAL":
      badgeStyles = "bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-950";
      label = "Paradoxical / Conjectural";
      break;
    default:
      badgeStyles = "bg-cyan-950/80 text-cyan-300 border-cyan-500/40";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono-code uppercase tracking-wider font-semibold rounded-full border ${badgeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  );
};
