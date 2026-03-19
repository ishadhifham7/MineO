import { beforeEach, describe, expect, it, vi } from 'vitest';

const firebaseMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  now: vi.fn(),
}));

const cryptoMocks = vi.hoisted(() => ({
  randomUUID: vi.fn(),
}));

vi.mock('../../src/config/firebase', () => ({
  firestore: {
    collection: firebaseMocks.collection,
  },
  Timestamp: {
    now: firebaseMocks.now,
  },
}));

vi.mock('crypto', () => ({
  randomUUID: cryptoMocks.randomUUID,
}));

import {
  deleteGoal,
  generateGoal,
  getGoalById,
  getGoals,
  toggleGoalStageCompletion,
} from '../../src/modules/goal/goal.service';
import { firestore, Timestamp } from '../../src/config/firebase';

describe('goal.service', () => {
  const mockSet = vi.fn();
  const mockGet = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockDoc = vi.fn();
  const mockWhere = vi.fn();
  const mockOrderBy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (Timestamp.now as any).mockReturnValue({
      toDate: () => new Date('2026-03-01T00:00:00.000Z'),
    });

    (cryptoMocks.randomUUID as any)
      .mockReturnValueOnce('goal-1')
      .mockReturnValueOnce('stage-1')
      .mockReturnValueOnce('stage-2');

    mockDoc.mockReturnValue({
      set: mockSet,
      get: mockGet,
      update: mockUpdate,
      delete: mockDelete,
    });

    mockOrderBy.mockReturnValue({
      get: mockGet,
    });

    mockWhere.mockReturnValue({
      orderBy: mockOrderBy,
    });

    (firestore.collection as any).mockReturnValue({
      doc: mockDoc,
      where: mockWhere,
    });
  });

  it('generates and stores a goal', async () => {
    const result = await generateGoal({
      userId: 'user-1',
      title: 'Learn Testing',
      description: 'Practice service tests',
      stages: [
        { title: 'Stage 1', description: 'Start', order: 1 },
        { title: 'Stage 2', description: 'Finish', order: 2 },
      ],
    });

    expect(mockSet).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'goal-1',
      userId: 'user-1',
      title: 'Learn Testing',
      description: 'Practice service tests',
      createdAt: '2026-03-01T00:00:00.000Z',
      stages: [
        {
          id: 'stage-1',
          title: 'Stage 1',
          description: 'Start',
          order: 1,
          completed: false,
        },
        {
          id: 'stage-2',
          title: 'Stage 2',
          description: 'Finish',
          order: 2,
          completed: false,
        },
      ],
    });
  });

  it('returns only the authenticated user goals', async () => {
    mockGet.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'goal-1',
          data: () => ({
            userId: 'user-1',
            title: 'Goal A',
            description: 'Desc',
            createdAt: { toDate: () => new Date('2026-03-02T00:00:00.000Z') },
            stages: [],
          }),
        },
      ],
    });

    const result = await getGoals('user-1');

    expect(result).toEqual([
      {
        id: 'goal-1',
        userId: 'user-1',
        title: 'Goal A',
        description: 'Desc',
        createdAt: '2026-03-02T00:00:00.000Z',
        stages: [],
      },
    ]);
  });

  it('throws FORBIDDEN when another user tries to access a goal', async () => {
    mockGet.mockResolvedValue({
      exists: true,
      id: 'goal-1',
      data: () => ({
        userId: 'owner-1',
        title: 'Secret Goal',
        createdAt: { toDate: () => new Date('2026-03-02T00:00:00.000Z') },
        stages: [],
      }),
    });

    await expect(getGoalById('goal-1', 'other-user')).rejects.toThrow('FORBIDDEN');
  });

  it('toggles a stage completion flag', async () => {
    mockGet.mockResolvedValue({
      exists: true,
      id: 'goal-1',
      data: () => ({
        userId: 'user-1',
        title: 'Goal A',
        description: 'Desc',
        createdAt: { toDate: () => new Date('2026-03-02T00:00:00.000Z') },
        stages: [
          { id: 'stage-1', title: 'Stage 1', description: 'A', order: 1, completed: false },
          { id: 'stage-2', title: 'Stage 2', description: 'B', order: 2, completed: false },
        ],
      }),
    });

    const result = await toggleGoalStageCompletion('goal-1', 'stage-2', true, 'user-1');

    expect(mockUpdate).toHaveBeenCalledWith({
      stages: [
        { id: 'stage-1', title: 'Stage 1', description: 'A', order: 1, completed: false },
        { id: 'stage-2', title: 'Stage 2', description: 'B', order: 2, completed: true },
      ],
    });

    expect(result?.stages[1].completed).toBe(true);
  });

  it('deletes a goal owned by the authenticated user', async () => {
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        userId: 'user-1',
      }),
    });

    const result = await deleteGoal('goal-1', 'user-1');

    expect(mockDelete).toHaveBeenCalled();
    expect(result).toBe('goal-1');
  });
});