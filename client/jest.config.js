module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/test-utils/jest.setup.tsx"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  clearMocks: true,
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/test-utils/styleMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@react-navigation/.*|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|@react-native-picker/picker)"
  ]
};