import { render, screen } from "@testing-library/react";
import HistoryPage from "../app/history/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("History Page", () => {
  test("renders history page", () => {
    render(<HistoryPage />);
    expect(screen.getByText("Problem History")).toBeInTheDocument();
  });

  test("displays placeholder problems", () => {
    render(<HistoryPage />);
    expect(
      screen.getByText("Solve x² + 5x + 6 = 0")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Find the derivative of x³ + 2x")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Simplify (2x + 3)(x - 1)")
    ).toBeInTheDocument();
  });

  test("displays topic categories", () => {
    render(<HistoryPage />);
    const algebraItems = screen.getAllByText(/Algebra/);
    expect(algebraItems.length).toBeGreaterThan(0);
  });
});