import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "../app/(app)/dashboard/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Dashboard Page", () => {
  test("renders dashboard", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Submit a problem")).toBeInTheDocument();
  });

  test("shows text input by default", () => {
    render(<DashboardPage />);
    expect(
      screen.getByPlaceholderText("e.g.  Solve x² + 5x + 6 = 0")
    ).toBeInTheDocument();
  });

  test("shows error when text input is empty and submitted", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: /Solve Problem/i }));
    expect(
      screen.getByText("Please enter a math problem")
    ).toBeInTheDocument();
  });

  test("switches to image input when image tab is clicked", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: /Image/i }));
    expect(screen.getByText("Upload an image")).toBeInTheDocument();
  });
});