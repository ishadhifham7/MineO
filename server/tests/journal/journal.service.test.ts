import { beforeEach, describe, expect, it, vi } from 'vitest';

const repoMocks = vi.hoisted(() => ({
  entries: vi.fn(),
  entryById: vi.fn(),
  canvasBlocks: vi.fn(),
  canvasBlockById: vi.fn(),
}));

const uuidMocks = vi.hoisted(() => ({
  uuid: vi.fn(),
}));

vi.mock('../../src/modules/journal/journal.repository', () => ({
  JournalRepository: {
    entries: repoMocks.entries,
    entryById: repoMocks.entryById,
    canvasBlocks: repoMocks.canvasBlocks,
    canvasBlockById: repoMocks.canvasBlockById,
  },
}));

vi.mock('uuid', () => ({
  v4: uuidMocks.uuid,
}));

import { JournalService } from '../../src/modules/journal/journal.service';

describe('journal.service', () => {
  const mockBatchSet = vi.fn();
  const mockBatchDelete = vi.fn();
  const mockBatchUpdate = vi.fn();
  const mockBatchCommit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (uuidMocks.uuid as any).mockReturnValue('entry-1');
  });

  it('creates a journal entry with blocks', async () => {
    const batch = {
      set: mockBatchSet,
      delete: mockBatchDelete,
      update: mockBatchUpdate,
      commit: mockBatchCommit.mockResolvedValue(undefined),
    };

    repoMocks.entries.mockReturnValue({
      firestore: {
        batch: () => batch,
      },
    });

    repoMocks.entryById.mockReturnValue({ id: 'entry-1' });
    repoMocks.canvasBlockById.mockImplementation((_entryId: string, blockId: string) => ({
      id: blockId,
    }));

    const result = await JournalService.createJournal({
      userId: 'user-1',
      date: '2026-03-14',
      title: 'Day Note',
      isPinnedToTimeline: true,
      blocks: [
        { id: 'b1', type: 'text', x: 0, y: 0, width: 100, height: 50, text: 'Hello' } as any,
      ],
    });

    expect(mockBatchSet).toHaveBeenCalledTimes(2);
    expect(mockBatchCommit).toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        id: 'entry-1',
        userId: 'user-1',
        date: '2026-03-14',
        title: 'Day Note',
        isPinnedToTimeline: true,
      })
    );
  });

  it('returns a journal by date with blocks', async () => {
    repoMocks.entries.mockReturnValue({
      where: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            get: vi.fn().mockResolvedValue({
              empty: false,
              docs: [
                {
                  data: () => ({
                    id: 'entry-1',
                    userId: 'user-1',
                    date: '2026-03-14',
                    title: 'Note',
                  }),
                },
              ],
            }),
          }),
        }),
      }),
    });

    repoMocks.canvasBlocks.mockReturnValue({
      get: vi.fn().mockResolvedValue({
        docs: [
          { data: () => ({ id: 'b1', type: 'text', text: 'Hello' }) },
          { data: () => ({ id: 'b2', type: 'text', text: 'World' }) },
        ],
      }),
    });

    const result = await JournalService.getJournalByDate('2026-03-14', 'user-1');

    expect(result).toEqual({
      id: 'entry-1',
      userId: 'user-1',
      date: '2026-03-14',
      title: 'Note',
      blocks: [
        { id: 'b1', type: 'text', text: 'Hello' },
        { id: 'b2', type: 'text', text: 'World' },
      ],
    });
  });

  it('blocks metadata update for a non-owner', async () => {
    repoMocks.entryById.mockReturnValue({
      get: vi.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'entry-1',
          userId: 'owner-1',
        }),
      }),
      update: vi.fn(),
    });

    await expect(
      JournalService.updateMeta(
        'entry-1',
        { title: 'Changed' },
        'other-user'
      )
    ).rejects.toThrow('FORBIDDEN');
  });

  it('returns all journal dates without duplicates', async () => {
    repoMocks.entries.mockReturnValue({
      where: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          get: vi.fn().mockResolvedValue({
            docs: [
              { data: () => ({ date: '2026-03-14' }) },
              { data: () => ({ date: '2026-03-14' }) },
              { data: () => ({ date: '2026-03-15' }) },
            ],
          }),
        }),
      }),
    });

    const result = await JournalService.getJournalDates('user-1');

    expect(result.sort()).toEqual(['2026-03-14', '2026-03-15']);
  });
});