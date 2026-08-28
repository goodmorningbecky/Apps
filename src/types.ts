export type EpistemicCategory = 'fact' | 'plausible' | 'speculative' | 'unsupported';

export interface ConceptTerm {
  term: string;
  definition: string;
  relevance: string;
}

export interface CompetingExplanation {
  hypothesis: string;
  proponentsOrOrigin: string;
  mechanism: string;
  limitations: string;
}

export interface SciFiImplication {
  title: string;
  description: string;
  tropeWarning?: string;
  worldbuildingAngle?: string;
}

export interface SourceReference {
  title: string;
  authorOrInstitution?: string;
  yearOrContext?: string;
  relevance: string;
}

export interface ResearchDossier {
  id: string;
  timestamp: string;
  originalQuery: string;
  
  // High-level summary & verdict
  executiveVerdict: string;
  epistemicTier: 'ESTABLISHED_FACT' | 'SCIENTIFICALLY_PLAUSIBLE' | 'THEORETICALLY_SPECULATIVE' | 'PHYSICALLY_IMPLAUSIBLE' | 'PARADOXICAL';
  
  // The 10 Mandatory Sections
  coreQuestion: {
    clarifiedQuestion: string;
    underlyingPremise: string;
    premiseCritique: string; // Epistemological deconstruction of whether the premise holds
  };
  establishedFact: {
    summary: string;
    points: string[];
  };
  scientificallyPlausible: {
    summary: string;
    points: string[];
    requiredBreakthroughs?: string[];
  };
  speculativePossible: {
    summary: string;
    points: string[];
    theoreticalFrameworks?: string[];
  };
  unsupportedOrImplausible: {
    summary: string;
    points: string[];
    violatedLawsOrFallacies: string[];
  };
  scientificConcepts: ConceptTerm[];
  competingExplanations: CompetingExplanation[];
  sciFiImplications: SciFiImplication[];
  furtherInvestigation: string[];
  sourcesAndReferences: SourceReference[];
}

export interface AnalyzeRequest {
  query: string;
  subField?: string;
  analysisDepth?: 'standard' | 'deep';
}
