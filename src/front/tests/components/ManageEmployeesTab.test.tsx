import { render, screen, waitFor } from "@testing-library/react";
import ManageEmployeesTab from "~/components/dashboard/supervisor/ManageEmployeesTab";
import * as employeesService from "~/services/employees";
import userEvent from "@testing-library/user-event";
import { Employee, UserRole } from "~/types";

const mockEmployees: Employee[] = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    national_id: "1234567890",
    phone_number: "09123456789",
    leave_requests_left: 10,
    assigned_supervisor: 1,
    date_joined: "2023-01-01",
    role: UserRole.EMPLOYEE,
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Jones",
    email: "bob@example.com",
    national_id: "0987654321",
    phone_number: "09987654321",
    leave_requests_left: 7,
    assigned_supervisor: 1,
    date_joined: "2023-02-01",
    role: UserRole.EMPLOYEE,
  },
];

// Mock RegisterNewEmployeeForm to avoid testing it here
jest.mock("~/components/dashboard/supervisor/RegisterNewEmployeeForm", () => ({
  __esModule: true,
  default: ({ refreshTableCallback }: { refreshTableCallback: () => void }) => (
    <button data-testid="mock-register-form" onClick={refreshTableCallback}>
      Mock RegisterNewEmployeeForm
    </button>
  ),
}));

jest.mock("~/services/employees", () => ({
  fetchEmployeesList: jest.fn(),
}));

const mockedFetchEmployeesList =
  employeesService.fetchEmployeesList as jest.Mock;

describe("ManageEmployeesTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders headings and structure", () => {
    mockedFetchEmployeesList.mockResolvedValue({ data: [], error: null });

    render(<ManageEmployeesTab />);

    expect(screen.getByText(/Supervised Employees List/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Here you can view and manage/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-register-form")).toBeInTheDocument();
  });

  it("renders rows after data fetch", async () => {
    mockedFetchEmployeesList.mockResolvedValue({
      data: mockEmployees,
      error: null,
    });

    render(<ManageEmployeesTab />);

    // Wait for the data to appear
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Jones")).toBeInTheDocument();
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    });
  });

  it("does not crash if fetch fails", async () => {
    mockedFetchEmployeesList.mockResolvedValue({
      data: null,
      error: "Network error",
    });

    render(<ManageEmployeesTab />);

    await waitFor(() => {
      // It should not crash, just render an empty table
      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
    });
  });

  it("refreshes table when form triggers refreshTableCallback", async () => {
    const fetchSpy = jest
      .spyOn(employeesService, "fetchEmployeesList")
      .mockResolvedValueOnce({ data: [] }) // Initial render
      .mockResolvedValueOnce({ data: mockEmployees }); // On refresh

    render(<ManageEmployeesTab />);

    const refreshButton = screen.getByTestId("mock-register-form");
    await userEvent.click(refreshButton);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });
  });
});
