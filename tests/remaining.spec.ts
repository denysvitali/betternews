import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { mockDiscussion } from "./story-fixture";

for (const [width, theme] of [[320, "light"], [390, "dark"], [1440, "light"]] as const) {
  test(`saved stories and profiles fit at ${width}px in ${theme} mode`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768, colorScheme: theme });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await mockDiscussion(page);
    await page.route("https://hacker-news.firebaseio.com/v0/user/*.json", route => route.fulfill({ json: {
      id: "ilamont", created: 1400000000, karma: 2300, submitted: [1, 5, 1001, 1002],
      about: "<p>I write about technology, small tools, and the people who make them.</p>",
    } }));
    await page.addInitScript(selectedTheme => {
      localStorage.setItem("theme", selectedTheme);
      if (!localStorage.getItem("betternews_bookmarks")) localStorage.setItem("betternews_bookmarks", JSON.stringify(Array.from({ length: 3 }, (_, index) => ({
        id: index + 1, title: index === 0 ? "U.S. postal inspectors shut down website selling counterfeit postage labels" : "A small discovery about how we read on the web",
        url: "https://example.com", time: 1700000000, by: "ilamont", score: 82, bookmarkedAt: Date.now() - 3600000,
      }))));
    }, theme);
    await page.goto("/saved");
    await expect(page.locator(".story-card")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await mkdir("screenshots", { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `screenshots/saved-${width}-${theme}.png`, animations: "disabled" });
    await page.locator(".story-card").first().locator(".story-title").click();
    await expect(page).toHaveURL(/\/story\?id=1$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("postal inspectors");
    await page.goBack();
    await expect(page.locator(".story-card")).toHaveCount(3);
    await page.locator(".story-card").first().getByRole("button", { name: "Remove from reading list" }).click();
    await expect(page.locator(".story-card")).toHaveCount(2);
    await page.reload();
    await expect(page.locator(".story-card")).toHaveCount(2);
    page.once("dialog", dialog => dialog.dismiss());
    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page.locator(".story-card")).toHaveCount(2);
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page.getByRole("heading", { name: "No saved stories" })).toBeVisible();
    await page.goto("/user/ilamont");
    await expect(page.getByRole("heading", { name: "ilamont", exact: true })).toBeVisible();
    await expect(page.locator(".profile-bio")).toContainText("small tools");
    await expect(page.locator(".story-card")).toHaveCount(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({ path: `screenshots/profile-${width}-${theme}.png`, animations: "disabled" });
    await page.getByRole("button", { name: "Comments 2" }).click();
    await expect(page.locator(".profile-comment")).toHaveCount(2);
    await page.getByRole("link", { name: "View context" }).first().click();
    await expect(page).toHaveURL(/\/story\?id=1$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("postal inspectors");
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("search supports saving, empty results and opening a discussion on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockDiscussion(page);
  await page.route("https://hn.algolia.com/api/v1/search**", route => route.fulfill({ json: {
    hits: route.request().url().includes("missing") ? [] : [{ objectID: "1", title: "U.S. postal inspectors shut down website selling counterfeit postage labels", url: "https://example.com", author: "ilamont", created_at_i: 1700000000, points: 82, num_comments: 27 }],
  } }));
  await page.goto("/");
  await expect(page.locator(".story-card")).toHaveCount(30);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Search", exact: true });
  await dialog.getByRole("combobox", { name: "Search stories" }).fill("postal");
  await expect(dialog.getByRole("option")).toHaveCount(1);
  const bounds = await dialog.locator(".surface-card").first().boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await dialog.getByRole("button", { name: "Add bookmark" }).click();
  await expect(dialog.getByRole("button", { name: "Remove bookmark" })).toBeVisible();
  await page.screenshot({ path: "screenshots/search-mobile.png", animations: "disabled" });
  await dialog.getByRole("combobox", { name: "Search stories" }).fill("missing");
  await expect(dialog.getByText('No stories found for "missing"')).toBeVisible();
  await dialog.getByRole("button", { name: "Close search" }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("combobox", { name: "Search stories" }).fill("postal");
  await page.getByRole("option").getByRole("link").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("postal inspectors");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
