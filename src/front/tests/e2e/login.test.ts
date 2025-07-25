import { Builder, By, until, WebDriver, Browser } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome";
import { BASE_URL, CHROME_PATH, CHROMEDRIVER_PATH } from "./constants";
import { waitForElement, waitForText } from "./utils";
import { UserRole } from "~/types";
import { employee1, supervisor1 } from "./users";

jest.setTimeout(60000);

let driver: WebDriver;

beforeEach(async () => {
  const options = new Chrome.Options();
  options.setChromeBinaryPath(CHROME_PATH);
  options.addArguments(
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage"
  );

  const service = new Chrome.ServiceBuilder(CHROMEDRIVER_PATH);

  driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
});

afterEach(async () => {
  if (driver) await driver.quit();
});

const login = async (userRole: UserRole, email: string, password: string) => {
  await driver.get(
    `${BASE_URL}/login?role=${
      userRole === UserRole.EMPLOYEE ? "employee" : "supervisor"
    }`
  );

  const emailInput = await waitForElement(
    driver,
    By.css('[data-testid="email-input"]')
  );
  const passwordInput = await waitForElement(
    driver,
    By.css('[data-testid="password-input"]')
  );
  const submitBtn = await waitForElement(
    driver,
    By.css('[data-testid="login-button"]')
  );

  await emailInput.clear();
  await emailInput.sendKeys(email);

  await passwordInput.clear();
  await passwordInput.sendKeys(password);

  await submitBtn.click();
};

describe("Login Flow", () => {
  it("logs in as an employee and redirects to employee dashboard", async () => {
    await login(UserRole.EMPLOYEE, employee1.email, employee1.password);
    await driver.wait(until.urlContains("/employee-dashboard"), 10000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain("/employee-dashboard");
  });

  it("logs in as a supervisor and redirects to supervisor dashboard", async () => {
    await login(UserRole.SUPERVISOR, supervisor1.email, supervisor1.password);
    await driver.wait(until.urlContains("/supervisor-dashboard"), 10000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain("/supervisor-dashboard");
  });

  it("shows supervisor sign-up link on login page", async () => {
    await driver.get(`${BASE_URL}/login?role=supervisor`);
    const link = await waitForElement(
      driver,
      By.linkText("Create an account?")
    );
    const href = await link.getAttribute("href");
    expect(href).toContain("/register-supervisor");
  });

  it("doesn't show supervisor sign-up link on employee login page", async () => {
    await driver.get(`${BASE_URL}/login?role=employee`);
    const link = await driver.findElements(By.linkText("Create an account?"));
    expect(link.length).toBe(0);
  });

  it("shows error on invalid credentials", async () => {
    await login(UserRole.EMPLOYEE, "invalid@example.com", "wrongpassword");
    const alert = await waitForElement(driver, By.css(".MuiAlert-root"));
    const text = await waitForText(driver, alert);
    expect(text.toLowerCase()).toContain("error");
  });
});
