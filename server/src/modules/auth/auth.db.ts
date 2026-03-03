/**
 * Development Database - In-Memory User Storage
 * Used when Firebase is not configured
 */

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  dob: string;
  bio?: string;
  gender?: string;
  country?: string;
  profilePhoto?: string;
  createdAt: Date;
}

class DevDatabase {
  private users: Map<string, User> = new Map();
  private idCounter = 1;

  async findUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ id: string }> {
    const id = `user_${this.idCounter++}`;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    console.log('✅ User created in dev database:', { id, email: user.email });
    return { id };
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
}

export const devDB = new DevDatabase();
