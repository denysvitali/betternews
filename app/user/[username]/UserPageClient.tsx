"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useUser, useUserItems } from "@/lib/hooks";
import { Navbar } from "@/components/Navbar";
import { UserProfile } from "@/components/UserProfile";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function UserPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const username = params?.username as string || "";
    const tab = searchParams.get("tab") || "submissions";

    const { user, loading: userLoading, error: userError } = useUser(username);
    // If user exists, fetch items
    const { items, loading: itemsLoading } = useUserItems(user?.submitted || [], 30);

    if (userLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                </main>
            </div>
        );
    }

    if (userError || !user) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        User not found.
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black">
            <Navbar />
            <main className="container mx-auto max-w-4xl px-4 py-8">
                <UserProfile 
                    user={user} 
                    items={items} 
                    activeTab={tab} 
                    loading={itemsLoading} 
                />
            </main>
        </div>
    );
}

export default function UserPageClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                </main>
            </div>
        }>
            <UserPageContent />
        </Suspense>
    );
}
