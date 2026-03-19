import { beforeEach, describe, expect, it, vi } from 'vitest';

// mock bcrypt first
vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
    },
}));

// mock firebase config used inside auth.service.ts
vi.mock('../../src/config/firebase', () => ({
    firestore: {
        collection: vi.fn(),
    },
}));

import bcrypt from 'bcryptjs';
import { firestore } from '../../src/config/firebase';
import { signupUser } from '../../src/modules/auth/auth.service';

describe('signupUser', () => {
    const mockGet = vi.fn();
    const mockLimit = vi.fn();
    const mockWhere = vi.fn();
    const mockAdd = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        mockWhere.mockReset();
        mockGet.mockReset();
        mockLimit.mockReset();
        mockAdd.mockReset();

        // default firestore collection mock
        (firestore.collection as any).mockReturnValue({
        where: mockWhere,
        add: mockAdd,
        });
    });

    it('creates a new user successfully when email and username are unique', async () => {
        // first where(...email...).get() => no existing email
        // second where(...username...).limit(1).get() => no existing username
        mockWhere
        .mockImplementationOnce(() => ({
            get: mockGet.mockResolvedValueOnce({ empty: true }),
        }))
        .mockImplementationOnce(() => ({
            limit: mockLimit.mockReturnValue({
            get: mockGet.mockResolvedValueOnce({ empty: true }),
            }),
        }));

        (bcrypt.hash as any).mockResolvedValue('hashed-password');
        mockAdd.mockResolvedValue({ id: 'user_123' });

        const input = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: '000001',
            dob: '2002-05-10',
            bio: 'Hello there',
            gender: 'Male',
            country: 'Sri Lanka',
            profilePhoto: '',
        };

        const result = await signupUser(input);

        expect(bcrypt.hash).toHaveBeenCalledWith('000001', 10);

        expect(mockAdd).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'hashed-password',
            dob: '2002-05-10',
            bio: 'Hello there',
            gender: 'Male',
            country: 'Sri Lanka',
            profilePhoto: '',
            createdAt: expect.any(Date),
        });

        expect(result).toEqual({ id: 'user_123' });
    });

    it('throws an error when the email already exists', async () => {
        mockWhere.mockImplementationOnce(() => ({
        get: mockGet.mockResolvedValueOnce({ empty: false }),
        }));

        const input = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: '000001',
            dob: '2002-05-10',
        };

        await expect(signupUser(input)).rejects.toThrow('User already exists');

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('generates a unique username when the base username already exists', async () => {
        mockWhere
        // email uniqueness check
        .mockImplementationOnce(() => ({
            get: mockGet.mockResolvedValueOnce({ empty: true }),
        }))
        // username check for "test_001" => exists
        .mockImplementationOnce(() => ({
            limit: mockLimit.mockReturnValue({
            get: mockGet.mockResolvedValueOnce({ empty: false }),
            }),
        }))
        // username check for "test_0011" => available
        .mockImplementationOnce(() => ({
            limit: mockLimit.mockReturnValue({
            get: mockGet.mockResolvedValueOnce({ empty: true }),
            }),
        }));

        (bcrypt.hash as any).mockResolvedValue('hashed-password');
        mockAdd.mockResolvedValue({ id: 'user_456' });

        const input = {
            name: 'Test_001',
            email: 'test0012@example.com',
            password: '000001',
            dob: '2002-05-10',
        };

        const result = await signupUser(input);

        expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
            username: 'test0011',
        }),
        );

        expect(result).toEqual({ id: 'user_456' });
    });
});