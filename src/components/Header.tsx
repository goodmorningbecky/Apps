import React from "react";
import { Compass, History, Sparkles, BookOpen, RotateCcw } from "lucide-react";

interface HeaderProps {
  onNewSearch: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  hasActiveDossier: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewSearch,
  onOpenHistory,
  historyCount,
  hasActiveDossier,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md px-4 py-3 sm:px-6"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div
          onClick={onNewSearch}
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-neutral-900 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-inner">
            <Compass className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-wider font-mono-code text-neutral-100 uppercase">
                The Research Bureau
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 font-mono-code font-medium">
                SCI-FI INTEL
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono-code tracking-tight">
              Epistemic Analysis & Speculative Science Agent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveDossier && (
            <button
              id="header-new-query-btn"
              onClick={onNewSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-code text-neutral-300 hover:text-cyan-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all active:scale-95"
              title="Start New Research"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Query</span>
            </button>
          )}

          <button
            id="header-history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-all active:scale-95 relative"
            title="View Research Archive"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">Archive</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono-code font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
