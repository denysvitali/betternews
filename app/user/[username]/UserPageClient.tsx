"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useUser, useUserItems } from "@/lib/hooks";
import { UserProfile } from "@/components/UserProfile";
import { Suspense } from "react";
import { PageLayout, PageLoading, PageError } from "@/components/ui";

interface UserPageProps {
    username?: string;
}

function UserPageContent({ username: propUsername }: UserPageProps) {
    const params = useParams();
    const searchParams = useSearchParams();
    const paramUsername = params?.username ? (Array.isArray(params.username) ? params.username[0] : params.username) : undefined;
    const username = propUsername || paramUsername || "";
    const tab = searchParams.get("tab") || "submissions";

    const { user, loading: userLoading, error: userError } = useUser(username);
    // If user exists, fetch items
    const { items, loading: itemsLoading } = useUserItems(user?.submitted || [], 30);

    if (userLoading) {
        return <PageLoading />;
    }

    if (userError || !user) {
        return (
            <PageLayout>
                <PageError message="User not found." />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <UserProfile
                user={user}
                items={items}
                activeTab={tab}
                loading={itemsLoading}
            />
        </PageLayout>
    );
}

export default function UserPageClient({ username }: UserPageProps) {
    return (
        <Suspense fallback={<PageLoading />}>
            <UserPageContent username={username} />
        </Suspense>
    );
}
