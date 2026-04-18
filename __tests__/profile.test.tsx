import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "../app/profile/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Profile Page", () => {
  test("renders profile page with user data", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Jack J. Jackson")).toBeInTheDocument();
    expect(screen.getByText("jack@email.com")).toBeInTheDocument();
  });

  test("switches to edit mode when Edit Profile is clicked", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("shows error when name is cleared and saved", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    fireEvent.change(screen.getByDisplayValue("Jack J. Jackson"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  test("shows error when email is cleared and saved", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    fireEvent.change(screen.getByDisplayValue("jack@email.com"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("cancel button returns to view mode", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Jack J. Jackson")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Profile" })).toBeInTheDocument();
  });

  test("shows success message after saving valid changes", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(
      screen.getByText("Profile updated successfully")
    ).toBeInTheDocument();
  });
});