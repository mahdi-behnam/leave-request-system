import { AxiosError } from "axios";
import { MissingAccessTokenError } from "~/constants/errors";
import { supervisorSignupUrl } from "~/constants/linksConfig";
import type { Supervisor } from "~/types";
import { getAccessTokenFromCookie } from "~/utils";
import apiClient from "~/utils/apiClient";

export async function signupSupervisor(
  supervisor: Omit<Supervisor, "id" | "date_joined" | "role"> & {
    password: string;
  }
): Promise<{ data?: Supervisor; error?: string }> {
  try {
    const response = await apiClient
      .post(supervisorSignupUrl, supervisor)
      .catch((error) => {
        if (error.response.data.detail)
          throw new Error(error.response.data.detail);
        else if (error.response.data)
          throw new Error(JSON.stringify(error.response.data));
        else throw new Error(error);
      });
    return { data: response.data as Supervisor };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Failed to signup supervisor:",
        error.response.status,
        error.response.data
      );
    } else console.error("Failed to signup supervisor:", error);
    return { error: error + "" };
  }
}
