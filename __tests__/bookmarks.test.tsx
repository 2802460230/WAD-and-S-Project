import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BookmarksPage from "../app/(app)/bookmarks/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe("Bookmarks Page", () => {
  test("renders bookmarks page", () => {
    render(<BookmarksPage />);
    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });

  test("shows saved count badge", () => {
    render(<BookmarksPage />);
    expect(screen.getByText(/Saved/i)).toBeInTheDocument();
  });
});