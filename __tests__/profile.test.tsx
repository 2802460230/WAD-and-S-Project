import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "../app/(app)/profile/page";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockFetch = (url: string) => {
  if (url === "/api/profile") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ email: "test@example.com", name: "Test User" }),
    });
  }
  if (url === "/api/history") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }
  if (url === "/api/bookmarks") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }
  return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
};

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(mockFetch) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Profile Page", () => {
  test("renders profile page", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("shows Change Password and Log Out buttons", async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
  });

  test("clicking Change Password shows the password form", async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    expect(screen.getByText("Current Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Password" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("shows error when new passwords do not match", async () => {
    const { container } = render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordInputs[1], { target: { value: "newpassword123" } });
    fireEvent.change(passwordInputs[2], { target: { value: "differentpassword" } });
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));
    expect(screen.getByText("New passwords do not match")).toBeInTheDocument();
  });

  test("cancel hides the password form", async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Current Password")).not.toBeInTheDocument();
  });
});
