import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HistoryPage from "../app/(app)/history/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe("History Page", () => {
  test("renders history page", () => {
    render(<HistoryPage />);
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  test("displays topic filter buttons", () => {
    render(<HistoryPage />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Algebra" })).toBeInTheDocument();
  });
});