import { AxiosError } from "axios";
import { MissingAccessTokenError } from "~/constants/errors";
import {
  leaveRequestListUrl,
  leaveRequestCreateUrl,
  buildLeaveRequestStatusUpdateUrl,
  buildLeaveRequestDeleteUrl,
} from "~/constants/linksConfig";
import type { LeaveRequest } from "~/types";
import { getAccessTokenFromCookie } from "~/utils";
import apiClient, { parseApiError } from "~/utils/apiClient";

export async function fetchLeaveRequestsList(): Promise<{
  data: LeaveRequest[];
  error?: string;
}> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .get(leaveRequestListUrl, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as LeaveRequest[] };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to fetch leave requests list:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to fetch leave requests list:", error);
    return { data: [], error: error + "" };
  }
}

export async function createLeaveRequest(
  leaveRequest: Omit<LeaveRequest, "id" | "created_at" | "status">
): Promise<{ data?: LeaveRequest; error?: string }> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .post(leaveRequestCreateUrl, leaveRequest, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as LeaveRequest };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to create leave request:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to create leave request:", error);
    return { error: error + "" };
  }
}

export async function updateLeaveRequestStatus(
  leaveRequestId: number,
  newStatus: LeaveRequest["status"]
): Promise<{ data?: { status: LeaveRequest["status"] }; error?: string }> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const payload = { status: newStatus };
    const url = buildLeaveRequestStatusUpdateUrl(leaveRequestId);
    const response = await apiClient
      .put(url, payload, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as LeaveRequest };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to update leave request status:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to update leave request status:", error);
    return { error: error + "" };
  }
}

export async function deleteLeaveRequest(
  leaveRequestId: number
): Promise<{ error?: string }> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const url = buildLeaveRequestDeleteUrl(leaveRequestId);
    const response = await apiClient
      .delete(url, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { error: undefined };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to delete leave request:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to delete leave request:", error);
    return { error: error + "" };
  }
}
