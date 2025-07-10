const BASE_API_URL = "http://127.0.0.1:8000/api";

export const authUrl = `${BASE_API_URL}/auth/`;

export const supervisorSignupUrl = `${BASE_API_URL}/supervisors/signup/`;

export const employeeListUrl = `${BASE_API_URL}/employees/`;

export const employeeSignupUrl = `${BASE_API_URL}/employees/signup/`;

export const leaveRequestListUrl = `${BASE_API_URL}/leave-requests/`;

export const leaveRequestCreateUrl = `${BASE_API_URL}/leave-requests/create/`;

export const buildLeaveRequestStatusUpdateUrl = (id: number) =>
  `${BASE_API_URL}/leave-requests/${id}/status/`;

export const userProfileUrl = `${BASE_API_URL}/profile/`;
