import { describe, expect, it } from 'vitest';
import { MockAIProvider } from './MockAIProvider';
import { seedNotes } from '@/data/seedData';

describe('MockAIProvider', () => {
  it('generates deterministic quiz questions for the same note', async () => {
    const provider = new MockAIProvider();
    const note = seedNotes[0]!;

    const firstResult = await provider.generateQuizQuestions(note);
    const secondResult = await provider.generateQuizQuestions(note);

    expect(firstResult).toEqual(secondResult);
    expect(firstResult).toHaveLength(4);
  });

  it('throws when concept is outside note content', async () => {
    const provider = new MockAIProvider();
    await expect(provider.explainConcept(seedNotes[0]!, 'Photosynthesis')).rejects.toThrow();
  });
});
