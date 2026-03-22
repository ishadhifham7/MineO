import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HabitsScreen from "../app/tabs/habit";

const mockSetActiveTab = jest.fn();
const mockUpdateDailyHabit = jest.fn();
const mockRefreshCalendar = jest.fn();
const mockRefreshRadar = jest.fn();
const mockUseHabit = jest.fn();

jest.mock("../src/features/habit/HabitContext", () => ({
  HabitProvider: ({ children }: any) => children,
  useHabit: () => mockUseHabit(),
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

jest.mock("../src/components/habit/HabitHeader", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return ({ active, onChange }: any) => (
    <TouchableOpacity onPress={() => onChange("Body")}>
      <Text>Header-{active}</Text>
    </TouchableOpacity>
  );
});

jest.mock("../src/components/habit/HabitCalendar", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ category }: any) => <Text>Calendar-{category}</Text>;
});

jest.mock("../src/components/habit/HabitRadarChart", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ values }: any) => <Text>Radar-{JSON.stringify(values)}</Text>;
});

jest.mock("../src/components/habit/HabitStatusCard", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");

  return ({ title, onSelect }: any) => (
    <TouchableOpacity onPress={() => onSelect(4)}>
      <Text>Status-{title}</Text>
    </TouchableOpacity>
  );
});

describe("Habit Tracker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  /*
  The habit tracker displays a loading message while habit data is being fetched.
  */
  it("shows loading state while habits are loading", () => {
    mockUseHabit.mockReturnValue({
      activeTab: "Mind",
      setActiveTab: mockSetActiveTab,
      visibleCalendar: {},
      radarValues: [],
      updateDailyHabit: mockUpdateDailyHabit,
      isLoading: true,
      isSaving: false,
      error: null,
      refreshCalendar: mockRefreshCalendar,
      refreshRadar: mockRefreshRadar,
    });

    const { getByText } = render(<HabitsScreen />);
    expect(getByText("Habit Studio")).toBeTruthy();
    expect(getByText("Loading habits...")).toBeTruthy();
  });

  /*
  selecting a daily habit status correctly triggers the update function.
  */
  it("calls updateDailyHabit when a daily status is selected", async () => {
    mockUseHabit.mockReturnValue({
      activeTab: "Mind",
      setActiveTab: mockSetActiveTab,
      visibleCalendar: {},
      radarValues: [1, 2, 3],
      updateDailyHabit: mockUpdateDailyHabit,
      isLoading: false,
      isSaving: false,
      error: null,
      refreshCalendar: mockRefreshCalendar,
      refreshRadar: mockRefreshRadar,
    });

    const { getByText } = render(<HabitsScreen />);
    fireEvent.press(getByText("Status-Mind"));

    await waitFor(() => {
      expect(mockUpdateDailyHabit).toHaveBeenCalled();
    });
  });

  /*
  pressing the radar refresh action requests updated habit chart data.
  */
  it("refreshes radar data when refresh button is pressed", async () => {
    mockUseHabit.mockReturnValue({
      activeTab: "Mind",
      setActiveTab: mockSetActiveTab,
      visibleCalendar: {},
      radarValues: [1, 2, 3],
      updateDailyHabit: mockUpdateDailyHabit,
      isLoading: false,
      isSaving: false,
      error: null,
      refreshCalendar: mockRefreshCalendar,
      refreshRadar: mockRefreshRadar,
    });

    const { getByText } = render(<HabitsScreen />);
    fireEvent.press(getByText("Refresh Radar Data"));

    await waitFor(() => {
      expect(mockRefreshRadar).toHaveBeenCalled();
    });
  });
});