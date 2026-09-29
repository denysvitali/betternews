import type { Page } from "@playwright/test";

const titles = [
  "U.S. postal inspectors shut down website selling counterfeit postage labels",
  "A small discovery about how we read on the web",
  "Show HN: I built a quiet place to keep my favorite links",
  "The surprisingly elegant history of the Unix pipe",
  "Ask HN: What are you working on this month?",
  "A practical guide to building software that lasts",
];

export async function mockFeed(page: Page) {
  await page.route("https://hacker-news.firebaseio.com/v0/**", async (route) => {
    const item = route.request().url().match(/\/item\/(\d+)\.json/);
    const id = item ? Number(item[1]) : 0;
    await route.fulfill({
      json: item ? {
        id, type: "story", title: titles[(id - 1) % titles.length],
        url: id % 6 === 5 ? undefined : `https://${id === 1 ? "postalemployeenetwork.com" : "example.com"}/story/${id}`,
        by: "ilamont", time: Math.floor(Date.now() / 1000) - 7200,
        score: id === 1 ? 82 : 100 + id, descendants: id === 1 ? 40 : id * 3,
      } : Array.from({ length: 90 }, (_, index) => index + 1),
    });
  });
}
