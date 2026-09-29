import type { Page } from "@playwright/test";
import { mockFeed } from "./feed-fixture";

export async function mockDiscussion(page: Page) {
  await mockFeed(page);
  await page.route("https://hacker-news.firebaseio.com/v0/item/*.json", async (route) => {
    const id = Number(route.request().url().match(/\/item\/(\d+)\.json/)?.[1]);
    const now = Math.floor(Date.now() / 1000);
    if (id === 1 || id === 5) {
      await route.fulfill({ json: {
        id, type: "story", by: "ilamont", time: now - 7200, score: 82, descendants: 27,
        title: id === 1 ? "U.S. postal inspectors shut down website selling counterfeit postage labels" : "Ask HN: What are you working on this month?",
        url: id === 1 ? "https://postalemployeenetwork.com/story/1" : undefined,
        text: id === 5 ? "<p>Share what you are making, what you have learned, and what you would like help with.</p><p>Small projects are welcome too.</p>" : undefined,
        kids: Array.from({ length: 24 }, (_, index) => 1001 + index),
      } });
    } else if (id >= 1000) {
      const nested = id >= 2000;
      await route.fulfill({ json: {
        id, type: "comment", by: id === 1002 ? "ilamont" : nested ? `reply${id}` : `reader${id - 1000}`,
        time: now - 10000 + id, parent: id === 2001 ? 1001 : id === 3001 ? 2001 : id === 4001 ? 3001 : 1,
        text: nested ? "There is a useful distinction here. Clear information matters more than a complicated interface." : "<p>The interesting part is how much trust we place in everyday systems. A small improvement to the way this works could make a real difference.</p>",
        kids: id === 1001 ? [2001] : id === 2001 ? [3001] : id === 3001 ? [4001] : [],
      } });
    } else {
      await route.fallback();
    }
  });
}
