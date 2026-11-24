import type { QuizQuestion, ConceptBreakdown, RevisionPack } from "@/types";

export const DEMO_NOTES = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll absorbs light mainly in the blue and red wavelengths.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle (light-independent) fixes CO2 into glucose in the stroma.
Equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2.`;

export const DEMO_QUIZ: QuizQuestion[] = [
  {
    type: "mcq",
    question: "Where do the light-dependent reactions of photosynthesis take place?",
    options: [
      "Stroma",
      "Thylakoid membrane",
      "Cytoplasm",
      "Mitochondrial matrix",
    ],
    answer: "Thylakoid membrane",
    explanation: "Photosystems are embedded in the thylakoid membrane.",
  },
  {
    type: "mcq",
    question: "Which pigment primarily absorbs blue and red light?",
    options: ["Carotene", "Xanthophyll", "Chlorophyll", "Anthocyanin"],
    answer: "Chlorophyll",
    explanation: "Chlorophyll a/b peak in blue and red regions.",
  },
  {
    type: "fill",
    question: "The Calvin cycle fixes ___ into sugars.",
    answer: "CO2",
    explanation: "Carbon fixation is the first stage of the Calvin cycle.",
  },
  {
    type: "short",
    question: "Name the two high-energy products of the light reactions used by the Calvin cycle.",
    answer: "ATP and NADPH",
    explanation: "Both are required for carbon reduction.",
  },
];

export const DEMO_CONCEPTS: ConceptBreakdown[] = [
  {
    title: "Light-dependent reactions",
    summary:
      "Capture photons to split water, release oxygen, and generate ATP and NADPH.",
    keyPoints: [
      "Occur in thylakoid membranes",
      "Involve Photosystem II and I",
      "Produce O2 as a byproduct",
    ],
    analogies: ["Like a solar panel charging batteries (ATP/NADPH)"],
  },
  {
    title: "Calvin cycle",
    summary:
      "Uses ATP and NADPH to fix atmospheric CO2 into carbohydrates in the stroma.",
    keyPoints: ["Carbon fixation", "Reduction", "Regeneration of RuBP"],
    analogies: ["Like a factory assembling sugar from carbon parts"],
  },
];

export const DEMO_REVISION: RevisionPack = {
  cheatSheet:
    "Photosynthesis = light reactions (thylakoid) + Calvin cycle (stroma).\nKey equation: 6CO2 + 6H2O → C6H12O6 + 6O2\nProducts of light stage: ATP, NADPH, O2",
  flashcards: [
    { front: "Thylakoid", back: "Site of light-dependent reactions" },
    { front: "Stroma", back: "Site of Calvin cycle" },
    { front: "Chlorophyll", back: "Primary photosynthetic pigment" },
    { front: "NADPH", back: "Electron carrier from light reactions" },
  ],
  highYield: [
    "Light reactions: thylakoid → ATP + NADPH + O2",
    "Calvin cycle: stroma → glucose from CO2",
    "Chlorophyll absorbs blue & red light",
  ],
};

export function getDemoResult(mode: "quiz" | "concepts" | "revision") {
  if (mode === "quiz") return { questions: DEMO_QUIZ };
  if (mode === "concepts") return { concepts: DEMO_CONCEPTS };
  return DEMO_REVISION;
}
