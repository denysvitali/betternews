import { expect, test, type Browser, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const screenshotDir = "screenshots";

async function loadStories(page: Page, theme: "light" | "dark") {
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem("theme", selectedTheme);
  }, theme);
  await page.goto("/");
  await expect(page.locator("article").first()).toBeVisible({ timeout: 45_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(750);
}

async function capture(
  browser: Browser,
  name: string,
  viewport: { width: number; height: number },
  theme: "light" | "dark"
) {
  const context = await browser.newContext({ viewport, colorScheme: theme });
  const page = await context.newPage();
  await loadStories(page, theme);
  await expect(page.locator("html")).toHaveClass(new RegExp(theme));
  await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
  await context.close();
}

test.beforeAll(async () => {
  await mkdir(screenshotDir, { recursive: true });
});

test("capture the core responsive UI", async ({ browser }) => {
  await capture(browser, "home-desktop-light", { width: 1440, height: 1000 }, "light");
  await capture(browser, "home-mobile-light", { width: 390, height: 844 }, "light");
  await capture(browser, "home-desktop-dark", { width: 1440, height: 1000 }, "dark");
});
