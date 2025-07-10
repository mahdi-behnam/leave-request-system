import axios from "axios";
import axiosRetry from "axios-retry";

const apiClient = axios.create({
  timeout: 30000,
});

// Retry configuration
axiosRetry(apiClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default apiClient;
