export const BASE_URL = "http://localhost:5173";
export const CHROME_PATH =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
export const CHROMEDRIVER_PATH =
  "C:\\Users\\Mahdi\\.cache\\selenium\\chromedriver\\win64\\150.0.7871.46\\chromedriver.exe";

const headlessValue =
  process.env.E2E_HEADLESS ?? process.env.npm_config_headless ?? "true";

export const E2E_HEADLESS = !["false", "0", "no", "off"].includes(
  headlessValue.toLowerCase(),
);
