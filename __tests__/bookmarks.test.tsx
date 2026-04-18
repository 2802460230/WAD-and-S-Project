import { render, screen } from "@testing-library/react";
import BookmarksPage from "../app/bookmarks/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Bookmarks Page", () => {
  test("renders bookmarks page", () => {
    render(<BookmarksPage />);
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });

  test("displays placeholder bookmarks", () => {
    render(<BookmarksPage />);
    expect(
      screen.getByText("Solve x² + 5x + 6 = 0")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Find the derivative of x³ + 2x")
    ).toBeInTheDocument();
  });

  test("displays topic categories", () => {
    render(<BookmarksPage />);
    const algebraItems = screen.getAllByText(/Algebra/);
    expect(algebraItems.length).toBeGreaterThan(0);
  });
});