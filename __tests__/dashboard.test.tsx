import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "../app/dashboard/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Dashboard Page", () => {
  test("renders dashboard", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Submit a Problem")).toBeInTheDocument();
  });

  test("shows text input by default", () => {
    render(<DashboardPage />);
    expect(
      screen.getByPlaceholderText("e.g. Solve x² + 5x + 6 = 0")
    ).toBeInTheDocument();
  });

  test("shows error when text input is empty and submitted", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: "Solve" }));
    expect(
      screen.getByText("Please enter a math problem")
    ).toBeInTheDocument();
  });

  test("switches to image input when image tab is clicked", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: "Image" }));
    expect(screen.getByText("Upload Image")).toBeInTheDocument();
  });

  test("shows error when image tab selected but no file uploaded", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: "Image" }));
    fireEvent.click(screen.getByRole("button", { name: "Solve" }));
    expect(screen.getByText("Please upload an image")).toBeInTheDocument();
  });

  test("shows error when invalid file type is uploaded", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: "Image" }));
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText("Upload Image");
    fireEvent.change(input, { target: { files: [file] } });
    expect(
      screen.getByText("Only JPG and PNG images are allowed")
    ).toBeInTheDocument();
  });
});