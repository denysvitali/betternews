import { Suspense } from "react";
import StoryQueryPage from "./StoryQueryPage";
import { StoryLoadingState } from "./[id]/StoryPageClient";

// Statically prerendered shell for every story. The id travels in the query
// string so opening a story from the app is a client-side navigation instead of
// a full page load (static hosting only prerenders known dynamic segments).
export default function StoryPage() {
  return (
    <Suspense fallback={<StoryLoadingState />}>
      <StoryQueryPage />
    </Suspense>
  );
}
