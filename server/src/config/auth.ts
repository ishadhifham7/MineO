import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  tokenExpiration: '3d',
  refreshTokenExpiration: '30d',
} as const;

export type AuthConfig = typeof authConfig;
