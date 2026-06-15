import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../app/register/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Register Page", () => {
  test("renders register form", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
  });

  test("shows error when email is empty", () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("shows error when email format is invalid", () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "notanemail" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows error when password is empty", () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("shows error when password is less than 8 characters", () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "differentpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });
});