
'use client';

import { Sparkles, Zap, Heart } from 'lucide-react';

interface AIStats {
    totalMemories: number;
    avgVibeScore: number;
    topKeywords: string[];
    vibeSummary: string;
}

export default function AIInsights({ stats }: { stats: AIStats }) {
    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1 text-white shadow-lg overflow-hidden">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <h2 className="font-bold text-lg">AI Vibe Check</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-md">
                            <span className="block text-2xl font-black">{stats.avgVibeScore}</span>
                            <span className="text-xs opacity-80 uppercase tracking-widest">Vibe Score</span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-md">
                            <span className="block text-2xl font-black">{stats.totalMemories}</span>
                            <span className="text-xs opacity-80 uppercase tracking-widest">Memories</span>
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed opacity-90 font-medium">
                        {stats.vibeSummary || "Collect more memories to generate your customized AI vibe summary!"}
                    </p>
                </div>

                {stats.topKeywords.length > 0 && (
                    <div className="mt-6">
                        <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Friends say you are</p>
                        <div className="flex flex-wrap gap-2">
                            {stats.topKeywords.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold border border-white/10">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
