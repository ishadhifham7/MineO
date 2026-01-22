import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  tokenExpiration: '7d',
  refreshTokenExpiration: '30d',
} as const;

export type AuthConfig = typeof authConfig;
