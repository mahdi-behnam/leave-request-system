export type LeaveRequest = {
  id: number;
  status: "pending" | "approved" | "rejected";
  start_date: string;
  end_date: string;
  created_at: string;
  reason: string | null;
};

export enum UserRole {
  SUPERVISOR = "supervisor",
  EMPLOYEE = "employee",
}

export interface BaseUser {
  id: number;
  date_joined: string;
  email: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone_number: string;
}

export interface Supervisor extends BaseUser {
  role: UserRole.SUPERVISOR;
}

export interface Employee extends BaseUser {
  role: UserRole.EMPLOYEE;
  leave_requests_left: number;
  assigned_supervisor: number | null;
}

export type User = Supervisor | Employee;
