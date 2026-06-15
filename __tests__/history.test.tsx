import { render, screen } from "@testing-library/react";
import HistoryPage from "../app/(app)/history/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("History Page", () => {
  test("renders history page", () => {
    render(<HistoryPage />);
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    render(<HistoryPage />);
    expect(screen.getByText("Loading history…")).toBeInTheDocument();
  });

  test("displays topic filter buttons", () => {
    render(<HistoryPage />);
    expect(screen.getByRole("button", { name: "Algebra" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calculus" })).toBeInTheDocument();
  });
});
