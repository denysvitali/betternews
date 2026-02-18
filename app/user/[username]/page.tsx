import UserPageClient from './UserPageClient';

export async function generateStaticParams() {
    return [{ username: '_placeholder' }];
}

export default function UserPage() {
    return <UserPageClient />;
}
