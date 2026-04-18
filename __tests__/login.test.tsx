import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/login/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Login Page", () => {
  test("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  test("shows error when email is empty", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("shows error when password is empty", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("you@email.com"), {
      target: { value: "test@email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});