import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProvider, useUser } from "~/contexts/UserContext";
import { UserRole, type User } from "~/types";

const mockUser: User = {
  id: 1,
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  national_id: "1234567890",
  phone_number: "09123456789",
  leave_requests_left: 5,
  role: UserRole.EMPLOYEE,
  assigned_supervisor: 1,
  date_joined: "2024-01-01T00:00:00Z",
};

const TestComponent = () => {
  const { user, setUser } = useUser();
  return (
    <div>
      <p data-testid="user-email">{user ? user.email : "No user"}</p>
      <button onClick={() => setUser(mockUser)}>Set User</button>
      <button onClick={() => setUser(null)}>Clear User</button>
    </div>
  );
};

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with null user", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("No user");
  });

  it("loads user from localStorage", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // wait for useEffect to run
    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
  });

  it("sets user and persists to localStorage", async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await userEvent.click(screen.getByText("Set User"));

    await waitFor(() =>
      expect(screen.getByTestId("user-email")).toHaveTextContent(mockUser.email)
    );

    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
  });

  it("clears user from state and localStorage", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // first make sure mockUser is displayed
    await screen.findByText(mockUser.email);

    await userEvent.click(screen.getByText("Clear User"));

    await waitFor(() =>
      expect(screen.getByTestId("user-email")).toHaveTextContent("No user")
    );
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("throws if useUser is called outside provider", () => {
    // silence expected console.error from React
    jest.spyOn(console, "error").mockImplementation(() => {});

    const Broken = () => {
      useUser(); // should throw
      return null;
    };

    expect(() => render(<Broken />)).toThrow(
      "useUser must be used within a UserProvider"
    );

    (console.error as jest.Mock).mockRestore();
  });
});
