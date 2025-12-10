import { Button } from "@/components/ui/button";
import WrapCard from "@/components/wrap-card";
import TimelineFeed from "@/components/timeline-feed";
import SecretVault from "@/components/secret-vault";
import AIInsights from "@/components/ai-insights";
import { Plus, LayoutGrid, MessageSquare, Lock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // @ts-ignore
    const wraps = await prisma.wrap.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            responses: true,
            secrets: true,
        }
    });

    // Flatten all responses for timeline
    const allResponses = wraps.flatMap((w: any) => w.responses.map((r: any) => ({
        id: r.id,
        wrapTitle: w.title,
        senderName: r.name,
        message: Object.values(r.answers)[0] as string, // Naive pick first answer as message
        createdAt: r.createdAt,
        photoUrl: r.photoUrl
    }))).sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

    // Flatten all secrets
    const allSecrets = wraps.flatMap((w: any) => w.secrets.map((s: any) => ({
        id: s.id,
        wrapTitle: w.title,
        senderName: s.senderName,
        unlockDate: s.unlockDate,
        content: s.content,
        isLocked: new Date() < new Date(s.unlockDate)
    })));

    // Calculate Stats
    const totalMemories = wraps.reduce((acc: number, w: any) => acc + w.responses.length, 0);
    const avgVibeScore = wraps.reduce((acc: number, w: any) => acc + (w.vibeScore || 0), 0) / (wraps.length || 1);

    // Mocked user summary for now until we have real generation
    const userSummary = wraps.length > 0
        ? "You're collecting a beautiful tapestry of memories. Your friends appreciate your warmth."
        : "Start collecting memories to see your vibe check!";

    return {
        wraps: wraps.map((w: any) => ({
            id: w.id,
            title: w.title,
            slug: w.linkSlug,
            responseCount: w.responses.length,
            vibeScore: w.vibeScore || undefined,
            isLocked: false,
            unlockDate: "Coming Soon",
        })),
        timeline: allResponses.slice(0, 5), // Latest 5
        secrets: allSecrets,
        stats: {
            totalMemories,
            avgVibeScore: Math.round(avgVibeScore || 0),
            topKeywords: ["Funny", "Kind", "Iconic"], // Mocked for now
            vibeSummary: userSummary
        }
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();
    if (!data) return <div>Please log in</div>;

    const { wraps, timeline, secrets, stats } = data;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

            {/* Header & AI Insights */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Overview of your collected memories and secrets.
                    </p>
                    <Link href="/wrap/create">
                        <Button size="lg" className="shadow-lg shadow-brand-purple/20 bg-brand-purple hover:bg-brand-purple/90">
                            <Plus className="mr-2 w-5 h-5" /> Create New Wrap
                        </Button>
                    </Link>
                </div>
                <div className="md:col-span-1">
                    <AIInsights stats={stats} />
                </div>
            </div>

            {/* Section 1: Your Wraps */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Your Wraps</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wraps.map((wrap: any) => (
                        <Link href={`/dashboard/wrap/${wrap.id}`} key={wrap.id}>
                            <WrapCard {...wrap} />
                        </Link>
                    ))}

                    {/* Create Card */}
                    <Link href="/wrap/create" className="group border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all min-h-[200px]">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-brand-purple" />
                        </div>
                        <span className="font-medium text-gray-500 group-hover:text-brand-purple">Start new collection</span>
                    </Link>
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Section 2: Memory Timeline */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-pink-100 p-2 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-pink-600" />
                        </div>
                        <h2 className="text-2xl font-bold">Memory Timeline</h2>
                    </div>
                    <TimelineFeed items={timeline} />
                </section>

                {/* Section 3: Secret Vault */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <Lock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold">Secret Vault</h2>
                    </div>
                    <SecretVault secrets={secrets} />
                </section>
            </div>
        </div>
    );
}
