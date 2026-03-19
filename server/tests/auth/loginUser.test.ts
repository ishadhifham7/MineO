import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock('../../src/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret',
  },
}));

vi.mock('../../src/config/firebase', () => ({
  firestore: {
    collection: vi.fn(),
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { firestore } from '../../src/config/firebase';
import { loginUser } from '../../src/modules/auth/auth.service';

describe('loginUser', () => {
  const mockGet = vi.fn();
  const mockWhere = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (firestore.collection as any).mockReturnValue({
      where: mockWhere,
    });
  });

  it('returns a token for valid credentials', async () => {
    mockWhere.mockReturnValue({
      get: mockGet.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: 'user-1',
            data: () => ({
              email: 'user@example.com',
              password: 'hashed-password',
            }),
          },
        ],
      }),
    });

    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('mock-token');

    const result = await loginUser('user@example.com', 'pass123');

    expect(bcrypt.compare).toHaveBeenCalledWith('pass123', 'hashed-password');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'user-1', email: 'user@example.com' },
      'test-secret',
      { expiresIn: '3d' }
    );
    expect(result).toEqual({ token: 'mock-token' });
  });

  it('throws when user is not found', async () => {
    mockWhere.mockReturnValue({
      get: mockGet.mockResolvedValue({
        empty: true,
        docs: [],
      }),
    });

    await expect(loginUser('missing@example.com', 'pass123')).rejects.toThrow(
      'Invalid email or password'
    );
  });

  it('throws when password is invalid', async () => {
    mockWhere.mockReturnValue({
      get: mockGet.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: 'user-1',
            data: () => ({
              email: 'user@example.com',
              password: 'hashed-password',
            }),
          },
        ],
      }),
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(loginUser('user@example.com', 'wrong-pass')).rejects.toThrow(
      'Invalid credentials'
    );
  });
});