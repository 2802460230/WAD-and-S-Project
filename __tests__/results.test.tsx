import { render, screen } from "@testing-library/react";
import ResultsPage from "../app/results/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockSolution = {
  topic: "Algebra",
  problemId: "test-id",
  steps: [
    { step: 1, explanation: "Factor the quadratic expression", result: "(x+2)(x+3) = 0" },
    { step: 2, explanation: "Set each factor equal to zero", result: "x+2=0, x+3=0" },
    { step: 3, explanation: "Solve for x in each equation", result: "x=-2, x=-3" },
  ],
};

beforeEach(() => {
  sessionStorage.setItem("solution", JSON.stringify(mockSolution));
  sessionStorage.setItem("problem", "Solve x² + 5x + 6 = 0");
});

afterEach(() => {
  sessionStorage.clear();
});

describe("Results Page", () => {
  test("renders results page with problem", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Solve x² + 5x + 6 = 0")).toBeInTheDocument();
  });

  test("displays topic", () => {
    render(<ResultsPage />);
    expect(screen.getByText("Algebra")).toBeInTheDocument();
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
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Bookmark")).toBeInTheDocument();
    expect(screen.getByText("New problem")).toBeInTheDocument();
  });
});
