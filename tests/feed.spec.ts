import { expect, test } from "@playwright/test";
import { mockFeed } from "./feed-fixture";

for (const width of [320, 390, 768, 1440]) {
  test(`feed fits and stays readable at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 844 });
    await mockFeed(page);
    await page.goto("/");
    await expect(page.locator(".story-card")).toHaveCount(30);
    const bounds = await page.locator(".story-card").nth(3).boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThan(780);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator(".story-card").first().locator(".story-title")).toHaveAttribute("href", "https://postalemployeenetwork.com/story/1");
    await expect(page.locator(".story-card").nth(4).locator(".story-title")).toHaveAttribute("href", "/story?id=5");
    const save = page.locator(".story-card").first().getByRole("button", { name: "Add to reading list" });
    await save.click();
    await expect(page.locator(".story-card").first().getByRole("button", { name: "Remove from reading list" })).toBeVisible();
    await page.reload();
    await expect(page.locator(".story-card").first().getByRole("button", { name: "Remove from reading list" })).toBeVisible();
    expect(errors).toEqual([]);
    const navigation = page.getByRole("navigation", { name: width < 768 ? "Mobile navigation" : "Main navigation" });
    await navigation.getByRole("link", { name: "New", exact: true }).click();
    await expect(page.getByRole("heading", { name: "New stories." })).toBeVisible();
  });
}

test("mobile theme and density controls work, and page two retains ranks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockFeed(page);
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/?page=2");
  await expect(page.locator(".story-rank").first()).toHaveText("31");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Display settings" }).click();
  await page.getByRole("button", { name: "Use super compact density" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "super");
  await expect(page.locator(".story-card").first().getByRole("button", { name: "Add to reading list" })).toBeVisible();
  await page.getByRole("button", { name: "Close display settings" }).click();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("combobox")).toBeVisible();
});


test("touch controls fit on a narrow phone", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await mockFeed(page);
  await page.goto("/");
  await expect(page.locator(".story-card")).toHaveCount(30);
  const card = page.locator(".story-card").first();
  const bookmark = card.getByRole("button", { name: "Add to reading list" });
  const bounds = await bookmark.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await bookmark.tap();
  await expect(card.getByRole("button", { name: "Remove from reading list" })).toBeVisible();
  await context.close();
});
