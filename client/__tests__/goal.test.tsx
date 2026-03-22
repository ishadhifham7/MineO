import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import GoalsHome from "../app/tabs/goal/index";

jest.mock("expo-router", () => require("../test-utils/mocks/expo-router"));

const mockFetchGoals = jest.fn();
const mockUseGoal = jest.fn();

jest.mock("../src/features/goal/goal.context", () => ({
    useGoal: () => mockUseGoal(),
}));

jest.mock("../src/components/ui/HomeStyleScreen", () => {
    const React = require("react");
    const { View, Text } = require("react-native");

    return {
        HomeStyleScreen: ({ children, title, subtitle }: any) => (
        <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
            {children}
        </View>
        ),
        SectionCard: ({ children }: any) => <View>{children}</View>,
    };
});

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

jest.mock("expo-linear-gradient", () => ({
    LinearGradient: ({ children }: any) => children,
}));

describe("Goal Tracker", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    /*
    Goal tracker displays the correct empty-state message when no goals have been created.
     */
    it("shows empty state when there are no goals", () => {
        mockUseGoal.mockReturnValue({
        goals: [],
        fetchGoals: mockFetchGoals,
        });

        const { getByText } = render(<GoalsHome />);

        expect(getByText("Your Goals")).toBeTruthy();
        expect(getByText("No goals yet")).toBeTruthy();
        expect(
        getByText("Create your first goal and start tracking your progress.")
        ).toBeTruthy();
    });


    /*
    selecting a goal correctly opens the roadmap of that specific goal.
    */
    it("navigates to roadmap when a goal is pressed", () => {
        const { push } = require("../test-utils/mocks/expo-router");

        mockUseGoal.mockReturnValue({
        goals: [
            {
            id: "goal-1",
            title: "Complete Semester Plan",
            description: "Finish all weekly milestones",
            stages: [{ completed: true }, { completed: false }],
            },
        ],
        fetchGoals: mockFetchGoals,
        });

        const { getByText } = render(<GoalsHome />);

        fireEvent.press(getByText("Complete Semester Plan"));

        expect(push).toHaveBeenCalledWith("/tabs/goal/roadmap?id=goal-1");
    });


    /*
    create-goal action navigates the user to the goal creation screen.
    */
    it("navigates to create-goal chat screen", () => {
        const { push } = require("../test-utils/mocks/expo-router");

        mockUseGoal.mockReturnValue({
        goals: [],
        fetchGoals: mockFetchGoals,
        });

        const { getByText } = render(<GoalsHome />);

        fireEvent.press(getByText("Create New Goal"));

        expect(push).toHaveBeenCalledWith("/tabs/goal/chat");
    });
});