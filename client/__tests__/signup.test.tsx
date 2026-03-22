import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import SignupScreen from "../app/auth/signup";

jest.mock("expo-router", () => require("../test-utils/mocks/expo-router"));

describe("SignupScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    /* Signup screen displays the 
      - name
      - email
      - password field
      - continue button        
    */
    it("renders signup form correctly", () => {
        const { getByPlaceholderText, getByText } = render(<SignupScreen />);

        expect(getByPlaceholderText("Your full name")).toBeTruthy();
        expect(getByPlaceholderText("you@example.com")).toBeTruthy();
        expect(getByPlaceholderText("Minimum 6 characters")).toBeTruthy();
        expect(getByText("Continue")).toBeTruthy();
    });

    /*
    Form blocks submission when mandatory fields are missing 
    */
    it("shows alert if required fields are empty", () => {
        const alertSpy = jest.spyOn(Alert, "alert");
        const { getByText } = render(<SignupScreen />);

        fireEvent.press(getByText("Continue"));

        expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "Please fill in all required fields."
        );
    });


    /*
     valid signup data navigates user to the registration details screen.
    */
    it("navigates to register page when input is valid", () => {
        const { push } = require("../test-utils/mocks/expo-router");
        const { getByPlaceholderText, getByText } = render(<SignupScreen />);

        fireEvent.changeText(getByPlaceholderText("Your full name"), "Test002");
        fireEvent.changeText(
        getByPlaceholderText("you@example.com"),
        "test002@gmail.com"
        );
        fireEvent.changeText(getByPlaceholderText("Minimum 6 characters"), "111111");
        fireEvent.press(getByText("Continue"));

        expect(push).toHaveBeenCalledWith({
        pathname: "/auth/register",
        params: {
            name: "Test002",
            email: "test002@gmail.com",
            password: "111111",
        },
        });
    });
});