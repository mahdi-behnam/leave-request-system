import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeaveRequestsTab from "~/components/dashboard/employee/LeaveRequestsTab";
import { LeaveRequest } from "~/types";

// Mock services
jest.mock("~/services/leaveRequests", () => ({
  fetchLeaveRequestsList: jest.fn(),
  deleteLeaveRequest: jest.fn(),
}));

import {
  fetchLeaveRequestsList,
  deleteLeaveRequest,
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

describe("LeaveRequestsTab (Employee)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays leave requests", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      expect(screen.getByText("Vacation")).toBeInTheDocument();
      expect(screen.getByText("Family event")).toBeInTheDocument();
    });
  });

  it("disables delete button for non-pending rows", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId("delete-button");
      expect(deleteButtons.length).toBe(2);

      // Second request is "approved", should be disabled
      expect(deleteButtons[1]).toBeDisabled();
    });
  });

  it("deletes a pending request and refreshes the table", async () => {
    (fetchLeaveRequestsList as jest.Mock).mockResolvedValue({
      data: mockLeaveRequests,
      error: undefined,
    });

    (deleteLeaveRequest as jest.Mock).mockResolvedValue({
      error: undefined,
    });

    render(<LeaveRequestsTab />);

    await waitFor(() => {
      expect(screen.getByText("Vacation")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId("delete-button");
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteLeaveRequest).toHaveBeenCalledWith(1);
      expect(fetchLeaveRequestsList).toHaveBeenCalledTimes(2); // initial + after delete
    });
  });
});
