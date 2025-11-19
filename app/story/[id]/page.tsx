import StoryPageClient from './StoryPageClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    // Generate a placeholder to satisfy Next.js requirements
    return [{ id: '_placeholder' }];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StoryPage(props: PageProps) {
    return <StoryPageClient />;
}
