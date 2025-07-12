import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

// Mocks
const mockUseNavigate = jest.fn();

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

jest.mock("~/hooks/useLoginRoleRedirect", () => ({
  useLoginRoleRedirect: () => "supervisor",
}));

jest.mock("~/services/auth", () => ({
  fetchAuthToken: jest.fn(),
  fetchUserProfile: jest.fn(),
}));

jest.mock("~/utils", () => ({
  setAccessTokenInCookie: jest.fn(),
}));

import Login from "~/routes/login";
import { MemoryRouter } from "react-router";
import { UserContext } from "~/contexts/UserContext";

describe("Login.test.tsx", () => {
  const mockSetUser = jest.fn();

  const renderWithContext = () =>
    render(
      <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("form interaction", () => {
    it("renders the login form", () => {
      renderWithContext();
      expect(
        screen.getByRole("heading", { name: "Login" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
      expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    it("updates input fields correctly", async () => {
      renderWithContext();
      const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
      const passwordInput = screen.getByTestId(
        "password-input"
      ) as HTMLInputElement;

      await userEvent.type(emailInput, "user@example.com");
      await userEvent.type(passwordInput, "secret");

      expect(emailInput.value).toBe("user@example.com");
      expect(passwordInput.value).toBe("secret");
    });

    it("toggles password visibility", async () => {
      renderWithContext();
      const toggleButton = screen.getByTestId("toggle-password-visibility"); // IconButton is visually hidden

      const passwordInput = screen.getByTestId("password-input");
      expect(passwordInput).toHaveAttribute("type", "password");

      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
    });
  });

  describe("login behavior", () => {
    const { fetchAuthToken, fetchUserProfile } = require("~/services/auth");
    const { setAccessTokenInCookie } = require("~/utils");

    it("shows error when login fails", async () => {
      fetchAuthToken.mockResolvedValue({
        data: null,
        error: "Invalid credentials",
      });

      renderWithContext();

      await userEvent.type(
        screen.getByTestId("email-input"),
        "fail@example.com"
      );
      await userEvent.type(screen.getByTestId("password-input"), "wrongpass");
      await userEvent.click(screen.getByTestId("login-button"));

      await waitFor(() => {
        expect(
          screen.getByText(/an error occurred while logging in/i)
        ).toBeInTheDocument();
      });
    });

    it("logs in successfully and redirects", async () => {
      // Return the raw access token string
      fetchAuthToken.mockResolvedValue({
        data: "valid-token",
        error: undefined,
      });

      fetchUserProfile.mockResolvedValue({
        data: {
          id: 1,
          name: "John Doe",
          role: "supervisor",
        },
        error: undefined,
      });

      renderWithContext();

      await userEvent.type(
        screen.getByTestId("email-input"),
        "john@example.com"
      );
      await userEvent.type(
        screen.getByTestId("password-input"),
        "correctpassword"
      );
      await userEvent.click(screen.getByTestId("login-button"));

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith({
          id: 1,
          name: "John Doe",
          role: "supervisor",
        });

        expect(setAccessTokenInCookie).toHaveBeenCalledWith("valid-token");
        expect(mockUseNavigate).toHaveBeenCalledWith("/supervisor-dashboard"); // adjust if path is different
      });
    });
  });
});
