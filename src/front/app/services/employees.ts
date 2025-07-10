import { AxiosError } from "axios";
import { MissingAccessTokenError } from "~/constants/errors";
import { employeeListUrl, employeeSignupUrl } from "~/constants/linksConfig";
import type { Employee } from "~/types";
import { getAccessTokenFromCookie } from "~/utils";
import apiClient from "~/utils/apiClient";

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
        if (error.response.data.detail)
          throw new Error(error.response.data.detail);
        else throw new Error(error);
      });
    return { data: response.data as Employee[] };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to fetch employees list:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to fetch employees list:", error);
    return { data: [], error: error as string };
  }
}

export async function signupEmployee(
  employee: Omit<
    Employee,
    "id" | "date_joined" | "assigned_supervisor" | "role"
  >
): Promise<{ data?: Employee; error?: string }> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .post(employeeSignupUrl, employee, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        if (error.response.data.detail)
          throw new Error(error.response.data.detail);
        else throw new Error(error);
      });
    return { data: response.data as Employee };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to signup employee:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to signup employee:", error);
    return { error: error as string };
  }
}
