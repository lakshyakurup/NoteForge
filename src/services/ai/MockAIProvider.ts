import type { ConceptExplanation, Note, QuizQuestion } from '@/types/domain';
import type { AIProvider } from './AIProvider';

const seededIndex = (seed: string, length: number): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
};

export class MockAIProvider implements AIProvider {
  async generateQuizQuestions(note: Note): Promise<QuizQuestion[]> {
    const concepts = note.concepts.length > 0 ? note.concepts : ['Core Idea'];
    const primaryConcept = concepts[0] ?? 'Core Idea';
    const secondaryConcept = concepts[1] ?? primaryConcept;

    const correctOption = `Understanding ${primaryConcept} improves recall.`;
    const options = [
      correctOption,
      `Ignore ${primaryConcept} when revising.`,
      `Memorize without context about ${secondaryConcept}.`,
      `Skip all examples tied to ${primaryConcept}.`,
    ];

    const tfAnswer = seededIndex(note.id, 2) === 0 ? 'true' : 'false';

    return [
      {
        id: `${note.id}-q1`,
        type: 'multiple-choice',
        prompt: `Which study strategy best reinforces ${primaryConcept} from this note?`,
        options,
        correctAnswer: correctOption,
        explanation: `The note highlights ${primaryConcept} as central, so active recall with context is best.`,
      },
      {
        id: `${note.id}-q2`,
        type: 'true-false',
        prompt: `${secondaryConcept} can be linked back to the main note theme for stronger memory.`,
        correctAnswer: tfAnswer,
        explanation: 'Concept linking creates retrieval cues and supports durable understanding.',
      },
      {
        id: `${note.id}-q3`,
        type: 'short-answer',
        prompt: `In one sentence, summarize how ${primaryConcept} appears in your note.`,
        correctAnswer: primaryConcept.toLowerCase(),
        explanation: 'A concise summary confirms conceptual clarity and self-explanation.',
      },
      {
        id: `${note.id}-q4`,
        type: 'multiple-choice',
        prompt: `What is a practical revision action after reviewing ${secondaryConcept}?`,
        options: [
          `Write one practice question about ${secondaryConcept}.`,
          `Delete tags from the note.`,
          'Avoid spaced repetition sessions.',
          'Only reread the title repeatedly.',
        ],
        correctAnswer: `Write one practice question about ${secondaryConcept}.`,
        explanation: 'Generating questions activates deeper processing and identifies understanding gaps.',
      },
    ];
  }

  async explainConcept(note: Note, concept: string): Promise<ConceptExplanation> {
    if (!note.content.toLowerCase().includes(concept.toLowerCase())) {
      throw new Error('Concept not found in note context. Please select a concept from this note.');
    }

    return {
      concept,
      simple: `${concept} is one of the key building blocks in this note, and it helps explain the main topic in plain terms.`,
      detailed: `${concept} connects to the broader structure of ${note.subject}. In your note, it appears alongside related ideas, so mastering it improves how you reason through the full topic rather than memorizing isolated facts.`,
      analogy: `Think of ${concept} as a checkpoint in a travel route: if you understand this checkpoint, the rest of the route becomes easier to navigate and less confusing.`,
      takeaways: [
        `Define ${concept} in your own words before revising details.`,
        `Connect ${concept} with at least one example from your note.`,
        `Use quick self-quiz prompts that include ${concept}.`,
      ],
    };
  }
}
