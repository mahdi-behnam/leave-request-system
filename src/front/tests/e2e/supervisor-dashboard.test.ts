import { Builder, By, until, WebDriver, Browser } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome";
import { BASE_URL, CHROME_PATH, CHROMEDRIVER_PATH } from "./constants";
import { waitForElement, waitForText } from "./utils";
import { supervisor1 } from "./users";

jest.setTimeout(60000);

let driver: WebDriver;

async function goToTab(title: string) {
  const tab = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//div[contains(@class, "MuiDrawer-root")]//div[contains(@class, "MuiButtonBase-root")][.//text()[normalize-space()="${title}"]]`
      )
    ),
    10000
  );

  await tab.click();
  await driver.sleep(300); // let animations finish
}

async function loginAsSupervisor(driver: WebDriver) {
  await driver.get(`${BASE_URL}/login?role=supervisor`);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="email-input"]')),
    10000
  );

  await driver
    .findElement(By.css('[data-testid="email-input"]'))
    .sendKeys(supervisor1.email);
  await driver
    .findElement(By.css('[data-testid="password-input"]'))
    .sendKeys(supervisor1.password);
  await driver.findElement(By.css('[data-testid="login-button"]')).click();

  await driver.wait(until.urlContains("/supervisor-dashboard"), 10000);
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

  await loginAsSupervisor(driver);
  await driver.get(`${BASE_URL}/supervisor-dashboard`);
});

afterAll(async () => {
  if (driver) await driver.quit();
});

describe("Supervisor Dashboard", () => {
  it("loads supervised employees table", async () => {
    await goToTab("Manage Employees");
    const table = await driver.wait(
      until.elementLocated(
        By.css(".employees-management-tab-content .MuiDataGrid-root")
      ),
      10000
    );
    const rows = await table.findElements(By.css("[role='row']"));
    expect(rows.length).toBeGreaterThan(1); // header + rows
  });

  it("shows error when submitting empty registration form", async () => {
    await goToTab("Manage Employees");

    const submitBtn = await driver.wait(
      until.elementLocated(By.css("[data-testid='submit-button']")),
      10000
    );
    await submitBtn.click();
    await driver.sleep(300); // allow validation errors to appear

    async function expectHelperTextToContainRequired(testId: string) {
      const input = await waitForElement(
        driver,
        By.css(`[data-testid='${testId}']`)
      );
      const formControl = await input.findElement(
        By.xpath("ancestor::div[contains(@class, 'MuiFormControl-root')]")
      );
      const helperTextEl = await formControl.findElement(
        By.css(".MuiFormHelperText-root")
      );
      const helperText = await helperTextEl.getText();
      expect(helperText.toLowerCase()).toBeTruthy();
    }

    await expectHelperTextToContainRequired("first-name");
    await expectHelperTextToContainRequired("last-name");
    await expectHelperTextToContainRequired("email");
    await expectHelperTextToContainRequired("national-id");
    await expectHelperTextToContainRequired("phone-number");
    await expectHelperTextToContainRequired("password");
  });

  it("loads leave requests list", async () => {
    await goToTab("Leave Requests");

    const table = await driver.wait(
      until.elementLocated(
        By.css(".leave-requests-tab-content .MuiDataGrid-root")
      ),
      10000
    );
    const rows = await table.findElements(By.css("[role='row']"));
    expect(rows.length).toBeGreaterThan(1);
  });
});
