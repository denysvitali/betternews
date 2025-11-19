import UserPageClient from './UserPageClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    // Generate a placeholder to satisfy Next.js requirements
    return [{ username: '_placeholder' }];
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default function UserPage(props: PageProps) {
    return <UserPageClient />;
}
