export type LeaveRequest = {
  id: number;
  status: "Pending" | "Approved" | "Rejected";
  startDate: string;
  endDate: string;
  createdAt: string;
  reason: string | null;
};

export enum UserRole {
  SUPERVISOR = "supervisor",
  EMPLOYEE = "employee",
}

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string | null;
  role: UserRole;
}

export interface Supervisor extends BaseUser {
  role: UserRole.SUPERVISOR;
}

export interface Employee extends BaseUser {
  assignedSupervisor: Supervisor | null;
  leaveRequestsLeft: number;
  role: UserRole.EMPLOYEE;
}

export type User = Supervisor | Employee;
