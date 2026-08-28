import React from "react";
import { ResearchDossier } from "../types";
import { EpistemicBadge } from "./EpistemicBadge";
import { X, Trash2, Clock, ChevronRight, FileText } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ResearchDossier[];
  onSelectDossier: (dossier: ResearchDossier) => void;
  onClearHistory: () => void;
  activeDossierId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDossier,
  onClearHistory,
  activeDossierId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono-code text-neutral-100 uppercase tracking-wider">
              Research Archive
            </h3>
            <span className="text-xs font-mono-code text-neutral-500">
              ({history.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Dossiers */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-neutral-500 text-xs font-mono-code">
              <FileText className="w-8 h-8 text-neutral-700 mb-2" />
              <span>No research dossiers archived yet.</span>
              <span className="text-[11px] text-neutral-600 mt-1">
                Completed analyses will be saved locally here.
              </span>
            </div>
          ) : (
            history.map((item) => {
              const isActive = item.id === activeDossierId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectDossier(item);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? "bg-cyan-950/40 border-cyan-500/50 shadow-inner"
                      : "bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono-code text-neutral-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <EpistemicBadge tier={item.epistemicTier} className="scale-90 origin-right" />
                  </div>

                  <h4 className="text-xs font-bold text-neutral-200 line-clamp-2 font-sans mb-1">
                    {item.originalQuery || item.coreQuestion.clarifiedQuestion}
                  </h4>

                  <p className="text-[11px] text-neutral-400 line-clamp-1 font-sans">
                    {item.executiveVerdict}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Archive</span>
            </button>
            <span className="text-[10px] font-mono-code text-neutral-500">
              Local Storage Cache
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
