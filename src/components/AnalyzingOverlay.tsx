import React, { useEffect, useState } from "react";
import { Compass, ShieldCheck, Cpu, Database, Flame, FileText } from "lucide-react";

interface AnalyzingOverlayProps {
  query: string;
}

const STAGES = [
  { label: "Deconstructing core assumptions & narrative premise...", icon: Compass },
  { label: "Auditing against empirical physics & thermodynamic laws...", icon: Flame },
  { label: "Evaluating mathematical consistency & theoretical frameworks...", icon: Cpu },
  { label: "Categorizing fact, plausibility, speculation, and fallacies...", icon: Database },
  { label: "Synthesizing sci-fi story implications & worldbuilding hooks...", icon: ShieldCheck },
  { label: "Compiling 10-section research dossier...", icon: FileText },
];

export const AnalyzingOverlay: React.FC<AnalyzingOverlayProps> = ({ query }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STAGES[stageIndex].icon;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4 py-8 rounded-2xl bg-neutral-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Radar / Core Animation */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950/50 border border-cyan-500/40">
          <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-25" />
          <div className="w-14 h-14 rounded-full bg-neutral-950 flex items-center justify-center text-cyan-400 border border-cyan-500/60 shadow-lg shadow-cyan-950">
            <CurrentIcon className="w-7 h-7 animate-pulse text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[11px] font-mono-code text-cyan-300 mb-2">
            <span>AUDITING PREMISE</span>
            <span className="animate-pulse">●</span>
          </div>
          <h3 className="text-lg font-bold font-mono-code text-neutral-100 uppercase tracking-wide">
            {STAGES[stageIndex].label}
          </h3>
          <p className="mt-2 text-xs font-mono-code text-neutral-400 max-w-md mx-auto line-clamp-2 italic">
            "{query}"
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        <div className="text-[10px] font-mono-code text-neutral-500 uppercase tracking-wider">
          Epistemic Scrutiny in Progress • The Research Bureau
        </div>
      </div>
    </div>
  );
};
