import React, { useState } from "react";
import { ResearchDossier } from "../types";
import { EpistemicBadge } from "./EpistemicBadge";
import { formatDossierAsMarkdown } from "../utils/dossierFormatter";
import {
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  BookMarked,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Printer,
} from "lucide-react";

interface DossierViewProps {
  dossier: ResearchDossier;
  onNewSearch: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({ dossier, onNewSearch }) => {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleCopyFull = async () => {
    const md = formatDossierAsMarkdown(dossier);
    await navigator.clipboard.writeText(md);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleCopySection = async (sectionKey: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = formatDossierAsMarkdown(dossier);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = dossier.coreQuestion.clarifiedQuestion
      .slice(0, 30)
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    link.href = url;
    link.download = `bureau_dossier_${safeTitle}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Dossier Header Card */}
      <div
        id="dossier-meta-card"
        className="rounded-2xl bg-neutral-900/90 border border-cyan-500/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-bold">
              DOSSIER CLASSIFICATION
            </span>
            <span className="text-neutral-500 text-xs font-mono-code">#{dossier.id.slice(-6)}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <EpistemicBadge tier={dossier.epistemicTier} />
            <span className="text-[11px] font-mono-code text-neutral-400">
              {new Date(dossier.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Executive Verdict */}
        <div className="space-y-2">
          <div className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Executive Epistemic Verdict</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-neutral-100 leading-relaxed font-sans">
            {dossier.executiveVerdict}
          </p>
        </div>

        {/* Global Action Bar for Writer */}
        <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="copy-full-dossier-btn"
              onClick={handleCopyFull}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold uppercase tracking-wider border transition-all active:scale-95 ${
                copiedFull
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700 hover:border-cyan-400/50"
              }`}
            >
              {copiedFull ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dossier Copied (Markdown)</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Full Dossier</span>
                </>
              )}
            </button>

            <button
              id="download-markdown-btn"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-code text-neutral-300 hover:text-neutral-100 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/70 transition-all active:scale-95"
              title="Download as Markdown file"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export .md</span>
            </button>
          </div>

          <button
            onClick={onNewSearch}
            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 underline underline-offset-4 py-1"
          >
            + Analyze Another Concept
          </button>
        </div>
      </div>

      {/* Sticky Mobile Jump-Pills Bar */}
      <div className="sticky top-[57px] z-20 -mx-3 px-3 py-2 bg-neutral-950/95 backdrop-blur-md border-y border-neutral-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:justify-start">
        {[
          { id: "sec-1", label: "1. Core" },
          { id: "sec-2", label: "2. Facts" },
          { id: "sec-3", label: "3. Plausible" },
          { id: "sec-4", label: "4. Speculative" },
          { id: "sec-5", label: "5. Implausible" },
          { id: "sec-6", label: "6. Concepts" },
          { id: "sec-7", label: "7. Theories" },
          { id: "sec-8", label: "8. Sci-Fi Hooks" },
          { id: "sec-9", label: "9. Rabbit Holes" },
          { id: "sec-10", label: "10. Sources" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-mono-code transition-all ${
              activeTab === item.id
                ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold"
                : "bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CORE QUESTION & PREMISE AUDIT */}
      {/* ========================================================================= */}
      <section
        id="sec-1"
        className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 shadow-xl relative group"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-700/50 text-xs font-mono-code font-bold">
              01
            </span>
            <h3 className="text-sm sm:text-base font-bold font-mono-code text-neutral-100 uppercase tracking-wide">
              Core Question & Epistemological Audit
            </h3>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-1",
                `# 1. CORE QUESTION & PREMISE AUDIT\n\nClarified Question: ${dossier.coreQuestion.clarifiedQuestion}\n\nUnderlying Premise: ${dossier.coreQuestion.underlyingPremise}\n\nPremise Critique: ${dossier.coreQuestion.premiseCritique}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-1" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              Clarified Research Inquiry:
            </span>
            <p className="mt-1 text-sm sm:text-base text-neutral-200 font-medium font-sans">
              {dossier.coreQuestion.clarifiedQuestion}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400">
                Underlying Premise & Assumptions:
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {dossier.coreQuestion.underlyingPremise}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-amber-900/30">
              <span className="text-xs font-mono-code uppercase tracking-wider text-amber-400">
                Epistemological Scrutiny:
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {dossier.coreQuestion.premiseCritique}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ESTABLISHED FACT */}
      {/* ========================================================================= */}
      <section
        id="sec-2"
        className="rounded-2xl bg-neutral-900/80 border border-emerald-900/40 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-xs font-mono-code font-bold">
              02
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-emerald-200 uppercase tracking-wide">
                What is Established Fact
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-2",
                `# 2. WHAT IS ESTABLISHED FACT\n\n${dossier.establishedFact.summary}\n\n${dossier.establishedFact.points.map((p) => `- ${p}`).join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-2" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-4">
          {dossier.establishedFact.summary}
        </p>

        <div className="space-y-2.5">
          {dossier.establishedFact.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-emerald-900/20 text-xs sm:text-sm text-neutral-200 font-sans"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: SCIENTIFICALLY PLAUSIBLE */}
      {/* ========================================================================= */}
      <section
        id="sec-3"
        className="rounded-2xl bg-neutral-900/80 border border-cyan-900/40 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-700/50 text-xs font-mono-code font-bold">
              03
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-cyan-200 uppercase tracking-wide">
                What is Scientifically Plausible
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-3",
                `# 3. WHAT IS SCIENTIFICALLY PLAUSIBLE\n\n${dossier.scientificallyPlausible.summary}\n\n${dossier.scientificallyPlausible.points.map((p) => `- ${p}`).join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-3" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-4">
          {dossier.scientificallyPlausible.summary}
        </p>

        <div className="space-y-2.5">
          {dossier.scientificallyPlausible.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-cyan-900/20 text-xs sm:text-sm text-neutral-200 font-sans"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>

        {dossier.scientificallyPlausible.requiredBreakthroughs &&
          dossier.scientificallyPlausible.requiredBreakthroughs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-800/80">
              <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
                Required Technological / Scientific Breakthroughs:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dossier.scientificallyPlausible.requiredBreakthroughs.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-xs text-neutral-300 font-sans flex items-start gap-2"
                  >
                    <span className="text-cyan-400 font-mono-code text-[11px] font-bold">↳</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: SPECULATIVE BUT THEORETICALLY POSSIBLE */}
      {/* ========================================================================= */}
      <section
        id="sec-4"
        className="rounded-2xl bg-neutral-900/80 border border-amber-900/40 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-950 text-amber-400 border border-amber-700/50 text-xs font-mono-code font-bold">
              04
            </span>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-amber-200 uppercase tracking-wide">
                Speculative but Theoretically Possible
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-4",
                `# 4. SPECULATIVE BUT THEORETICALLY POSSIBLE\n\n${dossier.speculativePossible.summary}\n\n${dossier.speculativePossible.points.map((p) => `- ${p}`).join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-4" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-4">
          {dossier.speculativePossible.summary}
        </p>

        <div className="space-y-2.5">
          {dossier.speculativePossible.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-amber-900/20 text-xs sm:text-sm text-neutral-200 font-sans"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>

        {dossier.speculativePossible.theoreticalFrameworks &&
          dossier.speculativePossible.theoreticalFrameworks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-800/80">
              <span className="text-xs font-mono-code uppercase tracking-wider text-amber-400 font-semibold block mb-2">
                Candidate Theoretical Frameworks:
              </span>
              <div className="flex flex-wrap gap-2">
                {dossier.speculativePossible.theoreticalFrameworks.map((fw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-mono-code"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            </div>
          )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CURRENTLY UNSUPPORTED OR IMPLAUSIBLE */}
      {/* ========================================================================= */}
      <section
        id="sec-5"
        className="rounded-2xl bg-neutral-900/80 border border-rose-900/40 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-950 text-rose-400 border border-rose-700/50 text-xs font-mono-code font-bold">
              05
            </span>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-rose-200 uppercase tracking-wide">
                Currently Unsupported or Implausible
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-5",
                `# 5. CURRENTLY UNSUPPORTED OR IMPLAUSIBLE\n\n${dossier.unsupportedOrImplausible.summary}\n\n${dossier.unsupportedOrImplausible.points.map((p) => `- ${p}`).join("\n")}\n\nViolated Laws/Tropes:\n${dossier.unsupportedOrImplausible.violatedLawsOrFallacies.map((v) => `- ${v}`).join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-5" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-4">
          {dossier.unsupportedOrImplausible.summary}
        </p>

        <div className="space-y-2.5">
          {dossier.unsupportedOrImplausible.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-rose-900/20 text-xs sm:text-sm text-neutral-200 font-sans"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800/80">
          <span className="text-xs font-mono-code uppercase tracking-wider text-rose-400 font-semibold block mb-2">
            Specific Laws of Nature Violated / Tropes to Avoid:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dossier.unsupportedOrImplausible.violatedLawsOrFallacies.map((v, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200/90 font-sans flex items-start gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: RELEVANT SCIENTIFIC CONCEPTS & TERMINOLOGY */}
      {/* ========================================================================= */}
      <section
        id="sec-6"
        className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-950 text-blue-400 border border-blue-700/50 text-xs font-mono-code font-bold">
              06
            </span>
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-blue-200 uppercase tracking-wide">
                Scientific Concepts & Terminology
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-6",
                `# 6. RELEVANT SCIENTIFIC CONCEPTS & TERMINOLOGY\n\n${dossier.scientificConcepts
                  .map((c) => `### ${c.term}\nDefinition: ${c.definition}\nRelevance: ${c.relevance}`)
                  .join("\n\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-6" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {dossier.scientificConcepts.map((concept, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold font-mono-code text-blue-300 tracking-tight">
                  {concept.term}
                </h4>
                <p className="mt-1.5 text-xs text-neutral-300 font-sans leading-relaxed">
                  {concept.definition}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-900 text-[11px] text-neutral-400 font-sans italic">
                <span className="text-blue-400 font-mono-code font-semibold not-italic">
                  Sci-Fi Relevance:{" "}
                </span>
                {concept.relevance}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: COMPETING EXPLANATIONS */}
      {/* ========================================================================= */}
      <section
        id="sec-7"
        className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 border border-indigo-700/50 text-xs font-mono-code font-bold">
              07
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-indigo-200 uppercase tracking-wide">
                Competing Explanations & Rival Theories
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-7",
                `# 7. COMPETING EXPLANATIONS & RIVAL THEORIES\n\n${dossier.competingExplanations
                  .map(
                    (e) =>
                      `### ${e.hypothesis} (${e.proponentsOrOrigin})\nMechanism: ${e.mechanism}\nLimitations: ${e.limitations}`
                  )
                  .join("\n\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-7" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-3.5">
          {dossier.competingExplanations.map((theory, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 className="text-sm font-bold font-mono-code text-indigo-300">
                  {theory.hypothesis}
                </h4>
                {theory.proponentsOrOrigin && (
                  <span className="text-[11px] font-mono-code text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 self-start sm:self-auto">
                    {theory.proponentsOrOrigin}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs font-sans">
                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                  <span className="text-[11px] font-mono-code text-neutral-400 uppercase font-semibold block mb-1">
                    Mechanism:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{theory.mechanism}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                  <span className="text-[11px] font-mono-code text-amber-400 uppercase font-semibold block mb-1">
                    Limitations / Critique:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{theory.limitations}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: IMPLICATIONS FOR A SCIENCE-FICTION STORY */}
      {/* ========================================================================= */}
      <section
        id="sec-8"
        className="rounded-2xl bg-neutral-900/80 border border-violet-900/40 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-950 text-violet-400 border border-violet-700/50 text-xs font-mono-code font-bold">
              08
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-violet-200 uppercase tracking-wide">
                Implications for a Science-Fiction Story
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-8",
                `# 8. IMPLICATIONS FOR A SCIENCE-FICTION STORY\n\n${dossier.sciFiImplications
                  .map(
                    (i) =>
                      `### ${i.title}\n${i.description}\nWorldbuilding: ${i.worldbuildingAngle || "N/A"}\nTrope Warning: ${i.tropeWarning || "N/A"}`
                  )
                  .join("\n\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-8" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          {dossier.sciFiImplications.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-neutral-950/70 border border-violet-900/30 space-y-3"
            >
              <h4 className="text-sm sm:text-base font-bold font-mono-code text-violet-300">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {item.worldbuildingAngle && (
                  <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs font-sans">
                    <span className="text-[11px] font-mono-code text-cyan-400 uppercase font-semibold block mb-1">
                      Worldbuilding & Society Angle:
                    </span>
                    <p className="text-neutral-300">{item.worldbuildingAngle}</p>
                  </div>
                )}

                {item.tropeWarning && (
                  <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-rose-900/30 text-xs font-sans">
                    <span className="text-[11px] font-mono-code text-rose-400 uppercase font-semibold block mb-1">
                      Sci-Fi Trope Pitfall to Avoid:
                    </span>
                    <p className="text-neutral-300">{item.tropeWarning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: QUESTIONS FOR FURTHER INVESTIGATION */}
      {/* ========================================================================= */}
      <section
        id="sec-9"
        className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-700/50 text-xs font-mono-code font-bold">
              09
            </span>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-neutral-100 uppercase tracking-wide">
                Questions for Further Investigation
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-9",
                `# 9. QUESTIONS FOR FURTHER INVESTIGATION\n\n${dossier.furtherInvestigation.map((q) => `- ${q}`).join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-9" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-2.5">
          {dossier.furtherInvestigation.map((question, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs sm:text-sm text-neutral-200 font-sans"
            >
              <span className="text-cyan-400 font-mono-code font-bold text-xs shrink-0 mt-0.5">
                ?
              </span>
              <span className="leading-relaxed">{question}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: SOURCES & REFERENCES */}
      {/* ========================================================================= */}
      <section
        id="sec-10"
        className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 sm:p-6 shadow-xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-mono-code font-bold">
              10
            </span>
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm sm:text-base font-bold font-mono-code text-neutral-100 uppercase tracking-wide">
                Sources & References
              </h3>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopySection(
                "sec-10",
                `# 10. SOURCES & REFERENCES\n\n${dossier.sourcesAndReferences
                  .map(
                    (s) =>
                      `- ${s.title} by ${s.authorOrInstitution || "N/A"} (${s.yearOrContext || "N/A"}): ${s.relevance}`
                  )
                  .join("\n")}`
              )
            }
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Copy section"
          >
            {copiedSection === "sec-10" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          {dossier.sourcesAndReferences.map((source, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs sm:text-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-neutral-200 font-mono-code">{source.title}</span>
                <span className="text-[11px] font-mono-code text-cyan-400/80">
                  {source.authorOrInstitution}{" "}
                  {source.yearOrContext ? `• ${source.yearOrContext}` : ""}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400 font-sans leading-relaxed">
                {source.relevance}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Footer Actions */}
      <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
        <button
          onClick={handleCopyFull}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono-code font-bold uppercase tracking-wider transition-all"
        >
          {copiedFull ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Full Dossier Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>Copy Full Dossier (Markdown)</span>
            </>
          )}
        </button>

        <button
          onClick={onNewSearch}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono-code font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/50 transition-all"
        >
          <span>Deconstruct New Premise</span>
        </button>
      </div>
    </div>
  );
};
