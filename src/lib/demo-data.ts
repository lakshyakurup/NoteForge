import type {
  QuizQuestion,
  ConceptBreakdown,
  RevisionPack,
  SummaryResult,
  ExplainResult,
  StudyPlanResult,
} from "@/lib/ai";

export const DEMO_NOTES = `Photosynthesis is the process by which green plants convert light energy into chemical energy.
Chlorophyll absorbs light mainly in the blue and red wavelengths.
The light-dependent reactions occur in the thylakoid membrane and produce ATP and NADPH.
The Calvin cycle (light-independent) fixes CO2 into glucose in the stroma.
Equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2.`;

export const DEMO_QUIZ: QuizQuestion[] = [
  {
    type: "mcq",
    question: "Where do the light-dependent reactions take place?",
    options: ["Stroma", "Thylakoid membrane", "Cytoplasm", "Nucleus"],
    answer: "Thylakoid membrane",
    explanation: "Photosystems sit in the thylakoid membrane.",
  },
  {
    type: "mcq",
    question: "Primary pigment absorbing blue and red light?",
    options: ["Carotene", "Xanthophyll", "Chlorophyll", "Melanin"],
    answer: "Chlorophyll",
    explanation: "Chlorophyll a/b peak in blue and red.",
  },
  {
    type: "fill",
    question: "The Calvin cycle fixes ___ into sugars.",
    answer: "CO2",
    explanation: "Carbon fixation step.",
  },
  {
    type: "short",
    question: "Name two products of the light reactions used by the Calvin cycle.",
    answer: "ATP and NADPH",
    explanation: "Energy and reducing power.",
  },
];

export const DEMO_CONCEPTS: ConceptBreakdown[] = [
  {
    title: "Light-dependent reactions",
    summary: "Capture photons, split water, make ATP and NADPH, release O2.",
    keyPoints: ["Thylakoid membrane", "Photosystem II & I", "O2 byproduct"],
    analogies: ["Solar panel charging batteries"],
  },
  {
    title: "Calvin cycle",
    summary: "Uses ATP/NADPH to fix CO2 into carbs in the stroma.",
    keyPoints: ["Carbon fixation", "Reduction", "RuBP regeneration"],
    analogies: ["Factory assembling sugar"],
  },
];

export const DEMO_REVISION: RevisionPack = {
  cheatSheet:
    "Light reactions (thylakoid) → ATP + NADPH + O2\nCalvin cycle (stroma) → glucose from CO2\n6CO2 + 6H2O → C6H12O6 + 6O2",
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

export const DEMO_SUMMARY: SummaryResult = {
  title: "Photosynthesis overview",
  summary:
    "Plants convert light into chemical energy. Light reactions in thylakoids make ATP/NADPH; the Calvin cycle in the stroma builds glucose from CO2.",
  bullets: [
    "Light stage in thylakoid membrane",
    "Dark stage (Calvin) in stroma",
    "Chlorophyll is the main pigment",
  ],
  keywords: ["chlorophyll", "thylakoid", "Calvin cycle", "ATP", "NADPH"],
};

export const DEMO_EXPLAIN: ExplainResult = {
  term: "Calvin cycle",
  definition: "Set of light-independent reactions that fix CO2 into carbohydrates.",
  simple: "The sugar factory that runs on ATP and NADPH made by light reactions.",
  example: "In daytime, stomata let CO2 in; the Calvin cycle turns it into glucose.",
  related: ["RuBP", "stroma", "carbon fixation"],
};

export const DEMO_PLAN: StudyPlanResult = {
  title: "5-day Photosynthesis sprint",
  totalMinutes: 150,
  sessions: [
    {
      day: "Day 1",
      focus: "Big picture",
      minutes: 30,
      tasks: ["Read equation", "Sketch chloroplast", "List inputs/outputs"],
    },
    {
      day: "Day 2",
      focus: "Light reactions",
      minutes: 30,
      tasks: ["Memorize thylakoid steps", "Flashcards: ATP/NADPH"],
    },
    {
      day: "Day 3",
      focus: "Calvin cycle",
      minutes: 30,
      tasks: ["Map fixation → reduction → regeneration"],
    },
    {
      day: "Day 4",
      focus: "Practice quiz",
      minutes: 30,
      tasks: ["Complete 8 questions", "Review misses"],
    },
    {
      day: "Day 5",
      focus: "Synthesis",
      minutes: 30,
      tasks: ["Teach aloud", "One-page cheat sheet"],
    },
  ],
  tips: ["Active recall beats re-reading", "Space sessions across days"],
};

export function getDemoResult(mode: string, term?: string) {
  switch (mode) {
    case "quiz":
      return { questions: DEMO_QUIZ };
    case "concepts":
      return { concepts: DEMO_CONCEPTS };
    case "revision":
      return DEMO_REVISION;
    case "summary":
      return DEMO_SUMMARY;
    case "explain":
      return { ...DEMO_EXPLAIN, term: term || DEMO_EXPLAIN.term };
    case "plan":
      return DEMO_PLAN;
    default:
      return { questions: DEMO_QUIZ };
  }
}
