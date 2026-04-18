import { render, screen } from "@testing-library/react";
import ResultsPage from "../app/results/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Results Page", () => {
  test("renders results page", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Solve x² + 5x + 6 = 0")).toBeInTheDocument();
  });

  test("displays topic category", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Topic: Algebra")).toBeInTheDocument();
  });

  test("displays all solution steps", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  test("displays step explanations", () => {
    render(<ResultsPage />);
    expect(
      screen.getByText("Factor the quadratic expression")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Set each factor equal to zero")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solve for x in each equation")
    ).toBeInTheDocument();
  });

  test("displays action buttons", () => {
    render(<ResultsPage />);
    expect(screen.getByText("View Hints")).toBeInTheDocument();
    expect(screen.getByText("View Practice Problems")).toBeInTheDocument();
    expect(screen.getByText("Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Solve Another Problem")).toBeInTheDocument();
  });
});