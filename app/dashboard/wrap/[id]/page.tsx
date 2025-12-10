import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Users, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AnalyzeButton from "@/components/analyze-button";
import ShareWrapSection from "@/components/share-wrap-section";
import ResponseList from "@/components/response-list";
import DeleteWrapButton from "@/components/delete-wrap-button";

export default async function WrapDashboard({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { id } = await params;

    const wrap = await prisma.wrap.findUnique({
        where: { id },
        include: {
            responses: true,
            prompts: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!wrap) notFound();
    // Authorization check
    if (wrap.userId !== (session.user as any).id) redirect("/dashboard");

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{wrap.title}</h1>
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            /{wrap.linkSlug}
                        </span>
                    </div>
                    <p className="text-gray-600">Created on {wrap.createdAt.toLocaleDateString()}</p>
                </div>
                {/* Share Actions */}
                <div className="flex gap-3 items-center">
                    <Link href={`/wrap/${wrap.linkSlug}`} target="_blank">
                        <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" /> Open Public Page
                        </Button>
                    </Link>
                    <DeleteWrapButton wrapId={wrap.id} wrapTitle={wrap.title} />
                </div>
            </div>

            {/* NEW SHARE PROMPT SECTION */}
            {wrap.responses.length === 0 && (
                <ShareWrapSection linkSlug={wrap.linkSlug} />
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Stats Column */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Collection Status</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-brand-purple" />
                            <span className="text-2xl font-bold">{wrap.responses.length}</span>
                            <span className="text-gray-500">Responses</span>
                        </div>
                    </div>

                    {/* AI Vibe Check Section */}
                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-indigo-900">AI Vibe Check</h3>
                        </div>

                        {wrap.vibeScore ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                                    <span className="text-sm font-medium">Vibe Score</span>
                                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600">
                                        {wrap.vibeScore}/100
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 italic">
                                    "{wrap.vibeSummary}"
                                </div>
                                {wrap.archetype && (
                                    <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                        {wrap.archetype}
                                    </div>
                                )}
                                {/* Re-Analyze Button */}
                                <AnalyzeButton wrapId={wrap.id} hasScore={true} />
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-600">
                                    Unlock AI insights to see your Vibe Score, Friendship Archetype, and more.
                                </p>
                                <AnalyzeButton wrapId={wrap.id} hasScore={false} disabled={wrap.responses.length === 0} />
                                {wrap.responses.length === 0 && (
                                    <p className="text-xs text-red-400">Collect at least 1 response to analyze.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Responses List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg">Responses</h3>
                    <ResponseList responses={wrap.responses} prompts={wrap.prompts} />
                </div>
            </div>
        </div>
    );
}
