import { beforeEach, describe, expect, it, vi } from 'vitest';

const habitMocks = vi.hoisted(() => {
  const mockSet = vi.fn();
  const mockDoc = vi.fn();
  const mockGet = vi.fn();

  const thirdWhere = {
    get: mockGet,
  };

  const secondWhere = {
    where: vi.fn(() => thirdWhere),
  };

  const firstWhere = {
    where: vi.fn(() => secondWhere),
  };

  const mockCollection = {
    doc: mockDoc,
    where: vi.fn(() => firstWhere),
  };

  return {
    mockSet,
    mockDoc,
    mockGet,
    mockCollection,
  };
});

vi.mock('../../src/config/firebase', () => ({
  firestore: {
    collection: vi.fn(() => habitMocks.mockCollection),
  },
  Timestamp: {
    fromDate: vi.fn((date: Date) => ({
      toDate: () => date,
    })),
  },
}));

vi.mock('firebase-admin', () => ({
  firestore: {
    FieldValue: {
      serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
    },
  },
}));

import { HabitService } from '../../src/modules/habit/habit.service';

describe('habit.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    habitMocks.mockDoc.mockReset();
    habitMocks.mockSet.mockReset();
    habitMocks.mockGet.mockReset();

    habitMocks.mockDoc.mockReturnValue({
      set: habitMocks.mockSet,
    });
  });

  it('upserts daily habit data with user-specific doc id', async () => {
    habitMocks.mockSet.mockResolvedValue(undefined);

    await HabitService.upsertDailyHabit('user-1', '2026-03-14', {
      mental: 1,
      physical: 0.5,
      spiritual: 0,
    });

    expect(habitMocks.mockDoc).toHaveBeenCalledWith('user-1_2026-03-14');
    expect(habitMocks.mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        mental: 1,
        physical: 0.5,
        spiritual: 0,
        updatedAt: 'SERVER_TIMESTAMP',
        createdAt: 'SERVER_TIMESTAMP',
      }),
      { merge: true }
    );
  });

  it('returns monthly calendar data', async () => {
    habitMocks.mockGet.mockResolvedValue({
      docs: [
        {
          data: () => ({
            date: { toDate: () => new Date('2026-03-10T00:00:00.000Z') },
            mental: 1,
            physical: 0.5,
            spiritual: 0,
          }),
        },
      ],
    });

    const result = await HabitService.getMonthlyCalendar('user-1', '2026-03');

    expect(result).toEqual([
      {
        date: '2026-03-10',
        mental: 1,
        physical: 0.5,
        spiritual: 0,
      },
    ]);
  });

  it('aggregates radar counts correctly', async () => {
    habitMocks.mockGet.mockResolvedValue({
      docs: [
        {
          data: () => ({
            mental: 1,
            physical: 0.5,
            spiritual: 0,
          }),
        },
        {
          data: () => ({
            mental: 0,
            physical: 1,
            spiritual: 0.5,
          }),
        },
      ],
    });

    const result = await HabitService.getRadarData('user-1', '2026-03-01', '2026-03-07');

    expect(result).toEqual({
      mental: { green: 1, blue: 0, red: 1 },
      physical: { green: 1, blue: 1, red: 0 },
      spiritual: { green: 0, blue: 1, red: 1 },
    });
  });
});