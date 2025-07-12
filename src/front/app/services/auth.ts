import { AxiosError } from "axios";
import { MissingAccessTokenError } from "~/constants/errors";
import { authUrl, userProfileUrl } from "~/constants/linksConfig";
import type { Employee, Supervisor } from "~/types";
import { getAccessTokenFromCookie } from "~/utils";
import apiClient, { parseApiError } from "~/utils/apiClient";

export async function fetchAuthToken(
  email: string,
  password: string
): Promise<{
  data?: string;
  error?: string;
}> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) return { data: accessToken };
    const response = await apiClient
      .post(authUrl, {
        username: email,
        password,
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });

    return { data: response.data.token };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to login:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to login:", error);
    return { error: error + "" };
  }
}

export async function fetchUserProfile(): Promise<{
  data?: Employee | Supervisor;
  error?: string;
}> {
  try {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) throw new MissingAccessTokenError();
    const response = await apiClient
      .get(userProfileUrl, {
        headers: { Authorization: `Token ${accessToken}` },
      })
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as Employee | Supervisor };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to fetch user profile:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to fetch user profile:", error);
    return { error: error + "" };
  }
}
