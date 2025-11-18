import StoryPageClient from './StoryPageClient';

export function generateStaticParams(): { id: string }[] {
    return [];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoryPage(props: PageProps) {
    return <StoryPageClient />;
}
