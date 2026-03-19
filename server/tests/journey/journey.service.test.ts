import { beforeEach, describe, expect, it, vi } from 'vitest';

const journeyRepoMocks = vi.hoisted(() => ({
  fetchAllJournals: vi.fn(),
}));

vi.mock('../../src/modules/journey/journey.repository', () => ({
  fetchAllJournals: journeyRepoMocks.fetchAllJournals,
}));

import { getJourneyTimeline } from '../../src/modules/journey/journey.service';

describe('journey.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the journey timeline for the authenticated user', async () => {
    journeyRepoMocks.fetchAllJournals.mockResolvedValue([
      { id: 'j1', date: '2026-03-10', title: 'A', updatedAt: 100 },
      { id: 'j2', date: '2026-03-12', title: 'B', updatedAt: 200 },
    ]);

    const result = await getJourneyTimeline('user-1');

    expect(journeyRepoMocks.fetchAllJournals).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([
      { id: 'j1', date: '2026-03-10', title: 'A', updatedAt: 100 },
      { id: 'j2', date: '2026-03-12', title: 'B', updatedAt: 200 },
    ]);
  });
});