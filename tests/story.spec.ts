import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { mockDiscussion } from "./story-fixture";

for (const width of [320, 390, 768, 1440]) {
  test(`feed to story stays compact at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await mockDiscussion(page);
    await page.goto("/");
    await page.locator(".story-card").first().getByRole("link", { name: "27 comments", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("U.S. postal inspectors shut down website selling counterfeit postage labels");
    await expect(page.locator("#comment-1001")).toBeVisible();
    const firstComment = await page.locator("#comment-1001").boundingBox();
    expect(firstComment!.y).toBeLessThan(680);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.getByRole("link", { name: "Read original", exact: true })).toHaveAttribute("href", "https://postalemployeenetwork.com/story/1");
    await mkdir("screenshots", { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `screenshots/story-${width}.png`, animations: "disabled" });
    await page.getByRole("button", { name: "Add to reading list", exact: true }).click();
    await expect(page.getByRole("button", { name: "Remove from reading list", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Back to stories", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Top stories." })).toBeVisible();
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("discussion sorting, collapsing, depth and loading remain available", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockDiscussion(page);
  await page.goto("/story?id=1");
  await expect(page.locator("#comment-1001")).toBeVisible();
  await page.getByRole("button", { name: "Collapse comment by reader1", exact: true }).click();
  await expect(page.locator("#comment-1001 .comment-body")).toHaveCount(0);
  await page.getByRole("button", { name: "Expand comment by reader1", exact: true }).click();
  await expect(page.locator("#comment-2001")).toBeVisible();
  await expect(page.locator("#comment-4001")).toHaveCount(0);
  await page.getByRole("combobox", { name: "Thread depth", exact: true }).selectOption("99");
  await expect(page.locator("#comment-4001")).toBeVisible();
  await page.getByRole("radio", { name: "Newest", exact: true }).click();
  await expect(page.locator('[data-comment-level="0"]').first()).toHaveAttribute("data-comment-id", "1024");
  await page.getByRole("radio", { name: "Oldest", exact: true }).click();
  await expect(page.locator('[data-comment-level="0"]').first()).toHaveAttribute("data-comment-id", "1001");
  await page.getByRole("button", { name: /Load more comments/ }).click();
  await expect(page.locator('[data-comment-level="0"]')).toHaveCount(24);
  await page.getByRole("button", { name: "Next root comment", exact: true }).click();
  await expect(page.locator("#comment-1002")).toBeInViewport();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("combobox", { name: "Jump to thread", exact: true }).selectOption("2");
  await expect(page.locator("#comment-1003")).toBeInViewport();
});

test("story themes, compact density and text submissions", async ({ browser }) => {
  await mkdir("screenshots", { recursive: true });
  for (const theme of ["light", "dark"] as const) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme });
    const page = await context.newPage();
    await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
    await mockDiscussion(page);
    await page.goto("/story?id=1");
    await expect(page.locator("#comment-1001")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next root comment", exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `screenshots/story-mobile-${theme}.png`, animations: "disabled" });
    await page.getByRole("button", { name: "Display settings" }).click();
    await page.getByRole("button", { name: "Use super compact density" }).click();
    await page.getByRole("button", { name: "Close display settings" }).click();
    await expect(page.getByRole("link", { name: "Read original", exact: true })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "Sort comments", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await expect(page.getByRole("button", { name: "Copy link", exact: true })).toBeVisible();
    await page.goto("/story?id=5");
    await expect(page.locator(".story-author-text")).toContainText("Small projects are welcome too.");
    await expect(page.getByRole("link", { name: "Read original", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you working on this month?");
    await context.close();
  }
});
