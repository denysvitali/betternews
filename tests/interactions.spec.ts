import { expect, test } from "@playwright/test";
import { mockDiscussion } from "./story-fixture";

test("feed loads continuously with a single manual fallback", async ({ page }) => {
  await mockDiscussion(page);
  await page.goto("/");
  await expect(page.locator(".story-card")).toHaveCount(30);
  await expect(page.getByRole("button", { name: "Load more stories" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous" })).toHaveCount(0);
  await expect(page.locator(".story-card-featured")).toHaveCount(0);
});

test("action slots line up whether or not a story has an external link", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mockDiscussion(page);
  await page.goto("/");
  const bookmarks = page.locator(".story-card .story-bookmark");
  await expect(bookmarks).toHaveCount(30);
  // Story 5 is an Ask HN without an external URL.
  const xs = await Promise.all([0, 4].map(async (i) => (await bookmarks.nth(i).boundingBox())!.x));
  expect(xs[0]).toBe(xs[1]);
  // Two-line rows on desktop.
  expect((await page.locator(".story-card").nth(1).boundingBox())!.height).toBeLessThan(72);
});

test("opened stories dim and new comments are flagged", async ({ page }) => {
  await mockDiscussion(page);
  await page.addInitScript(() => {
    if (!localStorage.getItem("betternews_history")) {
      localStorage.setItem("betternews_history", JSON.stringify({ 2: { visited: true, comments: 1, at: Date.now() } }));
    }
  });
  await page.goto("/");
  const seen = page.locator('.story-card[data-story-id="2"]');
  await expect(seen).toHaveAttribute("data-visited", "true");
  await expect(seen.getByRole("link", { name: "6 comments, 5 new" })).toBeVisible();

  const fresh = page.locator('.story-card[data-story-id="5"]');
  await expect(fresh).not.toHaveAttribute("data-visited", "true");
  await fresh.locator(".story-title").click();
  await expect(page).toHaveURL(/\/story\/5$/);
  await page.goBack();
  await expect(page.locator('.story-card[data-story-id="5"]')).toHaveAttribute("data-visited", "true");
});

test("keyboard navigation selects, saves and marks stories read", async ({ page }) => {
  await mockDiscussion(page);
  await page.goto("/");
  await expect(page.locator(".story-card")).toHaveCount(30);
  await page.keyboard.press("j");
  await expect(page.locator(".story-card").nth(0)).toHaveAttribute("data-selected", "true");
  await page.keyboard.press("j");
  await expect(page.locator(".story-card").nth(1)).toHaveAttribute("data-selected", "true");
  await expect(page.locator('.story-card[data-selected="true"]')).toHaveCount(1);
  await page.keyboard.press("s");
  await expect(page.locator(".story-card").nth(1).getByRole("button", { name: "Remove from reading list" })).toBeVisible();
  await page.keyboard.press("x");
  await expect(page.locator(".story-card").nth(1)).toHaveAttribute("data-visited", "true");
  await page.keyboard.press("k");
  await expect(page.locator(".story-card").nth(0)).toHaveAttribute("data-selected", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator('.story-card[data-selected="true"]')).toHaveCount(0);
});

test("compact density is a labelled toggle", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await mockDiscussion(page);
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Use super compact density" });
  await expect(toggle).toHaveText("Compact");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.getByRole("button", { name: "Use normal density" })).toHaveAttribute("aria-pressed", "true");
});

test("discussion flags OP, collapses from the author row and shows a sticky story bar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockDiscussion(page);
  await page.goto("/story/1");
  await expect(page.locator("#comment-1002")).toBeVisible();
  await expect(page.locator("#comment-1002 .comment-op").first()).toHaveText("OP");
  await expect(page.locator("#comment-1001 .comment-op")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Comments", exact: true })).toHaveCount(0);

  // The collapse control sits beside the author, not at the far edge.
  const toggle = await page.getByRole("button", { name: "Collapse comment by reader1", exact: true }).boundingBox();
  const author = await page.locator("#comment-1001").getByRole("link", { name: "reader1", exact: true }).boundingBox();
  expect(Math.abs(toggle!.x - author!.x)).toBeLessThan(40);

  const bar = page.locator(".sticky-story-bar");
  await expect(bar).toHaveAttribute("data-visible", "false");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(bar).toHaveAttribute("data-visible", "true");
  await expect(bar).toContainText("U.S. postal inspectors");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).toHaveAttribute("data-visible", "false");
});

test("discussion view records the seen comment count", async ({ page }) => {
  await mockDiscussion(page);
  await page.goto("/story/1");
  await expect(page.locator("#comment-1001")).toBeVisible();
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem("betternews_history") || "{}"));
  expect(history["1"]).toMatchObject({ visited: true, comments: 27 });
});

test("swiping a row right saves it and left toggles read", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await mockDiscussion(page);
  await page.goto("/");
  const card = page.locator('.story-card[data-story-id="2"]');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const y = box.y + 20;
  const cdp = await context.newCDPSession(page);
  const swipe = async (from: number, to: number) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from, y }] });
    for (let step = 1; step <= 8; step++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from + ((to - from) * step) / 8, y }] });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };

  await swipe(60, 260);
  await expect(card.getByRole("button", { name: "Remove from reading list" })).toBeVisible();
  await swipe(320, 100);
  await expect(card).toHaveAttribute("data-visited", "true");
  await swipe(320, 100);
  await expect(card).not.toHaveAttribute("data-visited", "true");
  // A short drag must not trigger anything.
  await swipe(200, 240);
  await expect(card.getByRole("button", { name: "Remove from reading list" })).toBeVisible();
  await context.close();
});
