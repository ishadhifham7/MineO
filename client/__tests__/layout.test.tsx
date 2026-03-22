import React from "react";
import { render } from "@testing-library/react-native";
import RootLayout from "../app/_layout";

jest.mock("expo-router", () => ({
    Stack: ({ children }: any) => children ?? null,
}));

jest.mock("expo-font", () => ({
    useFonts: jest.fn(),
}));

jest.mock("@expo-google-fonts/dancing-script", () => ({
    DancingScript_400Regular: "font1",
    DancingScript_700Bold: "font2",
}));

jest.mock("@expo-google-fonts/roboto", () => ({
    Roboto_400Regular: "font3",
    Roboto_500Medium: "font4",
    Roboto_700Bold: "font5",
}));

jest.mock("../src/providers/AuthProvider", () => ({
    AuthProvider: ({ children }: any) => children,
}));

jest.mock("../src/providers/JourneyProvider", () => ({
    JourneyProvider: ({ children }: any) => children,
}));

jest.mock("../src/features/goal/goal.context", () => ({
    GoalProvider: ({ children }: any) => children,
}));

jest.mock("../src/providers/ProfileProvider", () => ({
    ProfileProvider: ({ children }: any) => children,
}));

jest.mock("../src/design-system", () => ({
    AppThemeProvider: ({ children }: any) => children,
    useAppTheme: () => ({
        theme: {
        colors: {
            background: "#ffffff",
        },
        },
    }),
}));

describe("RootLayout", () => {
    /*
    Checks whether the app shows a loading spinner before 
    fonts and initial layout resources finish loading.
    */
    it("shows loading indicator while fonts are loading", () => {
        const { useFonts } = require("expo-font");
        useFonts.mockReturnValue([false]);

        const { UNSAFE_getByType } = render(<RootLayout />);
        expect(
        UNSAFE_getByType(require("react-native").ActivityIndicator)
        ).toBeTruthy();
    });


    
    /*
    Verifies that the main application layout is rendered once loading is complete
    */
    it("renders app after fonts load", () => {
        const { useFonts } = require("expo-font");
        useFonts.mockReturnValue([true]);

        const { toJSON } = render(<RootLayout />);
        expect(toJSON()).toBeTruthy();
    });
});

