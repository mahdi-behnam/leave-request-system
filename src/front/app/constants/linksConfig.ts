const BACKEND_HOST = "http://127.0.0.1:8000";

export const BASE_API_URL = `${BACKEND_HOST}/api`;

export const adminLoginUrl = `${BACKEND_HOST}/admin/`;

export const authUrl = `${BASE_API_URL}/auth/`;

export const supervisorSignupUrl = `${BASE_API_URL}/supervisors/signup/`;

export const employeeListUrl = `${BASE_API_URL}/employees/`;

export const employeeSignupUrl = `${BASE_API_URL}/employees/signup/`;

export const leaveRequestListUrl = `${BASE_API_URL}/leave-requests/`;

export const leaveRequestCreateUrl = `${BASE_API_URL}/leave-requests/create/`;

export const buildLeaveRequestStatusUpdateUrl = (id: number) =>
  `${BASE_API_URL}/leave-requests/${id}/status/`;

export const buildLeaveRequestDeleteUrl = (id: number) =>
  `${BASE_API_URL}/leave-requests/${id}/delete/`;

export const userProfileUrl = `${BASE_API_URL}/profile/`;
