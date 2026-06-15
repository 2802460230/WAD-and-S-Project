import { render, screen } from "@testing-library/react";
import BookmarksPage from "../app/(app)/bookmarks/page";
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

  test("shows loading state initially", () => {
    render(<BookmarksPage />);
    expect(screen.getByText("Loading bookmarks…")).toBeInTheDocument();
  });

  test("shows saved count badge", () => {
    render(<BookmarksPage />);
    expect(screen.getByText("0 Saved")).toBeInTheDocument();
  });
});
