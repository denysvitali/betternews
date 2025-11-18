import UserPageClient from './UserPageClient';

export function generateStaticParams(): { username: string }[] {
    // Return empty array - all routes handled by 404 page for dynamic content
    return [];
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default function UserPage(props: PageProps) {
    return <UserPageClient />;
}
