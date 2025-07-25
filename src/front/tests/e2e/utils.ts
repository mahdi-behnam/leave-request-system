import { By, WebDriver, until, WebElement, Locator } from "selenium-webdriver";

/**
 * Wait for an element to appear before returning it
 */
export async function waitForElement(
  driver: WebDriver,
  locator: Locator,
  timeout: number = 10000
): Promise<WebElement> {
  await driver.wait(until.elementLocated(locator), timeout);
  return driver.findElement(locator);
}

/**
 * Wait for an element's text to appear before returning its text
 */
export async function waitForText(
  driver: WebDriver,
  element: WebElement,
  timeout = 10000
): Promise<string> {
  await driver.wait(async () => {
    const text = await element.getText();
    return text.trim().length > 0;
  }, timeout);
  return element.getText();
}
