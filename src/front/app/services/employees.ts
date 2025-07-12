import { MissingAccessTokenError } from "~/constants/errors";
import { employeeListUrl, employeeSignupUrl } from "~/constants/linksConfig";
import type { Employee } from "~/types";
import { getAccessTokenFromCookie } from "~/utils";
import apiClient, { parseApiError } from "~/utils/apiClient";

export async function fetchEmployeesList(): Promise<{
  data: Employee[];
  error?: string;
}> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .get(employeeListUrl, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as Employee[] };
  } catch (error) {
    console.error("Failed to fetch employees list:", error);
    return { data: [], error: error + "" };
  }
}

export async function signupEmployee(
  employee: Omit<
    Employee,
    "id" | "date_joined" | "assigned_supervisor" | "role"
  > & { password: string }
): Promise<{ data?: Employee; error?: string }> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .post(employeeSignupUrl, employee, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as Employee };
  } catch (error) {
    console.error("Failed to signup employee:", error);
    return { error: error + "" };
  }
}
