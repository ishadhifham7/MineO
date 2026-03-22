// This prevents native module crashes during tests

import "@testing-library/jest-native/extend-expect";



jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
    SafeAreaView: ({ children }: any) => <View>{children}</View>,
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

jest.spyOn(globalThis.console, "warn").mockImplementation(() => {});
jest.spyOn(globalThis.console, "error").mockImplementation(() => {});