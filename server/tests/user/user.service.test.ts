import { beforeEach, describe, expect, it, vi } from 'vitest';

const dateMocks = vi.hoisted(() => ({
  getCurrentTimestamp: vi.fn(),
}));

vi.mock('../../src/shared/utils/date', () => ({
  getCurrentTimestamp: dateMocks.getCurrentTimestamp,
}));

import {
  findUserDocByUid,
  getMyProfile,
  patchMyProfile,
} from '../../src/modules/user/user.service';

describe('user.service', () => {
  let fastify: any;
  let mockDirectGet: any;
  let mockWhere: any;
  let mockRefSet: any;
  let mockRefGet: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRefSet = vi.fn();
    mockRefGet = vi.fn();
    mockDirectGet = vi.fn();
    mockWhere = vi.fn();

    fastify = {
      firestore: {
        collection: vi.fn().mockReturnValue({
          doc: vi.fn().mockReturnValue({
            get: mockDirectGet,
            set: mockRefSet,
          }),
          where: mockWhere,
        }),
      },
    };
  });

  it('finds a user by direct document id', async () => {
    mockDirectGet.mockResolvedValue({
      exists: true,
      data: () => ({
        name: 'User One',
        email: 'user1@example.com',
      }),
    });

    const result = await findUserDocByUid(fastify, 'user-1');

    expect(result?.data.name).toBe('User One');
  });

  it('returns the normalized current profile', async () => {
    mockDirectGet.mockResolvedValue({
      exists: true,
      data: () => ({
        name: 'User One',
        email: 'user1@example.com',
        username: 'userone',
        dob: '2001-01-01',
        profilePhoto: 'photo.png',
      }),
    });

    const result = await getMyProfile(fastify, 'user-1');

    expect(result).toEqual({
      uid: 'user-1',
      name: 'User One',
      email: 'user1@example.com',
      username: 'userone',
      bio: undefined,
      phoneNumber: undefined,
      birthday: '2001-01-01',
      gender: undefined,
      country: undefined,
      showEmail: false,
      showPhone: false,
      activityTracking: true,
      dataSharing: false,
      photoUrl: 'photo.png',
      createdAt: undefined,
      updatedAt: undefined,
    });
  });

  it('patches profile without changing username', async () => {
    (dateMocks.getCurrentTimestamp as any).mockReturnValue('2026-03-19T00:00:00.000Z');

    const ref = {
      set: mockRefSet,
      get: mockRefGet,
    };

    mockDirectGet.mockResolvedValue({
      exists: true,
      data: () => ({
        name: 'User One',
        email: 'user1@example.com',
        username: 'lockedname',
      }),
    });

    mockRefGet.mockResolvedValue({
      data: () => ({
        name: 'Updated Name',
        email: 'user1@example.com',
        username: 'lockedname',
        bio: 'Updated bio',
        updatedAt: '2026-03-19T00:00:00.000Z',
      }),
    });

    fastify.firestore.collection = vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            name: 'User One',
            email: 'user1@example.com',
            username: 'lockedname',
          }),
        }),
        set: mockRefSet,
      }),
      where: mockWhere,
    });

    const originalFind = await findUserDocByUid(fastify, 'user-1');
    expect(originalFind).not.toBeNull();

    // direct query path for patch function
    fastify.firestore.collection = vi.fn().mockReturnValue({
      doc: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            name: 'User One',
            email: 'user1@example.com',
            username: 'lockedname',
          }),
        }),
        set: mockRefSet,
      }),
      where: vi.fn(),
    });

    const result = await patchMyProfile(
      {
        firestore: {
          collection: vi.fn().mockReturnValue({
            doc: vi.fn().mockReturnValue({
              get: vi.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  name: 'User One',
                  email: 'user1@example.com',
                  username: 'lockedname',
                }),
              }),
              set: mockRefSet,
            }),
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
              }),
              get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
            }),
          }),
        },
      } as any,
      'user-1',
      {
        name: 'Updated Name',
        bio: 'Updated bio',
        username: 'should-not-change',
      } as any
    ).catch(() => null);

    expect(mockRefSet).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'Updated Name',
            bio: 'Updated bio',
            updatedAt: '2026-03-19T00:00:00.000Z',
        }),
        { merge: true }
    );

    expect(result).toEqual(
        expect.objectContaining({
            uid: 'user-1',
            username: 'lockedname',
        })
    );
  })
});