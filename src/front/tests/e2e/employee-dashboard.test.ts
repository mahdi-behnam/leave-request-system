import { Builder, By, until, WebDriver, Browser } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome";
import { BASE_URL, CHROME_PATH, CHROMEDRIVER_PATH } from "./constants";
import { waitForElement, waitForText } from "./utils";
import { employee1 } from "./users";

jest.setTimeout(60000);

let driver: WebDriver;

async function loginAsEmployee(driver: WebDriver) {
  await driver.get(`${BASE_URL}/login?role=employee`);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="email-input"]')),
    10000
  );

  await driver
    .findElement(By.css('[data-testid="email-input"]'))
    .sendKeys(employee1.email);
  await driver
    .findElement(By.css('[data-testid="password-input"]'))
    .sendKeys(employee1.password);
  await driver.findElement(By.css('[data-testid="login-button"]')).click();

  await driver.wait(until.urlContains("/employee-dashboard"), 10000);
}

beforeAll(async () => {
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

afterAll(async () => {
  if (driver) await driver.quit();
});

describe("Employee Dashboard", () => {
  it("renders dashboard with Leave Requests section", async () => {
    await loginAsEmployee(driver);
    const title = await waitForElement(
      driver,
      By.xpath("//h5[text()='Requests List']")
    );
    expect(await title.getText()).toBe("Requests List");
  });

  it("shows error if submitting empty form", async () => {
    await loginAsEmployee(driver);

    const submitBtn = await waitForElement(
      driver,
      By.css('[data-testid="submit-button"]')
    );
    await submitBtn.click();
    const alert = await waitForElement(driver, By.css(".MuiAlert-root"));
    const text = await waitForText(driver, alert);
    expect(text.toLowerCase()).toContain("required");
  });

  it("can submit a valid leave request", async () => {
    await loginAsEmployee(driver);

    // Select valid start and end date (fill with today/tomorrow)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const isoNow = now.toISOString();
    const isoTomorrow = tomorrow.toISOString();

    await driver
      .findElement(By.css('[data-testid="start-date"]'))
      .sendKeys(isoNow);
    await driver
      .findElement(By.css('[data-testid="end-date"]'))
      .sendKeys(isoTomorrow);
    await driver
      .findElement(By.css('[data-testid="reason-input"]'))
      .sendKeys("Going on vacation");

    await driver.findElement(By.css('[data-testid="submit-button"]')).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(@class, 'MuiDataGrid-row')]")
      ),
      10000
    );
  });
});
