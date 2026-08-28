import { ResearchDossier } from "../types";

export function formatDossierAsMarkdown(dossier: ResearchDossier): string {
  return `# THE RESEARCH BUREAU // SCIENTIFIC ANALYSIS DOSSIER
**ID:** ${dossier.id}  
**Timestamp:** ${new Date(dossier.timestamp).toLocaleString()}  
**Epistemic Tier:** ${dossier.epistemicTier.replace(/_/g, " ")}  

---

## EXECUTIVE VERDICT
${dossier.executiveVerdict}

---

## 1. CORE QUESTION & EPISTEMOLOGICAL AUDIT
- **Clarified Inquiry:** ${dossier.coreQuestion.clarifiedQuestion}
- **Underlying Premise:** ${dossier.coreQuestion.underlyingPremise}
- **Premise Critique:** ${dossier.coreQuestion.premiseCritique}

---

## 2. WHAT IS ESTABLISHED FACT
${dossier.establishedFact.summary}

${dossier.establishedFact.points.map((p) => `- ${p}`).join("\n")}

---

## 3. WHAT IS SCIENTIFICALLY PLAUSIBLE
${dossier.scientificallyPlausible.summary}

${dossier.scientificallyPlausible.points.map((p) => `- ${p}`).join("\n")}

${
  dossier.scientificallyPlausible.requiredBreakthroughs &&
  dossier.scientificallyPlausible.requiredBreakthroughs.length > 0
    ? `\n### Required Breakthroughs:\n${dossier.scientificallyPlausible.requiredBreakthroughs
        .map((b) => `- ${b}`)
        .join("\n")}`
    : ""
}

---

## 4. WHAT IS SPECULATIVE BUT THEORETICALLY POSSIBLE
${dossier.speculativePossible.summary}

${dossier.speculativePossible.points.map((p) => `- ${p}`).join("\n")}

${
  dossier.speculativePossible.theoreticalFrameworks &&
  dossier.speculativePossible.theoreticalFrameworks.length > 0
    ? `\n### Theoretical Frameworks:\n${dossier.speculativePossible.theoreticalFrameworks
        .map((f) => `- ${f}`)
        .join("\n")}`
    : ""
}

---

## 5. WHAT IS CURRENTLY UNSUPPORTED OR IMPLAUSIBLE
${dossier.unsupportedOrImplausible.summary}

${dossier.unsupportedOrImplausible.points.map((p) => `- ${p}`).join("\n")}

### Violated Laws / Tropes to Avoid:
${dossier.unsupportedOrImplausible.violatedLawsOrFallacies.map((v) => `- ${v}`).join("\n")}

---

## 6. RELEVANT SCIENTIFIC CONCEPTS & TERMINOLOGY
${dossier.scientificConcepts
  .map(
    (c) =>
      `### ${c.term}\n**Definition:** ${c.definition}\n**Sci-Fi Relevance:** ${c.relevance}\n`
  )
  .join("\n")}

---

## 7. COMPETING EXPLANATIONS & ALTERNATIVE FRAMEWORKS
${dossier.competingExplanations
  .map(
    (e) =>
      `### ${e.hypothesis} ${e.proponentsOrOrigin ? `(${e.proponentsOrOrigin})` : ""}\n- **Mechanism:** ${e.mechanism}\n- **Limitations:** ${e.limitations}\n`
  )
  .join("\n")}

---

## 8. POTENTIAL IMPLICATIONS FOR A SCIENCE-FICTION STORY
${dossier.sciFiImplications
  .map(
    (i) =>
      `### ${i.title}\n${i.description}\n${
        i.worldbuildingAngle ? `*Worldbuilding Angle:* ${i.worldbuildingAngle}\n` : ""
      }${i.tropeWarning ? `*Trope Pitfall Warning:* ${i.tropeWarning}\n` : ""}`
  )
  .join("\n")}

---

## 9. QUESTIONS FOR FURTHER INVESTIGATION
${dossier.furtherInvestigation.map((q) => `- ${q}`).join("\n")}

---

## 10. SOURCES & REFERENCES
${dossier.sourcesAndReferences
  .map(
    (s) =>
      `- **${s.title}** ${s.authorOrInstitution ? `by ${s.authorOrInstitution}` : ""} ${
        s.yearOrContext ? `(${s.yearOrContext})` : ""
      }: ${s.relevance}`
  )
  .join("\n")}
`;
}
