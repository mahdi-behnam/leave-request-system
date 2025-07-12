import { supervisorSignupUrl } from "~/constants/linksConfig";
import type { Supervisor } from "~/types";
import apiClient, { parseApiError } from "~/utils/apiClient";

export async function signupSupervisor(
  supervisor: Omit<Supervisor, "id" | "date_joined" | "role"> & {
    password: string;
  }
): Promise<{ data?: Supervisor; error?: string }> {
  try {
    const response = await apiClient
      .post(supervisorSignupUrl, supervisor)
      .catch((error) => {
        throw new Error(parseApiError(error));
      });
    return { data: response.data as Supervisor };
  } catch (error) {
    console.error("Failed to signup supervisor:", error);
    return { error: error + "" };
  }
}
