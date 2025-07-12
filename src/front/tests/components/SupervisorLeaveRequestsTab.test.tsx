import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeaveRequestsTab from "~/components/dashboard/supervisor/LeaveRequestsTab";
import { LeaveRequest } from "~/types";

// Mock services
jest.mock("~/services/leaveRequests", () => ({
  fetchLeaveRequestsList: jest.fn(),
  updateLeaveRequestStatus: jest.fn(),
}));

import {
  fetchLeaveRequestsList,
  updateLeaveRequestStatus,
} from "~/services/leaveRequests";

// Sample mock data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    status: "pending",
    start_date: "2025-07-10",
    end_date: "2025-07-12",
    created_at: "2025-07-01",
    reason: "Vacation",
  },
  {
    id: 2,
    status: "approved",
    start_date: "2025-07-05",
    end_date: "2025-07-07",
    created_at: "2025-07-01",
    reason: "Family event",
  },
];

describe("LeaveRequestsTab (Supervisor)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays leave requests", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Vacation")).toBeInTheDocument();
      expect(screen.getByText("Family event")).toBeInTheDocument();
    });
  });

  it("disables action buttons for non-pending rows", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // includes header
    });

    // "approved" row should have disabled buttons
    const approveButtons = screen.getAllByTestId("approve-button");
    expect(approveButtons[1]).toBeDisabled();

    const rejectButtons = screen.getAllByTestId("reject-button");
    expect(rejectButtons[1]).toBeDisabled();
  });

  it("approves a request and refreshes the table", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    (updateLeaveRequestStatus as jest.Mock).mockResolvedValue({
      data: { ...mockLeaveRequests[0], status: "approved" },
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      expect(screen.getByText("Vacation")).toBeInTheDocument();
    });

    const approveButtons = screen.getAllByTestId("approve-button");
    await userEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(updateLeaveRequestStatus).toHaveBeenCalledWith(1, "approved");
      expect(fetchLeaveRequestsList).toHaveBeenCalledTimes(2); // initial + after approval
    });
  });

  it("rejects a request and refreshes the table", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    (updateLeaveRequestStatus as jest.Mock).mockResolvedValue({
      data: { ...mockLeaveRequests[0], status: "rejected" },
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      expect(screen.getByText("Vacation")).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByTestId("reject-button");
    await userEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(updateLeaveRequestStatus).toHaveBeenCalledWith(1, "rejected");
      expect(fetchLeaveRequestsList).toHaveBeenCalledTimes(2);
    });
  });
});
