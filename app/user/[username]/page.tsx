import UserPageClient from './UserPageClient';

export async function generateStaticParams(): Promise<{ username: string }[]> {
    try {
        // Fetch top stories to extract active usernames during build time
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds: number[] = await response.json();

        // Fetch details for top 100 stories to get author usernames
        const storyDetailsPromises = topStoryIds.slice(0, 100).map(async (id) => {
            try {
                const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return await res.json();
            } catch {
                return null;
            }
        });

        const stories = await Promise.all(storyDetailsPromises);

        // Extract unique usernames from story authors
        const usernames = new Set<string>();
        stories.forEach(story => {
            if (story?.by) {
                usernames.add(story.by);
            }
        });

        console.log(`Generating static pages for ${usernames.size} user profiles`);

        return Array.from(usernames).map(username => ({ username }));
    } catch (error) {
        console.error('Failed to fetch users for static generation:', error);
        // Fallback to placeholder if fetch fails during build
        return [{ username: 'placeholder' }];
    }
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default function UserPage(props: PageProps) {
    return <UserPageClient />;
}
