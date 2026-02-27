/**
 * @deprecated Use "../../constants/env" instead
 * This file is kept for backward compatibility only.
 *
 * DO NOT USE THIS FILE - Use the main env.ts at client/constants/env.ts
 */

// Re-export from the main env configuration
export {
  env,
  API_BASE_URL,
  API_URL_EXPORT as API_URL,
} from "../../constants/env";

console.warn(
  "⚠️ WARNING: You are importing from src/constants/env.ts - use ../../constants/env instead!",
);
