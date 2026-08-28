import React, { useState, useEffect } from "react";
import { ResearchDossier } from "./types";
import { Header } from "./components/Header";
import { ResearchInput } from "./components/ResearchInput";
import { DossierView } from "./components/DossierView";
import { AnalyzingOverlay } from "./components/AnalyzingOverlay";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AlertCircle } from "lucide-react";

const STORAGE_KEY = "bureau_research_archive_v1";

export default function App() {
  const [currentDossier, setCurrentDossier] = useState<ResearchDossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [history, setHistory] = useState<ResearchDossier[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load archive from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveDossierToHistory = (dossier: ResearchDossier) => {
    setHistory((prev) => {
      // Remove duplicate if same ID or query
      const filtered = prev.filter((item) => item.id !== dossier.id);
      const updated = [dossier, ...filtered].slice(0, 30); // Keep last 30
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
  };

  const handleAnalyze = async (queryText: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(queryText);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      const dossier: ResearchDossier = await response.json();
      setCurrentDossier(dossier);
      saveDossierToHistory(dossier);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Research analysis error:", err);
      setError(err?.message || "An unexpected error occurred during dossier deconstruction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setCurrentDossier(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Background ambient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Persistent Bureau Header */}
        <Header
          onNewSearch={handleNewSearch}
          onOpenHistory={() => setIsHistoryOpen(true)}
          historyCount={history.length}
          hasActiveDossier={!!currentDossier}
        />

        <main className="flex-1 flex flex-col">
          {error && (
            <div className="max-w-3xl mx-auto px-4 mt-4 w-full">
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-mono-code flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block mb-1">
                    Analysis Error:
                  </span>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-rose-400 hover:text-rose-100 font-bold px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <AnalyzingOverlay query={currentQuery} />
          ) : currentDossier ? (
            <DossierView
              dossier={currentDossier}
              onNewSearch={handleNewSearch}
            />
          ) : (
            <ResearchInput
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Minimalist Bureau Footer */}
        <footer className="mt-auto border-t border-neutral-900/80 py-4 px-4 text-center text-[11px] font-mono-code text-neutral-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>THE RESEARCH BUREAU // SPECULATIVE SCIENCES DIVISION</span>
            <span>EPISTEMIC CERTAINTY AUDIT v2.4</span>
          </div>
        </footer>
      </div>

      {/* History Archive Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDossier={(dossier) => {
          setCurrentDossier(dossier);
          setError(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onClearHistory={handleClearHistory}
        activeDossierId={currentDossier?.id}
      />
    </div>
  );
}
