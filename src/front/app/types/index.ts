type LeaveRequest = {
  id: number;
  status: "Pending" | "Approved" | "Rejected";
  startDate: string;
  endDate: string;
  createdAt: string;
  reason: string | null;
};
