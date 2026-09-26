import { describe, expect, it } from 'vitest';
import { validateNoteInput } from './validation';

describe('validateNoteInput', () => {
  it('returns errors for invalid input', () => {
    const result = validateNoteInput({
      title: 'Bio',
      subject: 'CS',
      difficulty: 'beginner',
      tags: '  ',
      content: 'short',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeDefined();
    expect(result.errors.subject).toBeDefined();
    expect(result.errors.tags).toBeDefined();
    expect(result.errors.content).toBeDefined();
  });

  it('passes valid input', () => {
    const result = validateNoteInput({
      title: 'Sorting algorithm comparison',
      subject: 'Computer Science',
      difficulty: 'intermediate',
      tags: 'algorithms, complexity',
      content: 'This note compares merge sort and quick sort with runtime and memory trade-offs for interviews.',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
