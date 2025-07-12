import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocks
const mockRefresh = jest.fn();

jest.mock("~/components/common/DateTimePicker", () => ({
  __esModule: true,
  default: ({ label, value, onChange }: any) => (
    <input
      data-testid={label === "Start Date" ? "start-date" : "end-date"}
      value={value ? new Date(value).toISOString().slice(0, 16) : ""}
      onChange={(e) => onChange(new Date(e.target.value))}
      type="datetime-local"
    />
  ),
}));

jest.mock("~/services/leaveRequests", () => ({
  createLeaveRequest: jest.fn(),
}));

import SubmitNewRequestForm from "~/components/dashboard/employee/SubmitNewRequestForm";

import { createLeaveRequest } from "~/services/leaveRequests";

describe("SubmitNewRequestForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<SubmitNewRequestForm refreshTableCallback={mockRefresh} />);

    expect(screen.getByText("Submit New Request")).toBeInTheDocument();
    expect(screen.getByTestId("start-date")).toBeInTheDocument();
    expect(screen.getByTestId("end-date")).toBeInTheDocument();
    expect(screen.getByTestId("reason-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("shows error if dates are missing", async () => {
    render(<SubmitNewRequestForm refreshTableCallback={mockRefresh} />);

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.getByText(/start and end dates are required/i)
      ).toBeInTheDocument();
    });
  });

  it("shows error if start date is after end date", async () => {
    render(<SubmitNewRequestForm refreshTableCallback={mockRefresh} />);

    await userEvent.type(screen.getByTestId("reason-input"), "Test leave");
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "2025-07-24T00:00" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "2025-07-23T00:00" },
    });

    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.getByText(/start date must be before end date/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data and resets state", async () => {
    (createLeaveRequest as jest.Mock).mockResolvedValue({
      data: { id: 123 },
      error: undefined,
    });

    render(<SubmitNewRequestForm refreshTableCallback={mockRefresh} />);

    // Fill form
    await userEvent.type(screen.getByTestId("reason-input"), "Vacation");
    fireEvent.change(screen.getByTestId("start-date"), {
      target: { value: "2025-07-23T00:00" },
    });
    fireEvent.change(screen.getByTestId("end-date"), {
      target: { value: "2025-07-24T00:00" },
    });

    // Submit
    await userEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(createLeaveRequest).toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
      expect(screen.queryByText("Vacation")).not.toBeInTheDocument();
    });
  });
});
