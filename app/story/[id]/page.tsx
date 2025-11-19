import StoryPageClient from './StoryPageClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    // Generate a placeholder to satisfy Next.js requirements
    return [{ id: '_placeholder' }];
}

export default function StoryPage() {
    return <StoryPageClient />;
}
