import React, { useState } from "react";
import { Sparkles, ArrowRight, CornerDownLeft, Atom, Dna, Rocket, Brain, Globe, ShieldAlert } from "lucide-react";

interface ResearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const PRESET_QUERIES = [
  {
    category: "Astrophysics & Propulsion",
    icon: Rocket,
    title: "Alcubierre Warp & Hawking Radiation",
    query: "Can an Alcubierre warp bubble survive the accumulation of high-energy Hawking-like radiation inside the negative energy cavity during superluminal transit, and how does the pilot decelerate?",
  },
  {
    category: "Exobiology & Biochemistry",
    icon: Dna,
    title: "Cryogenic Silicon-Based Biology",
    query: "Is silicon-based biochemistry viable in cryogenic liquid methane/ethane seas (like Titan), and what metabolic pathways could replace water and oxygen?",
  },
  {
    category: "Megastructures & Engineering",
    icon: Globe,
    title: "Mercury Dyson Swarm Disassembly",
    query: "What are the exact thermodynamic and gravitational limits of disassembling planet Mercury to construct a solar Dyson swarm within a 100-year timeframe?",
  },
  {
    category: "Neuroscience & Identity",
    icon: Brain,
    title: "Consciousness Uploading & No-Cloning",
    query: "If human consciousness relies on quantum states in neural microtubules, does the Quantum No-Cloning Theorem prevent non-destructive brain uploading?",
  },
  {
    category: "Relativistic Warfare",
    icon: Atom,
    title: "Relativistic Kinetic Impactors & Interstellar Dust",
    query: "At 0.95c, how does interstellar hydrogen and micro-meteorite impact erode a relativistic kinetic kill vehicle before it reaches its target star system?",
  },
];

export const ResearchInput: React.FC<ResearchInputProps> = ({
  onSubmit,
  isLoading,
  initialQuery = "",
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSubmit(query.trim());
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8">
      {/* Bureau Agent Header / Scope Statement */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code mb-3 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>BUREAU DECONSTRUCTION PROTOCOL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-100 font-display">
          Scrutinize Your Speculative Premise
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-sans leading-relaxed">
          Submit any sci-fi concept, exotic technology, or worldbuilding problem. The Bureau will rigorously dissect what is established fact, plausible science, speculative theory, and physically impossible.
        </p>
      </div>

      {/* Prominent Research Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative rounded-2xl bg-neutral-900/90 border-2 border-neutral-700/80 focus-within:border-cyan-500/80 shadow-2xl transition-all overflow-hidden">
          {/* Top terminal bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-b border-neutral-800 text-[11px] font-mono-code text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping opacity-75" />
              <span>RESEARCH INTAKE TERMINAL</span>
            </div>
            <span className="text-neutral-500 hidden sm:inline">Ctrl + Enter to Execute</span>
          </div>

          <textarea
            id="research-query-input"
            rows={5}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Enter a research question, fictional concept, technological idea, scientific hypothesis, philosophical premise, or worldbuilding problem..."
            className="w-full bg-transparent px-4 py-3.5 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none font-sans leading-relaxed disabled:opacity-50"
          />

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 bg-neutral-950/60 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono-code">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400/80" />
              <span className="text-[11px]">Uncompromising scientific peer-review applied</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  disabled={isLoading}
                  className="px-3 py-2 text-xs font-mono-code text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                id="submit-research-btn"
                type="submit"
                disabled={!query.trim() || isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono-code font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Dossier...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset Inspirations / Prompts */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider font-semibold">
            Sample Inquiries for Sci-Fi Writers:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_QUERIES.map((preset, index) => {
            const Icon = preset.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setQuery(preset.query);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-start gap-3 p-3 text-left rounded-xl bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800/80 hover:border-cyan-500/40 text-neutral-300 hover:text-neutral-100 transition-all group active:scale-[0.98]"
              >
                <div className="p-2 rounded-lg bg-neutral-800 text-cyan-400 group-hover:bg-cyan-950 group-hover:text-cyan-300 border border-neutral-700/60 group-hover:border-cyan-700/60 shrink-0 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono-code font-bold text-neutral-200 group-hover:text-cyan-300 flex items-center justify-between">
                    <span>{preset.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 font-sans leading-tight">
                    {preset.query}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
