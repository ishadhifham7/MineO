import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable validation
 */
function validateEnv() {
  // Only require real Firebase/GROQ in production
  if (process.env.NODE_ENV === 'production') {
    const required = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY',
      'GROQ_API_KEY',
      'JWT_SECRET',
    ];

    const missing = required.filter((key) => !process.env[key] || process.env[key]?.includes('mock'));

    if (missing.length > 0) {
      throw new Error(`❌ Missing required production environment variables: ${missing.join(', ')}`);
    }
  }
}

validateEnv();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'mineo-dev-mock',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'dev@mineo-dev-mock.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),

  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-dev',
} as const;

export type Env = typeof env;
