import axios from "axios";
import axiosRetry from "axios-retry";

const apiClient = axios.create({
  timeout: 30000,
});

// Retry configuration
axiosRetry(apiClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export function parseApiError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const response = (error as any).response;
    if (response?.data?.detail) return response.data.detail;
    if (response?.data) return JSON.stringify(response.data);
  }

  return error instanceof Error ? error.message : String(error);
}

export default apiClient;
