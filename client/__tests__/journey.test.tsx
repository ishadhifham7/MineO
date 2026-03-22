import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import JourneyScreen from "../app/tabs/journey";

jest.mock("expo-router", () => require("../test-utils/mocks/expo-router"));

jest.mock("@expo/vector-icons", () => ({
        Ionicons: "Ionicons",
}));

const mockUseAuth = jest.fn();
const mockUseJourney = jest.fn();
const mockGetById = jest.fn();

jest.mock("../src/providers/AuthProvider", () => ({
    useAuth: () => mockUseAuth(),
}));

jest.mock("../src/providers/JourneyProvider", () => ({
     useJourney: () => mockUseJourney(),
}));

jest.mock("../src/services/journal.service", () => ({
    JournalApi: {
        getById: (...args: any[]) => mockGetById(...args),
    },
}));

jest.mock("../src/components/ui/HomeStyleScreen", () => {
    const React = require("react");
    const { View, Text } = require("react-native");

    return {
        HomeStyleScreen: ({ children, title }: any) => (
        <View>
            <Text>{title}</Text>
            {children}
        </View>
        ),
        SectionCard: ({ children }: any) => <View>{children}</View>,
    };
});

jest.mock("../src/components/journey/JourneyCanvas", () => {
    const React = require("react");
    const { View } = require("react-native");

    return {
        JourneyCanvas: ({ children }: any) => <View>{children}</View>,
    };
});

jest.mock("../src/components/journey/TimelinePath", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return {
        TimelinePath: () => <Text>Timeline Path</Text>,
    };
});

jest.mock("../src/components/journey/JourneyNode", () => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");

    return {
        JourneyNode: ({ title, onPress }: any) => (
        <TouchableOpacity onPress={onPress}>
            <Text>{title}</Text>
        </TouchableOpacity>
        ),
    };
});

jest.mock("../src/components/journey/JournalModal", () => {
    const React = require("react");
    const { View, Text } = require("react-native");

    return {
        JournalModal: ({ isVisible, journal }: any) => (
        <View>
            {isVisible ? <Text>Modal Open</Text> : null}
            {journal ? <Text>{journal.title}</Text> : null}
        </View>
        ),
    };
});

describe("Journal / Journey", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    /*
    unauthenticated users are prompted to log in before accessing the journey feature.
    */
    it("shows login prompt when user is not authenticated", () => {
        const { push } = require("../test-utils/mocks/expo-router");

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
        });

        mockUseJourney.mockReturnValue({
            journals: [],
            isLoading: false,
            error: null,
            refreshJourneys: jest.fn(),
        });

        const { getByText } = render(<JourneyScreen />);
        expect(getByText("Please Login")).toBeTruthy();

        fireEvent.press(getByText("Go to Login"));
        expect(push).toHaveBeenCalledWith("/auth/login");
    });


    /*
    correct empty-state message is shown when no journal entries exist.
    */
    it("shows empty state when no journals are available", () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
        });

        mockUseJourney.mockReturnValue({
            journals: [],
            isLoading: false,
            error: null,
            refreshJourneys: jest.fn(),
        });

        const { getByText } = render(<JourneyScreen />);
        expect(getByText("No journals yet")).toBeTruthy();
        expect(getByText("Start writing to see your journey map unfold")).toBeTruthy();
    });


    /*
    selecting a journey node loads the journal details and opens the modal.
    */
    it("loads journal details when a journey node is pressed", async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
        });

        mockUseJourney.mockReturnValue({
            journals: [
                {
                id: "journal-1",
                title: "My First Entry",
                date: "2026-03-01",
                },
            ],
            isLoading: false,
            error: null,
            refreshJourneys: jest.fn(),
        });

        mockGetById.mockResolvedValueOnce({
            data: {
                id: "journal-1",
                title: "My First Entry",
            },
        });

        const { getByText } = render(<JourneyScreen />);
        fireEvent.press(getByText("My First Entry"));

        await waitFor(() => {
            expect(mockGetById).toHaveBeenCalledWith("journal-1");
            expect(getByText("Modal Open")).toBeTruthy();
        });
    });
});