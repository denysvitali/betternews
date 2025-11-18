import StoryPageClient from './StoryPageClient';

export function generateStaticParams(): { id: string }[] {
    // Generate a placeholder page - actual data is fetched client-side
    return [{ id: 'placeholder' }];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoryPage(props: PageProps) {
    return <StoryPageClient />;
}
