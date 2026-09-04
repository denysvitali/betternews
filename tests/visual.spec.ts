import { chromium, expect, test, type Page } from "@playwright/test";
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
  name: string,
  viewport: { width: number; height: number },
  theme: "light" | "dark",
  options: {
    url?: string;
    density?: "comfortable" | "super";
    fullPage?: boolean;
    deviceScaleFactor?: number;
  } = {}
) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    deviceScaleFactor: options.deviceScaleFactor,
  });
  const page = await context.newPage();
  await loadStories(page, theme, options.url, options.density);
  await expect(page.locator("html")).toHaveClass(new RegExp(theme));
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("nav").first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: `${screenshotDir}/${name}.png`,
    fullPage: options.fullPage ?? true,
    animations: "disabled",
  });
  await context.close();
  await browser.close();
}

test.beforeAll(async () => {
  await mkdir(screenshotDir, { recursive: true });
});

test("capture the core responsive UI", async () => {
  await capture("home-phone-2x-page2", { width: 360, height: 740 }, "light", {
    url: "/?page=2",
    density: "super",
    fullPage: false,
    deviceScaleFactor: 2,
  });
  await capture("home-desktop-light", { width: 1440, height: 1000 }, "light");
  await capture("home-mobile-light", { width: 390, height: 844 }, "light");
  await capture("home-mobile-compact-page2", { width: 390, height: 844 }, "light", {
    url: "/?page=2",
    density: "super",
    fullPage: false,
  });
  await capture("home-desktop-dark", { width: 1440, height: 1000 }, "dark");
});
