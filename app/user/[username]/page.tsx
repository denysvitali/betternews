import UserPageClient from './UserPageClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
    // Generate a placeholder to satisfy Next.js requirements
    return [{ username: '_placeholder' }];
}

export default function UserPage() {
    return <UserPageClient />;
}
