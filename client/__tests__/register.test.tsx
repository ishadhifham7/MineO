import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import SignupDetailsScreen from "../app/auth/register";

jest.mock("../src/design-system/ThemeProvider", () => ({
  useAppTheme: () => ({
    theme: {
      colors: {
        background: "#ffffff",
        text: "#000000",
        primary: "#4F46E5",
        card: "#F5F5F5",
        border: "#E5E7EB",
      },
    },
  }),
  AppThemeProvider: ({ children }: any) => children,
}));

jest.mock("expo-router", () => require("../test-utils/mocks/expo-router"));

const mockRefreshAuth = jest.fn();
const mockSignupUser = jest.fn();

jest.mock("../src/hooks/useAuth", () => ({
    useAuth: () => ({
        refreshAuth: mockRefreshAuth,
    }),
}));

jest.mock("../src/services/auth.service", () => ({
    signupUser: (...args: any[]) => mockSignupUser(...args),
}));

jest.mock("expo-image-picker", () => ({
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({
        granted: true,
    }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({
        canceled: true,
    }),
    MediaTypeOptions: {
        Images: "Images",
    },
}));

jest.mock("@react-native-picker/picker", () => {
    const React = require("react");
    const { View, Text, TouchableOpacity } = require("react-native");

    let pickerCount = 0;

    const Picker = ({ children, onValueChange }: any) => {
        const currentPicker = pickerCount++;
        const pickerName =
        currentPicker === 0 ? "day" : currentPicker === 1 ? "month" : "year";

        return (
            <View>
                {React.Children.map(children, (child: any, index: number) => {
                if (!child) return null;

                return (
                    <TouchableOpacity
                    onPress={() => onValueChange(child.props.value)}
                    testID={`${pickerName}-item-${String(child.props.label)}-${index}`}
                    >
                    <Text>{child.props.label}</Text>
                    </TouchableOpacity>
                );
                })}
            </View>
        );
    };

    Picker.Item = ({ label }: any) => <Text>{label}</Text>;

    return { Picker };
});


describe("SignupDetailsScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /* 
    Checks whether the register details screen loads with the expected input fields and signup button.
    */
    it("renders register form correctly", () => {
        const { getByText, getByPlaceholderText } = render(<SignupDetailsScreen />);

        expect(getByText("More About You")).toBeTruthy();
        expect(getByPlaceholderText("Tell us about yourself")).toBeTruthy();
        expect(getByPlaceholderText("Enter your country name")).toBeTruthy();
        expect(getByText("Sign Up")).toBeTruthy();
    });


    /* 
    user must select a date of birth before completing signup.
    */
    it("shows DOB validation if date is not selected", async () => {
        const { getByText } = render(<SignupDetailsScreen />);

        fireEvent.press(getByText("Sign Up"));

        await waitFor(() => {
            expect(getByText("Please select your date of birth")).toBeTruthy();
        });
    });

    /* 
    Valid registration details trigger the signup flow successfully.
    */
    it("submits successfully when required fields are valid", async () => {
        const { replace } = require("../test-utils/mocks/expo-router");
        const alertSpy = jest.spyOn(Alert, "alert");

        mockSignupUser.mockResolvedValueOnce({});
        mockRefreshAuth.mockResolvedValueOnce({});

        const { getByText, getByTestId, getByPlaceholderText, getAllByTestId } = render(
        <SignupDetailsScreen />
        );

        fireEvent.changeText(
        getByPlaceholderText("Tell us about yourself"),
        "This is a test bio"
        );
        fireEvent.changeText(
        getByPlaceholderText("Enter your country name"),
        "Test Country"
        );

        
        const ones = getAllByTestId("year-item-1-1");
        fireEvent.press(ones[0]);
        fireEvent.press(ones[1]);
        fireEvent.press(getByTestId("year-item-2000-27"));

        fireEvent.press(getByText("Sign Up"));

        await waitFor(() => {
            expect(mockSignupUser).toHaveBeenCalled();
            expect(mockRefreshAuth).toHaveBeenCalled();
            expect(alertSpy).toHaveBeenCalledWith(
                    "Success",
                    "Account created successfully"
            );
             expect(replace).toHaveBeenCalledWith("/onboarding/step1");
        });
    });


    /*
    error message is shown when account creation fails.
    */
    it("shows alert if signup fails", async () => {
        const alertSpy = jest.spyOn(Alert, "alert");
        mockSignupUser.mockRejectedValueOnce(new Error("Signup failed"));

        const { getByText, getByTestId, getByPlaceholderText, getAllByTestId } = render(<SignupDetailsScreen />);

        const ones = getAllByTestId("year-item-1-1");
        fireEvent.press(ones[0]);
        fireEvent.press(ones[1]);
        fireEvent.press(getByTestId("year-item-2000-27"));

        fireEvent.press(getByText("Sign Up"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                "Sign Up Failed",
                "Signup failed"
            );
        });
    });
});