import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy get Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "The Research Bureau API" });
});

// Analyze Dossier API
app.post("/api/analyze", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "Please provide a valid research question or premise." });
    }

    const ai = getAi();

    const systemInstruction = `You are 'The Research Bureau', a premier scientific intelligence and epistemological analysis agent dedicated to science-fiction writers, speculative worldbuilders, and futurists.

Your mandate is to subject the user's premise, hypothesis, technology, or worldbuilding problem to rigorous scientific deconstruction.

CRITICAL DIRECTIVES:
1. NEVER automatically accept the user's premise as true or physically valid. Rigorously critique the baseline physics, thermodynamics, causality, and empirical reality.
2. Clearly separate knowledge into strict epistemological categories:
   - Established Fact (empirically confirmed by peer-reviewed science and repeatable experiments)
   - Scientifically Plausible (mathematically sound, compatible with known laws, but faces extreme engineering or energetic barriers)
   - Speculative but Theoretically Possible (hypothetical physics, unproven mathematical formulations like string theory/wormholes/exotic matter that do not yet have empirical disproof)
   - Unsupported or Implausible (violates conservation laws, speed of light, entropy, or relies on sci-fi tropes/pseudoscience)
3. Return the EXACT 10 structured sections with deep, specific scientific terminology (referencing real physical laws, metrics, constants, and frameworks).
4. Provide tangible, high-value implications for science-fiction narratives (worldbuilding consequences, societal ripple effects, plot conflicts, and trope clichés to avoid).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Perform an exhaustive scientific deconstruction and research dossier analysis for the following science-fiction writer's premise/question:

"""
${query.trim()}
"""

Provide complete, deep analysis across all 10 dossier dimensions.`,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveVerdict: {
              type: Type.STRING,
              description: "A concise 2-3 sentence executive verdict summarizing physical validity, primary bottleneck, and storytelling viability.",
            },
            epistemicTier: {
              type: Type.STRING,
              description: "Classification: ESTABLISHED_FACT, SCIENTIFICALLY_PLAUSIBLE, THEORETICALLY_SPECULATIVE, PHYSICALLY_IMPLAUSIBLE, or PARADOXICAL",
            },
            coreQuestion: {
              type: Type.OBJECT,
              properties: {
                clarifiedQuestion: {
                  type: Type.STRING,
                  description: "The core research question stripped of narrative ambiguity.",
                },
                underlyingPremise: {
                  type: Type.STRING,
                  description: "The implicit assumptions or premises the user is making.",
                },
                premiseCritique: {
                  type: Type.STRING,
                  description: "Epistemological audit: Does the premise hold up to current scientific understanding?",
                },
              },
              required: ["clarifiedQuestion", "underlyingPremise", "premiseCritique"],
            },
            establishedFact: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: "Overview of what empirical science solidly knows about this domain.",
                },
                points: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific established physical, chemical, biological, or mathematical facts.",
                },
              },
              required: ["summary", "points"],
            },
            scientificallyPlausible: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: "Overview of plausible theoretical mechanisms.",
                },
                points: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Plausible mechanisms, engineering extensions, or extrapolateable technologies.",
                },
                requiredBreakthroughs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Technological or scientific milestones needed to realize this.",
                },
              },
              required: ["summary", "points"],
            },
            speculativePossible: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: "Overview of speculative frontiers.",
                },
                points: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Hypothetical constructs, exotic physics, or theoretical models (e.g. Alcubierre metric, quantum gravity conjectures).",
                },
                theoreticalFrameworks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Relevant theoretical frameworks supporting speculative models.",
                },
              },
              required: ["summary", "points"],
            },
            unsupportedOrImplausible: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: "Overview of physical barriers, impossibilities, or hard law violations.",
                },
                points: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Elements that contradict established physical laws (e.g. 2nd law of thermo, causality, no-cloning theorem).",
                },
                violatedLawsOrFallacies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific laws of nature violated or common sci-fi tropes that are scientifically broken.",
                },
              },
              required: ["summary", "points", "violatedLawsOrFallacies"],
            },
            scientificConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  relevance: { type: Type.STRING, description: "How this concept applies to the query" },
                },
                required: ["term", "definition", "relevance"],
              },
              description: "Key scientific concepts, jargon, equations, or metrics relevant to the premise.",
            },
            competingExplanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hypothesis: { type: Type.STRING },
                  proponentsOrOrigin: { type: Type.STRING },
                  mechanism: { type: Type.STRING },
                  limitations: { type: Type.STRING },
                },
                required: ["hypothesis", "mechanism", "limitations"],
              },
              description: "Competing scientific interpretations, rival theories, or alternative models.",
            },
            sciFiImplications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tropeWarning: { type: Type.STRING, description: "Common cliché or scientific blunder to avoid" },
                  worldbuildingAngle: { type: Type.STRING, description: "Societal, economic, or narrative consequence" },
                },
                required: ["title", "description"],
              },
              description: "Narrative, worldbuilding, and thematic consequences for a science-fiction writer.",
            },
            furtherInvestigation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Unresolved paradoxes, deep-dive questions, and technical rabbit holes for the writer to explore.",
            },
            sourcesAndReferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  authorOrInstitution: { type: Type.STRING },
                  yearOrContext: { type: Type.STRING },
                  relevance: { type: Type.STRING },
                },
                required: ["title", "relevance"],
              },
              description: "Key scientific papers, foundational laws, seminal books, or thought experiments.",
            },
          },
          required: [
            "executiveVerdict",
            "epistemicTier",
            "coreQuestion",
            "establishedFact",
            "scientificallyPlausible",
            "speculativePossible",
            "unsupportedOrImplausible",
            "scientificConcepts",
            "competingExplanations",
            "sciFiImplications",
            "furtherInvestigation",
            "sourcesAndReferences",
          ],
        },
      },
    });

    const rawJson = response.text?.trim();
    if (!rawJson) {
      throw new Error("Empty response received from analysis model.");
    }

    const parsedData = JSON.parse(rawJson);
    
    // Add client metadata
    const dossier = {
      id: `dossier-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      originalQuery: query.trim(),
      ...parsedData,
    };

    return res.json(dossier);
  } catch (error: any) {
    console.error("Error analyzing query:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate research dossier. Please try again.",
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Research Bureau running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
