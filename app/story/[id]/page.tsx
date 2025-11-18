import StoryPageClient from './StoryPageClient';

export async function generateStaticParams(): Promise<{ id: string }[]> {
    try {
        // Fetch top stories from Hacker News API during build time
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds: number[] = await response.json();

        // Pre-generate pages for top 500 stories to avoid 404s
        // Since data is fetched client-side, we just need the HTML shell to exist
        const storiesToGenerate = topStoryIds.slice(0, 500);

        console.log(`Generating static pages for ${storiesToGenerate.length} top stories`);

        return storiesToGenerate.map(id => ({ id: String(id) }));
    } catch (error) {
        console.error('Failed to fetch top stories for static generation:', error);
        // Fallback to placeholder if fetch fails during build
        return [{ id: 'placeholder' }];
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoryPage(props: PageProps) {
    return <StoryPageClient />;
}
