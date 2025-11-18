import UserPageClient from './UserPageClient';

export function generateStaticParams(): { username: string }[] {
    // Generate a placeholder page - actual data is fetched client-side
    return [{ username: 'placeholder' }];
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default function UserPage(props: PageProps) {
    return <UserPageClient />;
}
