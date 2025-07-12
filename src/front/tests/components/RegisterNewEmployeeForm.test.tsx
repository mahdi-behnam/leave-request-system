import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterNewEmployeeForm from "~/components/dashboard/supervisor/RegisterNewEmployeeForm";

// Mocks
const mockRefresh = jest.fn();

jest.mock("~/services/employees", () => ({
  signupEmployee: jest.fn(),
}));

import { signupEmployee } from "~/services/employees";

describe("RegisterNewEmployeeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<RegisterNewEmployeeForm refreshTableCallback={mockRefresh} />);

    expect(screen.getByTestId("first-name")).toBeInTheDocument();
    expect(screen.getByTestId("last-name")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("national-id")).toBeInTheDocument();
    expect(screen.getByTestId("phone-number")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("leave-requests-count")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<RegisterNewEmployeeForm refreshTableCallback={mockRefresh} />);

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.queryByText("First name is required")).toBeInTheDocument();
      expect(screen.queryByText("Last name is required")).toBeInTheDocument();
      expect(screen.queryByText("Invalid email address")).toBeInTheDocument();
      expect(
        screen.queryByText("National ID must be 10 digits")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Phone number must be 11 digits")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows error for negative leave requests count", async () => {
    render(<RegisterNewEmployeeForm refreshTableCallback={mockRefresh} />);

    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("national-id"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("phone-number"), {
      target: { value: "09123456789" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("leave-requests-count"), {
      target: { value: "-5" },
    });

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.queryByText("Leave requests count must be a non-negative number")
      ).toBeInTheDocument();
    });
  });

  it("calls API and resets form on successful submission", async () => {
    (signupEmployee as jest.Mock).mockResolvedValue({
      data: { id: 1 },
      error: undefined,
    });

    render(<RegisterNewEmployeeForm refreshTableCallback={mockRefresh} />);

    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("national-id"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("phone-number"), {
      target: { value: "09123456789" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("leave-requests-count"), {
      target: { value: "5" },
    });

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(signupEmployee).toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows registration error if API call fails", async () => {
    (signupEmployee as jest.Mock).mockResolvedValue({
      data: null,
      error: "Something went wrong",
    });

    render(<RegisterNewEmployeeForm refreshTableCallback={mockRefresh} />);

    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByTestId("national-id"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("phone-number"), {
      target: { value: "09123456789" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("leave-requests-count"), {
      target: { value: "5" },
    });

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
