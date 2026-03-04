import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Environment variable validation
 */
function validateEnv() {
  // Only validate critical env vars in production
  const required = isDevelopment
    ? ['JWT_SECRET']
    : [
        'JWT_SECRET',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY',
        'GROQ_API_KEY',
      ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    if (isDevelopment) {
      console.warn(`⚠️ Warning: Missing optional environment variables: ${missing.join(', ')}`);
      console.warn('⚠️ Some features may not work without proper configuration');
    } else {
      throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

validateEnv();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'dev-project',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'dev@example.com',
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || 'dev-key').replace(/\\n/g, '\n'),
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',

  JWT_SECRET:
    process.env.JWT_SECRET || 'super-secret-jwt-key-change-this-in-production-use-random-string',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
} as const;

export type Env = typeof env;
