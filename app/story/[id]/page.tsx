import StoryPageClient from './StoryPageClient';

export async function generateStaticParams() {
    return [{ id: '_placeholder' }];
}

export default function StoryPage() {
    return <StoryPageClient />;
}
