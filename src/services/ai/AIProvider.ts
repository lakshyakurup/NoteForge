import type { ConceptExplanation, Note, QuizQuestion } from '@/types/domain';

export interface AIProvider {
  generateQuizQuestions(note: Note): Promise<QuizQuestion[]>;
  explainConcept(note: Note, concept: string): Promise<ConceptExplanation>;
}
