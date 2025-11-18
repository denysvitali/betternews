import UserPageClient from './UserPageClient';

export function generateStaticParams(): { username: string }[] {
    return [];
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default function UserPage(props: PageProps) {
    return <UserPageClient />;
}
