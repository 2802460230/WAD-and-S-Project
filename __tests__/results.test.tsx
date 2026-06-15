import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ResultsPage from "../app/results/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Results Page", () => {
  test("renders results page without crashing", () => {
    render(<ResultsPage />);
    expect(document.body).toBeInTheDocument();
  });

  test("shows loading or content", () => {
    render(<ResultsPage />);
    const body = document.body.textContent;
    expect(body).toBeTruthy();
  });
});