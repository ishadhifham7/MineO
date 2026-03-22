import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import LoginScreen from "../app/auth/login";

jest.mock("expo-router", () => require("../test-utils/mocks/expo-router"));

const mockRefreshAuth = jest.fn();
const mockLoginUser = jest.fn();

jest.mock("../src/hooks/useAuth", () => ({
    useAuth: () => ({
        refreshAuth: mockRefreshAuth,
    }),
}));

jest.mock("../src/services/auth.service", () => ({
    loginUser: (...args: any[]) => mockLoginUser(...args),
}));

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    /*
        Checks whether the login screen displays 
        - email field
        - password field, 
        - login button.
    */
    it("renders login form correctly", () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        expect(getByPlaceholderText("you@example.com")).toBeTruthy();
        expect(getByPlaceholderText("Enter your password")).toBeTruthy();
        expect(getByText("Log In")).toBeTruthy();
    });



    /*
        User cannot continue without entering 
         - username 
         - password
    */ 
    it("shows alert if email or password is empty", () => {
        const alertSpy = jest.spyOn(Alert, "alert");
        const { getByText } = render(<LoginScreen />);

        fireEvent.press(getByText("Log In"));

        expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "Please enter email and password"
        );
    });


    /* Valid login credentials:
      - trigger the login function,
      - refresh authentication,
      - redirect the user to the home screen
    */
    it("calls login service and navigates on success", async () => {
        const { replace } = require("../test-utils/mocks/expo-router");
        const alertSpy = jest.spyOn(Alert, "alert");

        mockLoginUser.mockResolvedValueOnce({});
        mockRefreshAuth.mockResolvedValueOnce({});

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText("you@example.com"), "test002@gmail.com");
        fireEvent.changeText(getByPlaceholderText("Enter your password"), "111111");
        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(mockLoginUser).toHaveBeenCalledWith("test002@gmail.com", "111111");
            expect(mockRefreshAuth).toHaveBeenCalled();
            expect(alertSpy).toHaveBeenCalledWith("Success", "Logged in successfully");
            expect(replace).toHaveBeenCalledWith("/tabs/home");

        });
    });


    /* 
     error alert displayed when login unsuccessful 
    */
    it("shows alert if login fails", async () => {
        const alertSpy = jest.spyOn(Alert, "alert");
        mockLoginUser.mockRejectedValueOnce(new Error("Invalid credentials"));

        const { getByPlaceholderText, getByText } = render(<LoginScreen />);

        fireEvent.changeText(getByPlaceholderText("you@example.com"), "test002@gmail.com");
        fireEvent.changeText(getByPlaceholderText("Enter your password"), "wrongpass");
        fireEvent.press(getByText("Log In"));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                "Log In Failed",
                "Invalid credentials"
            );
        });

    });
});