import StoryPageClient from './StoryPageClient';

export function generateStaticParams(): { id: string }[] {
    // Return empty array - all routes handled by 404 page for dynamic content
    return [];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoryPage(props: PageProps) {
    return <StoryPageClient />;
}
