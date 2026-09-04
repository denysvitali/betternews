import { expect, test, type Browser, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const screenshotDir = "screenshots";

async function loadStories(
  page: Page,
  theme: "light" | "dark",
  url = "/",
  density: "comfortable" | "super" = "comfortable"
) {
  await page.addInitScript(({ selectedTheme, selectedDensity }) => {
    window.localStorage.setItem("theme", selectedTheme);
    window.localStorage.setItem("betternews-density", selectedDensity);
  }, { selectedTheme: theme, selectedDensity: density });
  await page.goto(url);
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
  theme: "light" | "dark",
  options: { url?: string; density?: "comfortable" | "super"; fullPage?: boolean } = {}
) {
  const context = await browser.newContext({ viewport, colorScheme: theme });
  const page = await context.newPage();
  await loadStories(page, theme, options.url, options.density);
  await expect(page.locator("html")).toHaveClass(new RegExp(theme));
  await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: options.fullPage ?? true });
  await context.close();
}

test.beforeAll(async () => {
  await mkdir(screenshotDir, { recursive: true });
});

test("capture the core responsive UI", async ({ browser }) => {
  await capture(browser, "home-desktop-light", { width: 1440, height: 1000 }, "light");
  await capture(browser, "home-mobile-light", { width: 390, height: 844 }, "light");
  await capture(browser, "home-mobile-compact-page2", { width: 390, height: 844 }, "light", {
    url: "/?page=2",
    density: "super",
    fullPage: false,
  });
  await capture(browser, "home-desktop-dark", { width: 1440, height: 1000 }, "dark");
});
