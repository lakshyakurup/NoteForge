import { describe, expect, it } from 'vitest';
import { seedAttempts, seedNotes } from '@/data/seedData';
import { buildRevisionQueue, completeRevisionItem } from './revisionService';

describe('revisionService', () => {
  it('builds queue entries from note concepts', () => {
    const queue = buildRevisionQueue(seedNotes, seedAttempts);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue[0]?.concept).toBeDefined();
  });

  it('marks revision as completed and increases confidence', () => {
    const item = buildRevisionQueue(seedNotes, seedAttempts)[0]!;
    const updated = completeRevisionItem(item);

    expect(updated.status).toBe('completed');
    expect(updated.confidence).toBeGreaterThan(item.confidence);
    expect(updated.lastReviewedAt).toBeDefined();
  });
});
