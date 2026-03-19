import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',  //tells Vitest this is backend testing
    include: ['./tests/**/*.test.ts'], //tells it to only look inside tests folder
    clearMocks: true, //resets mocks between tests
  },
});